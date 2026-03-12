import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    // TODO: Supabase auth
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Erfolgreich angemeldet!");
    navigate("/app/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">Anmelden</h1>
        <p className="text-muted-foreground mb-8">Melde dich bei deinem ZumArzt Konto an.</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@beispiel.de" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Passwort</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <Button className="w-full py-6" disabled={loading} onClick={handleLogin}>
            {loading ? "Laden..." : "Anmelden"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Noch kein Konto?{" "}
            <Link to="/app/patient/register" className="text-primary font-medium hover:underline">Registrieren</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
