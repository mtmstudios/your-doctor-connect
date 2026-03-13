import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-[0.07]" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Logo iconOnly size="sm" />
              <span className="text-sm font-semibold text-primary">Facharzt-Termine, einfach gemacht</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Facharzt-Termin in{" "}
            <span className="bg-clip-text text-transparent gradient-hero">60 Sekunden</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Einfach Überweisung hochladen, 3 Ärzte vergleichen, sofort buchen.
            Kein Telefonieren, kein Warten.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="text-base px-8 py-6 rounded-xl shadow-elevated hover:shadow-lg transition-all"
              onClick={() => navigate("/app/patient/register")}
            >
              Als Patient starten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 rounded-xl border-2 hover:bg-muted transition-all"
              onClick={() => navigate("/app/doctor/register")}
            >
              Als Arzt registrieren
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 mt-8 justify-center lg:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Zap className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">
              Durchschnittlich <strong className="text-foreground">3 Termine</strong> in unter 10 Sekunden gefunden
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
