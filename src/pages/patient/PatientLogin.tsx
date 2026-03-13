import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { enableDemoMode } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Bitte E-Mail und Passwort eingeben.");
      return;
    }
    if (!isSupabaseConfigured) {
      toast.error("Supabase nicht konfiguriert. Nutze den Demo-Login.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Anmeldung fehlgeschlagen: " + error.message);
      return;
    }
    toast.success("Erfolgreich angemeldet!");
    navigate("/app/patient/dashboard");
  };

  const handleDemoLogin = () => {
    enableDemoMode();
    toast.success("Demo-Modus aktiviert! Du kannst jetzt alles testen.");
    navigate("/app/patient/dashboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-1">Anmelden</h1>
        <p className="text-muted-foreground mb-8">Melde dich bei deinem ZumArzt Konto an.</p>

        {/* Demo Login CTA */}
        <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 mb-6">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-0.5">Demo-Modus</p>
              <p className="text-xs text-muted-foreground mb-3">
                Kein Account nötig — teste alle Funktionen direkt.
              </p>
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleDemoLogin}
              >
                <Zap className="w-4 h-4 mr-2" />
                Demo starten — kein Login nötig
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 my-5">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">oder mit Account</span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="max@beispiel.de"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button
            className="w-full py-6"
            disabled={loading || !isSupabaseConfigured}
            onClick={handleLogin}
          >
            {loading ? "Anmelden..." : "Anmelden"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Noch kein Konto?{" "}
            <Link to="/app/patient/register" className="text-primary font-medium hover:underline">
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
