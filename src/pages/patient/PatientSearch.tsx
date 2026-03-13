import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";
import {
  ScanLine, Edit3, Upload, CheckCircle2, Loader2,
  MapPin, Shield, Star, ArrowRight, X
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const FACHRICHTUNGEN = [
  "Orthopädie", "Dermatologie", "Neurologie", "Kardiologie",
  "Gastroenterologie", "Psychiatrie", "Urologie", "HNO",
  "Augenheilkunde", "Gynäkologie", "Onkologie", "Radiologie",
  "Chirurgie", "Innere Medizin", "Endokrinologie", "Rheumatologie",
  "Pneumologie", "Nephrologie", "Hämatologie",
];

const N8N_OCR_WEBHOOK = import.meta.env.VITE_N8N_OCR_WEBHOOK as string;
const N8N_SEARCH_WEBHOOK = import.meta.env.VITE_N8N_SEARCH_WEBHOOK as string;

interface OcrResult {
  specialty: string;
  date: string;
  issuingDoctor: string;
  confidence: number;
}

const PatientSearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"choose" | "scan" | "manual">("choose");
  const [step, setStep] = useState<"input" | "params">("input");

  // OCR state
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);

  // Search params
  const [specialty, setSpecialty] = useState("");
  const [plz, setPlz] = useState("");
  const [radius, setRadius] = useState([10]);
  const [insuranceType, setInsuranceType] = useState("");
  const [searching, setSearching] = useState(false);

  const handleFileSelect = async (file: File) => {
    setScanFile(file);
    const url = URL.createObjectURL(file);
    setScanPreview(url);
    setOcrLoading(true);

    try {
      // Send to n8n OCR webhook if available, otherwise use mock
      if (N8N_OCR_WEBHOOK) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("patientId", user?.id || "");
        const res = await fetch(N8N_OCR_WEBHOOK, { method: "POST", body: formData });
        const result = await res.json();
        setOcrResult(result);
        setSpecialty(result.specialty || "");
      } else {
        // Mock OCR for development
        await new Promise((r) => setTimeout(r, 2000));
        const mock: OcrResult = {
          specialty: "Orthopädie",
          date: new Date().toLocaleDateString("de-DE"),
          issuingDoctor: "Dr. med. Müller",
          confidence: 0.92,
        };
        setOcrResult(mock);
        setSpecialty(mock.specialty);
      }
      toast.success("Überweisung erfolgreich ausgelesen!");
    } catch {
      toast.error("OCR fehlgeschlagen. Bitte manuell eingeben.");
      setMode("manual");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!specialty || !plz) {
      toast.error("Bitte Fachrichtung und PLZ eingeben.");
      return;
    }
    setSearching(true);

    try {
      let results;

      if (N8N_SEARCH_WEBHOOK) {
        const res = await fetch(N8N_SEARCH_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            specialty,
            plz,
            radiusKm: radius[0],
            insuranceType,
            patientId: user?.id,
          }),
        });
        results = await res.json();
      } else {
        // Mock results for development
        await new Promise((r) => setTimeout(r, 1500));
        results = getMockResults(specialty, plz);
      }

      navigate("/app/patient/results", {
        state: { results, specialty, plz, radius: radius[0], insuranceType },
      });
    } catch {
      toast.error("Suche fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Termin suchen</h1>
          <p className="text-muted-foreground">Überweisung scannen oder Fachrichtung eingeben</p>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Choose mode */}
          {mode === "choose" && (
            <motion.div key="choose" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => { setMode("scan"); setStep("input"); }}
                  className="p-6 rounded-2xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shrink-0">
                      <ScanLine className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-lg">Überweisung scannen</div>
                      <div className="text-sm text-muted-foreground mt-0.5">Foto hochladen — wir lesen alles automatisch aus</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </div>
                </button>

                <button
                  onClick={() => { setMode("manual"); setStep("input"); }}
                  className="p-6 rounded-2xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Edit3 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-lg">Manuell eingeben</div>
                      <div className="text-sm text-muted-foreground mt-0.5">Fachrichtung direkt auswählen</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2a: Scan mode */}
          {mode === "scan" && step === "input" && (
            <motion.div key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              {!scanPreview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 transition-all hover:bg-primary/5"
                >
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <div className="text-center">
                    <div className="font-medium text-foreground">Überweisung hochladen</div>
                    <div className="text-sm text-muted-foreground">JPG, PNG oder PDF</div>
                  </div>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border">
                  <img src={scanPreview} alt="Überweisung" className="w-full object-contain max-h-64" />
                  {ocrLoading && (
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-3">
                      <div className="relative w-full h-1 bg-muted overflow-hidden">
                        <div className="absolute h-full w-1/3 bg-primary animate-[scan_1.5s_ease-in-out_infinite]" style={{ animation: "scanline 1.5s ease-in-out infinite" }} />
                      </div>
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-sm font-medium">Überweisung wird ausgelesen...</span>
                    </div>
                  )}
                  <button
                    onClick={() => { setScanPreview(null); setScanFile(null); setOcrResult(null); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {ocrResult && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-secondary/10 border border-secondary/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Erkannte Daten ({Math.round(ocrResult.confidence * 100)}% Konfidenz)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fachrichtung:</span>
                      <span className="ml-1 font-medium text-foreground">{ocrResult.specialty}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Datum:</span>
                      <span className="ml-1 font-medium text-foreground">{ocrResult.date}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Ausstellender Arzt:</span>
                      <span className="ml-1 font-medium text-foreground">{ocrResult.issuingDoctor}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="py-5" onClick={() => setMode("choose")}>Zurück</Button>
                <Button
                  className="flex-1 py-5"
                  disabled={!ocrResult && !ocrLoading}
                  onClick={() => setStep("params")}
                >
                  Weiter
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2b: Manual mode */}
          {mode === "manual" && step === "input" && (
            <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="space-y-2">
                <Label>Fachrichtung</Label>
                <Input
                  placeholder="Fachrichtung suchen..."
                  list="fachrichtungen"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
                <datalist id="fachrichtungen">
                  {FACHRICHTUNGEN.map((f) => <option key={f} value={f} />)}
                </datalist>
              </div>
              <div className="flex flex-wrap gap-2">
                {FACHRICHTUNGEN.slice(0, 8).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSpecialty(f)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${specialty === f ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/40"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="py-5" onClick={() => setMode("choose")}>Zurück</Button>
                <Button className="flex-1 py-5" disabled={!specialty} onClick={() => setStep("params")}>Weiter</Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Search params */}
          {step === "params" && (
            <motion.div key="params" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="p-4 rounded-xl bg-muted/50 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="font-medium">{specialty}</span>
                <button className="ml-auto text-xs text-muted-foreground underline" onClick={() => setStep("input")}>Ändern</button>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> PLZ</Label>
                <Input
                  placeholder="z.B. 80331"
                  maxLength={5}
                  value={plz}
                  onChange={(e) => setPlz(e.target.value.replace(/\D/g, "").slice(0, 5))}
                />
              </div>

              <div className="space-y-3">
                <Label>Suchradius: {radius[0]} km</Label>
                <Slider min={5} max={50} step={5} value={radius} onValueChange={setRadius} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 km</span><span>25 km</span><span>50 km</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kassenart</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "", label: "Egal", icon: null },
                    { value: "gkv", label: "GKV", icon: <Shield className="w-4 h-4" /> },
                    { value: "pkv", label: "PKV", icon: <Star className="w-4 h-4" /> },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setInsuranceType(opt.value)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium flex items-center justify-center gap-2 transition-all ${insuranceType === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"}`}
                    >
                      {opt.icon}{opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="py-5" onClick={() => setStep("input")}>Zurück</Button>
                <Button
                  className="flex-1 py-5 text-base"
                  disabled={!plz || searching}
                  onClick={handleSearch}
                >
                  {searching ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Suche läuft...</>
                  ) : (
                    <>3 Termine finden <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function getMockResults(specialty: string, _plz: string) {
  return [
    {
      id: "1",
      rank: 1,
      name: "Dr. med. Sarah Hoffmann",
      specialty,
      address: "Leopoldstraße 42, 80802 München",
      distance_km: 1.2,
      rating_avg: 4.7,
      rating_count: 143,
      accepts_gkv: true,
      accepts_pkv: true,
      languages: ["Deutsch", "Englisch"],
      next_slot: { date: "2026-03-18", time: "09:30", duration: 30 },
      photo_url: null,
    },
    {
      id: "2",
      rank: 2,
      name: "Dr. med. Klaus Weber",
      specialty,
      address: "Maximilianstraße 15, 80539 München",
      distance_km: 2.8,
      rating_avg: 4.4,
      rating_count: 89,
      accepts_gkv: true,
      accepts_pkv: false,
      languages: ["Deutsch"],
      next_slot: { date: "2026-03-19", time: "11:00", duration: 20 },
      photo_url: null,
    },
    {
      id: "3",
      rank: 3,
      name: "Prof. Dr. med. Aisha Yilmaz",
      specialty,
      address: "Schillerstraße 8, 80336 München",
      distance_km: 4.1,
      rating_avg: 4.9,
      rating_count: 312,
      accepts_gkv: true,
      accepts_pkv: true,
      languages: ["Deutsch", "Türkisch", "Englisch"],
      next_slot: { date: "2026-03-20", time: "14:15", duration: 30 },
      photo_url: null,
    },
  ];
}

export default PatientSearch;
