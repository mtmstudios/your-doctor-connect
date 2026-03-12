import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Star, ArrowLeft, Info } from "lucide-react";

interface Props {
  data: Record<string, any>;
  update: (d: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const gkvOptions = ["AOK", "TK - Techniker Krankenkasse", "Barmer", "DAK-Gesundheit", "IKK classic", "KKH", "hkk", "BKK"];
const pkvOptions = ["Allianz Private", "DKV", "Signal Iduna", "Debeka", "AXA", "Barmenia", "HUK-Coburg"];

const StepInsurance = ({ data, update, onNext, onBack }: Props) => {
  const type = data.insuranceType || "";
  const canContinue = type && (type === "gkv" ? data.insuranceCompany : data.insuranceCompany);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Krankenversicherung</h2>
        <p className="text-muted-foreground">Wie bist du versichert?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            type === "gkv"
              ? "border-primary bg-primary/5 shadow-card-hover"
              : "border-border hover:border-primary/30"
          }`}
          onClick={() => update({ insuranceType: "gkv", insuranceCompany: "" })}
        >
          <Shield className={`w-8 h-8 mb-3 ${type === "gkv" ? "text-primary" : "text-muted-foreground"}`} />
          <div className="font-semibold text-foreground">Gesetzlich</div>
          <div className="text-sm text-muted-foreground">GKV</div>
        </button>

        <button
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            type === "pkv"
              ? "border-accent bg-accent/5 shadow-card-hover"
              : "border-border hover:border-accent/30"
          }`}
          onClick={() => update({ insuranceType: "pkv", insuranceCompany: "" })}
        >
          <Star className={`w-8 h-8 mb-3 ${type === "pkv" ? "text-accent" : "text-muted-foreground"}`} />
          <div className="font-semibold text-foreground">Privat</div>
          <div className="text-sm text-muted-foreground">PKV</div>
        </button>
      </div>

      {type && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label>{type === "gkv" ? "Krankenkasse" : "Versicherungsgesellschaft"}</Label>
            <Input
              placeholder="Suchen..."
              list="insurance-options"
              value={data.insuranceCompany || ""}
              onChange={(e) => update({ insuranceCompany: e.target.value })}
            />
            <datalist id="insurance-options">
              {(type === "gkv" ? gkvOptions : pkvOptions).map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </div>

          {type === "gkv" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Versichertennummer</Label>
                <span className="text-xs text-muted-foreground">(optional)</span>
              </div>
              <Input
                placeholder="A123456789"
                value={data.insuranceNumber || ""}
                onChange={(e) => update({ insuranceNumber: e.target.value })}
              />
            </div>
          )}

          {type === "pkv" && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <Info className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">
                PKV-Patienten erhalten in der Regel schneller Termine.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="py-6" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <Button className="flex-1 py-6 text-base" disabled={!canContinue} onClick={onNext}>
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default StepInsurance;
