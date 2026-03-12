import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface Props {
  data: Record<string, any>;
  update: (d: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPersonalData = ({ data, update, onNext, onBack }: Props) => {
  const canContinue =
    data.firstName?.trim() &&
    data.lastName?.trim() &&
    data.birthDate &&
    data.phone?.trim() &&
    data.street?.trim() &&
    data.plz?.trim() &&
    data.city?.trim();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Persönliche Daten</h2>
        <p className="text-muted-foreground">Wir benötigen diese Informationen für deine Terminbuchung.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vorname</Label>
          <Input
            placeholder="Max"
            value={data.firstName || ""}
            onChange={(e) => update({ firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Nachname</Label>
          <Input
            placeholder="Mustermann"
            value={data.lastName || ""}
            onChange={(e) => update({ lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Geburtsdatum</Label>
        <Input
          type="date"
          value={data.birthDate || ""}
          onChange={(e) => update({ birthDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Telefonnummer</Label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 bg-muted rounded-lg text-sm text-muted-foreground font-medium">
            +49
          </div>
          <Input
            type="tel"
            placeholder="170 1234567"
            className="flex-1"
            value={data.phone || ""}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Straße + Hausnummer</Label>
        <Input
          placeholder="Musterstraße 12"
          value={data.street || ""}
          onChange={(e) => update({ street: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>PLZ</Label>
          <Input
            placeholder="10115"
            maxLength={5}
            value={data.plz || ""}
            onChange={(e) => {
              const plz = e.target.value.replace(/\D/g, "").slice(0, 5);
              update({ plz });
              // Simple city autofill mock
              if (plz.length === 5) {
                const cityMap: Record<string, string> = {
                  "10115": "Berlin", "80331": "München", "20095": "Hamburg",
                  "50667": "Köln", "60311": "Frankfurt", "70173": "Stuttgart",
                };
                update({ plz, city: cityMap[plz] || data.city || "" });
              }
            }}
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label>Stadt</Label>
          <Input
            placeholder="Berlin"
            value={data.city || ""}
            onChange={(e) => update({ city: e.target.value })}
          />
        </div>
      </div>

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

export default StepPersonalData;
