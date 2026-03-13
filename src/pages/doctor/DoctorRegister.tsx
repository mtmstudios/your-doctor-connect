import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Building2, CheckCircle, ArrowLeft, Mail, Lock,
  Phone, Globe, Shield, Star, Upload,
} from "lucide-react";

const SPECIALTIES = [
  "Orthopädie", "Dermatologie", "Neurologie", "Kardiologie",
  "Psychiatrie", "Urologie", "HNO", "Augenheilkunde",
  "Gynäkologie", "Innere Medizin", "Chirurgie", "Radiologie",
];

const LANGUAGES = ["Deutsch", "Englisch", "Türkisch", "Arabisch", "Russisch", "Französisch"];

const STEPS = ["Account", "Praxis", "Versicherung", "Verifizierung"];

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    practiceName: "",
    specialties: [] as string[],
    address: "",
    plz: "",
    city: "",
    phone: "",
    website: "",
    acceptsGkv: true,
    acceptsPkv: false,
    languages: ["Deutsch"],
    wheelchairAccessible: false,
    slotDuration: "20",
  });

  const update = (data: Partial<typeof form>) => setForm((f) => ({ ...f, ...data }));

  const toggleArray = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: "doctor" } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Account-Erstellung fehlgeschlagen.");

      const { error: practiceError } = await supabase.from("practices").insert({
        user_id: authData.user.id,
        name: form.practiceName,
        specialty: form.specialties,
        address: form.address,
        plz: form.plz,
        city: form.city,
        phone: form.phone,
        website: form.website || null,
        accepts_gkv: form.acceptsGkv,
        accepts_pkv: form.acceptsPkv,
        languages: form.languages,
        wheelchair_accessible: form.wheelchairAccessible,
        slot_duration_min: parseInt(form.slotDuration),
        is_verified: false,
        plan: "free",
      });
      if (practiceError) throw practiceError;

      toast.success("Registrierung erfolgreich! Wir prüfen Ihre Praxis innerhalb von 24h.");
      navigate("/app/doctor/dashboard");
    } catch (err: any) {
      toast.error("Fehler: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-xl">

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i < currentStep
                      ? "bg-secondary text-secondary-foreground"
                      : i === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── STEP 0: Account ── */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Arzt-Account erstellen</h2>
                  <p className="text-muted-foreground mt-1">
                    Kostenlos registrieren — kein Vertrag, jederzeit kündbar.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>E-Mail der Praxis</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        type="email"
                        placeholder="praxis@beispiel.de"
                        value={form.email}
                        onChange={(e) => update({ email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Passwort</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        type="password"
                        placeholder="Mindestens 8 Zeichen"
                        value={form.password}
                        onChange={(e) => update({ password: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full py-6"
                  disabled={!form.email.includes("@") || form.password.length < 8}
                  onClick={() => setCurrentStep(1)}
                >
                  Weiter
                </Button>
              </div>
            )}

            {/* ── STEP 1: Praxis-Daten ── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Praxis-Daten</h2>
                  <p className="text-muted-foreground mt-1">Wie heißt Ihre Praxis und wo ist sie?</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Praxisname</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="Praxis Dr. Müller"
                        value={form.practiceName}
                        onChange={(e) => update({ practiceName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Fachrichtungen</Label>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTIES.map((s) => (
                        <button
                          key={s}
                          onClick={() => update({ specialties: toggleArray(form.specialties, s) })}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                            form.specialties.includes(s)
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {form.specialties.length === 0 && (
                      <p className="text-xs text-destructive">Mindestens eine Fachrichtung wählen</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Straße + Hausnummer</Label>
                    <Input
                      placeholder="Leopoldstraße 42"
                      value={form.address}
                      onChange={(e) => update({ address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>PLZ</Label>
                      <Input
                        placeholder="80802"
                        maxLength={5}
                        value={form.plz}
                        onChange={(e) => update({ plz: e.target.value.replace(/\D/g, "") })}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Stadt</Label>
                      <Input
                        placeholder="München"
                        value={form.city}
                        onChange={(e) => update({ city: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="+49 89 123456"
                        value={form.phone}
                        onChange={(e) => update({ phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Website{" "}
                      <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="https://praxis-mueller.de"
                        value={form.website}
                        onChange={(e) => update({ website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="py-6" onClick={() => setCurrentStep(0)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />Zurück
                  </Button>
                  <Button
                    className="flex-1 py-6"
                    disabled={!form.practiceName || !form.address || !form.plz || !form.city || form.specialties.length === 0}
                    onClick={() => setCurrentStep(2)}
                  >
                    Weiter
                  </Button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Versicherung & Details ── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Versicherung & Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">GKV-Patienten</div>
                        <div className="text-xs text-muted-foreground">Gesetzlich versicherte Patienten</div>
                      </div>
                    </div>
                    <Switch
                      checked={form.acceptsGkv}
                      onCheckedChange={(v) => update({ acceptsGkv: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-accent" />
                      <div>
                        <div className="font-medium">PKV-Patienten</div>
                        <div className="text-xs text-muted-foreground">Privat versicherte Patienten</div>
                      </div>
                    </div>
                    <Switch
                      checked={form.acceptsPkv}
                      onCheckedChange={(v) => update({ acceptsPkv: v })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gesprochene Sprachen</Label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l}
                          onClick={() => update({ languages: toggleArray(form.languages, l) })}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                            form.languages.includes(l)
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border">
                    <div>
                      <div className="font-medium">Barrierefreier Zugang</div>
                      <div className="text-xs text-muted-foreground">Rollstuhlgerecht</div>
                    </div>
                    <Switch
                      checked={form.wheelchairAccessible}
                      onCheckedChange={(v) => update({ wheelchairAccessible: v })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Standard Termin-Dauer</Label>
                    <div className="flex gap-2">
                      {["15", "20", "30", "45"].map((d) => (
                        <button
                          key={d}
                          onClick={() => update({ slotDuration: d })}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            form.slotDuration === d
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          {d} Min.
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="py-6" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />Zurück
                  </Button>
                  <Button className="flex-1 py-6" onClick={() => setCurrentStep(3)}>
                    Weiter
                  </Button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Verifizierung ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Verifizierung</h2>
                  <p className="text-muted-foreground mt-1">
                    Wir prüfen Ihre Praxis innerhalb von 24 Stunden.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 transition-colors cursor-pointer text-center space-y-2">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  <div className="font-medium">Approbationsurkunde hochladen</div>
                  <div className="text-xs text-muted-foreground">PDF, JPG oder PNG</div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                  Alle Daten liegen auf deutschen Servern (Hetzner, Nürnberg) und werden
                  DSGVO-konform verarbeitet.
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="py-6" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />Zurück
                  </Button>
                  <Button
                    className="flex-1 py-6 bg-secondary hover:bg-secondary/90"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Registrieren...
                      </span>
                    ) : (
                      <><CheckCircle className="w-5 h-5 mr-2" />Registrierung abschließen</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoctorRegister;
