import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  data: Record<string, any>;
  update: (d: Record<string, any>) => void;
  onNext: () => void;
}

const StepAccount = ({ data, update, onNext }: Props) => {
  const [showPw, setShowPw] = useState(false);
  const email = data.email || "";
  const password = data.password || "";

  const strength = password.length >= 8 ? (password.match(/[A-Z]/) && password.match(/[0-9]/) ? 3 : 2) : password.length > 0 ? 1 : 0;
  const strengthLabels = ["", "Schwach", "Mittel", "Stark"];
  const strengthColors = ["", "bg-destructive", "bg-accent", "bg-secondary"];

  const canContinue = email.includes("@") && password.length >= 8;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Account erstellen</h2>
        <p className="text-muted-foreground">Erstelle deinen ZumArzt Account, um Termine zu buchen.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail-Adresse</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="max@beispiel.de"
              className="pl-10"
              value={email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Passwort</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="Mindestens 8 Zeichen"
              className="pl-10 pr-10"
              value={password}
              onChange={(e) => update({ password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {strength > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= strength ? strengthColors[strength] : "bg-muted"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{strengthLabels[strength]}</span>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full py-5 text-sm"
          onClick={() => {/* TODO: Google OAuth */}}
        >
          <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4 mr-2" />
          Mit Google registrieren
        </Button>
      </div>

      <Button className="w-full py-6 text-base" disabled={!canContinue} onClick={onNext}>
        Weiter
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Bereits registriert?{" "}
        <Link to="/app/patient/login" className="text-primary font-medium hover:underline">
          Anmelden
        </Link>
      </p>
    </div>
  );
};

export default StepAccount;
