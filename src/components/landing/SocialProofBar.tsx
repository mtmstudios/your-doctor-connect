import { motion } from "framer-motion";
import { Users, Star, ShieldCheck } from "lucide-react";

const SocialProofBar = () => {
  return (
    <motion.section
      className="py-10 border-y border-border/50 gradient-hero-subtle"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Bereits <strong>1.200+</strong> Ärzte registriert
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground">
              <strong>4.8★</strong> Bewertung
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-foreground">
              DSGVO konform
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SocialProofBar;
