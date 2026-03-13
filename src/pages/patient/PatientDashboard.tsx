import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarSearch, FileText, ArrowRight, Zap, LogOut, Bolt, Clock, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Guten Morgen";
  if (h < 18) return "Guten Tag";
  return "Guten Abend";
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, demo, signOut } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Patient";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Demo banner */}
      {demo && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Demo-Modus aktiv — alle Funktionen testbar, keine echten Daten</span>
          <button
            onClick={handleSignOut}
            className="ml-4 underline text-primary-foreground/80 hover:text-primary-foreground text-xs"
          >
            Beenden
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Greeting row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-0.5">
              {getGreeting()}, {displayName}! 👋
            </h1>
            <p className="text-muted-foreground text-sm">Willkommen bei ZumArzt.</p>
          </div>
          {!demo && (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          )}
        </motion.div>

        {/* Hero CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-2xl gradient-hero p-7 mb-4 shadow-elevated relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute right-8 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative">
            <p className="text-primary-foreground/70 text-sm font-medium mb-1">Überweisung vorhanden?</p>
            <h2 className="text-2xl font-bold text-primary-foreground mb-3">
              Jetzt Facharzt-Termin finden
            </h2>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-xl font-semibold"
              onClick={() => navigate("/app/patient/search")}
            >
              Termin suchen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Flash-Termin Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-2xl bg-[#0F172A] border border-orange-500/20 p-5 mb-6 flex items-center justify-between gap-4 cursor-pointer hover:border-orange-500/40 transition-colors"
          onClick={() => navigate("/app/patient/search")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">⚡ Flash-Termine verfügbar</p>
              <p className="text-xs text-slate-400 mt-0.5">Kurzfristig freigewordene Termine — jetzt zuschlagen</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
        </motion.div>

        {/* Empty state cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="rounded-xl border border-border bg-card p-6 text-center hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
              <CalendarSearch className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-1">Meine Termine</h3>
            <p className="text-sm text-muted-foreground mb-4">Noch keine Termine gebucht.</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/app/patient/search")}>
              Termin suchen
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary/20 transition-colors">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-1">Überweisungen</h3>
            <p className="text-sm text-muted-foreground mb-4">Lade deine erste Überweisung hoch.</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/app/patient/search")}>
              Überweisung hochladen
            </Button>
          </div>
        </motion.div>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center gap-2 text-xs text-muted-foreground justify-center"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Ø 73 Tage Wartezeit auf Facharzt — ZumArzt findet den frühesten Termin.</span>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
