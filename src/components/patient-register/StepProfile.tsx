import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  data: Record<string, any>;
  update: (d: Record<string, any>) => void;
  onBack: () => void;
}

const StepProfile = ({ data, update, onBack }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const privacyAccepted = data.privacyAccepted || false;
  const agbAccepted = data.agbAccepted || false;
  const emailNotifications = data.emailNotifications ?? true;
  const canSubmit = privacyAccepted && agbAccepted;

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: Connect to Supabase auth + profile creation
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success("Profil erfolgreich erstellt!");
    navigate("/app/patient/dashboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Profil vervollständigen</h2>
        <p className="text-muted-foreground">Fast geschafft! Nur noch ein paar Details.</p>
      </div>

      {/* Avatar upload */}
      <div className="flex justify-center">
        <button
          className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors"
          onClick={() => {/* TODO: File upload */}}
        >
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <Upload className="w-6 h-6 text-muted-foreground" />
          )}
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">Profilfoto (optional)</p>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={privacyAccepted}
            onCheckedChange={(v) => update({ privacyAccepted: !!v })}
          />
          <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
            Ich akzeptiere die{" "}
            <a href="/datenschutz" target="_blank" className="text-primary underline">
              Datenschutzerklärung
            </a>{" "}
            <span className="text-destructive">*</span>
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="agb"
            checked={agbAccepted}
            onCheckedChange={(v) => update({ agbAccepted: !!v })}
          />
          <Label htmlFor="agb" className="text-sm leading-relaxed cursor-pointer">
            Ich akzeptiere die AGB <span className="text-destructive">*</span>
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="emails"
            checked={emailNotifications}
            onCheckedChange={(v) => update({ emailNotifications: !!v })}
          />
          <Label htmlFor="emails" className="text-sm leading-relaxed cursor-pointer">
            E-Mail-Benachrichtigungen erhalten
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="py-6" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <Button
          className="flex-1 py-6 text-base bg-secondary hover:bg-secondary/90"
          disabled={!canSubmit || loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-secondary-foreground border-t-transparent rounded-full" />
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Profil erstellen & loslegen
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepProfile;
