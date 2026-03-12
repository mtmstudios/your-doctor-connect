import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarSearch, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Guten Tag! 👋</h1>
        <p className="text-muted-foreground mb-8">Willkommen bei ZumArzt.</p>

        {/* Quick action */}
        <div className="rounded-2xl gradient-hero p-8 mb-8">
          <h2 className="text-xl font-bold text-primary-foreground mb-2">Neuen Termin suchen</h2>
          <p className="text-primary-foreground/80 mb-4">Überweisung scannen oder Fachrichtung eingeben</p>
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
            <p className="text-sm text-muted-foreground">Noch keine Termine vorhanden.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-card-foreground mb-1">Keine Überweisungen</h3>
            <p className="text-sm text-muted-foreground">Lade deine erste Überweisung hoch.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
