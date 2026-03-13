# ZumArzt — Claude Code Kontext

## Was ist das?
Facharzt-Terminvergabe App für Deutschland (MTM Studios).
Patient scannt Überweisung → App zeigt 3 früheste Termine → Patient bucht → Arzt erhält Überweisung automatisch.

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Auth + PostgreSQL + Storage) — Region: eu-central-1 Frankfurt
- n8n self-hosted auf Hetzner CX21 (Nürnberg)
- framer-motion für Animationen
- date-fns (de locale) für Datumsformatierung

## Projekt-Struktur
```
src/
├── lib/
│   ├── supabase.ts        ← Supabase Client
│   ├── auth.tsx           ← AuthContext + AuthProvider + useAuth()
│   └── utils.ts
├── components/
│   ├── ProtectedRoute.tsx ← Auth Guard (redirect → /app/patient/login)
│   ├── landing/           ← Navbar, Hero, Features, Footer
│   ├── patient-register/  ← 4-Step Wizard (Account, Personal, Insurance, Profile)
│   └── ui/                ← shadcn/ui (nicht anfassen)
├── pages/
│   ├── patient/
│   │   ├── PatientLogin.tsx       ← Supabase signInWithPassword
│   │   ├── PatientRegister.tsx    ← 4-Step Wizard Wrapper
│   │   ├── PatientDashboard.tsx   ← Übersicht + Quick Actions
│   │   ├── PatientSearch.tsx      ← OCR Scan + Suche (CORE FEATURE)
│   │   ├── SearchResults.tsx      ← Top-3 Arzt-Karten
│   │   └── BookingConfirm.tsx     ← Buchungs-Bestätigung
│   └── doctor/
│       ├── DoctorRegister.tsx     ← 4-Step Arzt-Onboarding
│       └── DoctorDashboard.tsx    ← Arzt-Portal + Buchungsliste
└── supabase/
    └── schema.sql                 ← DB-Schema (einmalig im SQL Editor ausführen)
```

## Routen
| Route | Seite | Auth? |
|---|---|---|
| / | Landing Page | Nein |
| /app/patient/register | Registrierung | Nein |
| /app/patient/login | Login | Nein |
| /app/patient/dashboard | Dashboard | Ja |
| /app/patient/search | Suche + OCR | Ja |
| /app/patient/results | Top-3 Ergebnisse | Ja |
| /app/patient/booking/confirm | Buchung bestätigen | Ja |
| /app/doctor/register | Arzt-Registrierung | Nein |
| /app/doctor/dashboard | Arzt-Dashboard | Ja |

## Umgebungsvariablen (.env.local)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_N8N_SEARCH_WEBHOOK=...    ← optional, Fallback ist Mock
VITE_N8N_BOOK_WEBHOOK=...      ← optional, Fallback ist Supabase direkt
VITE_N8N_OCR_WEBHOOK=...       ← optional, Fallback ist Mock-OCR
```

## Befehle
```bash
npm install      # Dependencies installieren (einmalig)
npm run dev      # Dev-Server starten
npm run build    # Production Build
npm run test     # Vitest Unit Tests
```

## Supabase Setup (einmalig)
1. Projekt anlegen auf supabase.com → Region: eu-central-1 (Frankfurt)
2. SQL Editor → supabase/schema.sql einfügen und ausführen
3. Storage → Bucket "referrals" erstellen (privat/nicht öffentlich)
4. URL + Anon Key in .env.local eintragen

## Was noch fehlt (TODO-Backlog)
- [ ] PatientDashboard: echte Buchungen + Überweisungen aus Supabase laden
- [ ] PatientSearch: echte Google Vision OCR API anbinden (aktuell Mock)
- [ ] DoctorDashboard: Slot-Kalender (Arzt trägt Verfügbarkeit ein)
- [ ] Stripe: Subscription-Flow für Arzt-Pläne (€49 / €99 / €199)
- [ ] SMS-Erinnerungen 24h vorher via n8n + Twilio
- [ ] Warteliste-Funktion (bei vollem Kalender)
- [ ] Bewertungen nach Termin (Trigger nach Buchung)
- [ ] Geodaten: PLZ → lat/lng (für echte Radius-Suche)
- [ ] Praxis-Foto Upload zu Supabase Storage
- [ ] Passwort-Reset Flow

## DSGVO-Hinweise
- Keine Diagnosen oder Befunde speichern
- Server: Hetzner Nürnberg (Deutschland)
- Supabase Region: eu-central-1 (Frankfurt)
- RLS auf allen Tabellen aktiviert
- Patienten-Daten sind Art. 9 DSGVO (besonders schutzbedürftig)
- Rechtsanwalt vor Go-Live beauftragen (Budget: €2.000)
