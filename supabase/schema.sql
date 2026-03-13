-- ============================================================
-- ZumArzt — Supabase Schema
-- Einmalig im Supabase SQL Editor ausführen
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  phone         TEXT,
  birth_date    DATE,
  address       TEXT,
  plz           TEXT,
  city          TEXT,
  insurance_type     TEXT CHECK (insurance_type IN ('gkv', 'pkv')),
  insurance_company  TEXT,
  insurance_number   TEXT,
  avatar_url         TEXT,
  email_notifications BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Practices (Arztpraxen)
CREATE TABLE IF NOT EXISTS practices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  specialty     TEXT[] NOT NULL DEFAULT '{}',
  address       TEXT NOT NULL,
  plz           TEXT NOT NULL,
  city          TEXT NOT NULL,
  lat           DECIMAL,
  lng           DECIMAL,
  phone         TEXT,
  website       TEXT,
  photo_url     TEXT,
  accepts_gkv   BOOLEAN DEFAULT true,
  accepts_pkv   BOOLEAN DEFAULT false,
  languages     TEXT[] DEFAULT '{"Deutsch"}',
  wheelchair_accessible BOOLEAN DEFAULT false,
  slot_duration_min     INT DEFAULT 20,
  is_verified   BOOLEAN DEFAULT false,
  plan          TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  rating_avg    DECIMAL DEFAULT 0,
  rating_count  INT DEFAULT 0,
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Availability Slots
CREATE TABLE IF NOT EXISTS availability_slots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  duration_min INT DEFAULT 20,
  status      TEXT DEFAULT 'free' CHECK (status IN ('free', 'booked', 'blocked')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Bookings (Buchungen)
CREATE TABLE IF NOT EXISTS bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id         UUID REFERENCES availability_slots(id),
  practice_id     UUID REFERENCES practices(id),
  patient_id      UUID REFERENCES auth.users(id),
  patient_name    TEXT NOT NULL,
  patient_email   TEXT NOT NULL,
  patient_phone   TEXT,
  insurance_type  TEXT,
  referral_id     UUID,
  notes           TEXT,
  status          TEXT DEFAULT 'bestaetigt',
  booking_code    TEXT UNIQUE DEFAULT upper(substring(md5(random()::text), 1, 8)),
  no_show         BOOLEAN DEFAULT false,
  reminder_sent   BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Referrals (Überweisungen)
CREATE TABLE IF NOT EXISTS referrals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url            TEXT,
  ocr_raw_text        TEXT,
  extracted_specialty TEXT,
  extracted_date      DATE,
  extracted_doctor    TEXT,
  ocr_confidence      DECIMAL,
  status              TEXT DEFAULT 'new' CHECK (status IN ('new', 'used', 'expired')),
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- Reviews (Bewertungen)
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID REFERENCES bookings(id),
  practice_id UUID REFERENCES practices(id),
  patient_id  UUID REFERENCES auth.users(id),
  stars       INT CHECK (stars BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (DSGVO-konform)
-- ============================================================

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices          ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews            ENABLE ROW LEVEL SECURITY;

-- Profiles: nur eigene Daten
CREATE POLICY "profiles_own" ON profiles FOR ALL
  USING (auth.uid() = id);

-- Practices: Owner verwaltet, Öffentlichkeit liest verifizierte
CREATE POLICY "practices_owner_all" ON practices FOR ALL
  USING (user_id = auth.uid());
CREATE POLICY "practices_public_read" ON practices FOR SELECT
  USING (is_verified = true);

-- Slots: Owner verwaltet, Öffentlichkeit liest freie
CREATE POLICY "slots_owner" ON availability_slots FOR ALL
  USING (practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid()));
CREATE POLICY "slots_public_free" ON availability_slots FOR SELECT
  USING (status = 'free');

-- Bookings: Patient sieht eigene, Arzt sieht Praxis-Buchungen
CREATE POLICY "bookings_patient_read" ON bookings FOR SELECT
  USING (patient_id = auth.uid());
CREATE POLICY "bookings_practice_read" ON bookings FOR SELECT
  USING (practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid()));
CREATE POLICY "bookings_practice_update" ON bookings FOR UPDATE
  USING (practice_id IN (SELECT id FROM practices WHERE user_id = auth.uid()));
CREATE POLICY "bookings_patient_insert" ON bookings FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- Referrals: nur Owner
CREATE POLICY "referrals_owner" ON referrals FOR ALL
  USING (patient_id = auth.uid());

-- Reviews: Public lesen, Patient inseriert
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_patient_insert" ON reviews FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- ============================================================
-- Trigger: Rating-Durchschnitt automatisch aktualisieren
-- ============================================================

CREATE OR REPLACE FUNCTION update_practice_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE practices SET
    rating_avg   = (SELECT ROUND(AVG(stars)::NUMERIC, 1) FROM reviews WHERE practice_id = NEW.practice_id),
    rating_count = (SELECT COUNT(*) FROM reviews WHERE practice_id = NEW.practice_id)
  WHERE id = NEW.practice_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_practice_rating();

-- ============================================================
-- Storage Bucket: referrals (privat)
-- Im Supabase Dashboard > Storage > New Bucket: "referrals" (nicht öffentlich)
-- Dann diese Policy hinzufügen:
--
-- CREATE POLICY "referral_owner" ON storage.objects FOR ALL
--   USING (
--     bucket_id = 'referrals' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );
-- ============================================================
