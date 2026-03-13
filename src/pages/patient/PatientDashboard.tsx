import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarSearch, FileText, ArrowRight, Zap, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, demo, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split("@")[0]
    || "Patient";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Demo mode banner */}
      {demo && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Demo-Modus aktiv — alle Funktionen sind testbar, keine echten Daten</span>
          <button
            onClick={handleSignOut}
            className="ml-4 underline text-primary-foreground/80 hover:text-primary-foreground text-xs"
          >
            Beenden
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Guten Tag, {displayName}! 👋
            </h1>
            <p className="text-muted-foreground text-sm">Willkommen bei ZumArzt.</p>
          </div>
          {!demo && (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          )}
        </div>

        {/* Quick action */}
        <div className="rounded-2xl gradient-hero p-8 mb-8 shadow-elevated">
          <h2 className="text-xl font-bold text-primary-foreground mb-2">
            Neuen Termin suchen
          </h2>
          <p className="text-primary-foreground/80 mb-4">
            Überweisung scannen oder Fachrichtung eingeben
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-xl"
            onClick={() => navigate("/app/patient/search")}
          >
            Jetzt starten
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Empty states */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <CalendarSearch className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-card-foreground mb-1">Keine Termine</h3>
            <p className="text-sm text-muted-foreground mb-4">Noch keine Termine vorhanden.</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/app/patient/search")}>
              Termin suchen
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-card-foreground mb-1">Keine Überweisungen</h3>
            <p className="text-sm text-muted-foreground mb-4">Lade deine erste Überweisung hoch.</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/app/patient/search")}>
              Überweisung hochladen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
