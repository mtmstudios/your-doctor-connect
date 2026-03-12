import { motion } from "framer-motion";
import { ScanLine, CalendarCheck, CheckCircle } from "lucide-react";

const features = [
  {
    icon: ScanLine,
    title: "Überweisung scannen",
    description: "Einfach fotografieren, wir lesen die Daten automatisch aus.",
  },
  {
    icon: CalendarCheck,
    title: "3 Termine sofort",
    description: "Wir zeigen dir die 3 frühesten verfügbaren Termine.",
  },
  {
    icon: CheckCircle,
    title: "Arzt erhält alles",
    description: "Termin + Überweisung werden direkt übermittelt.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            So einfach geht's
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            In drei Schritten zum Facharzt-Termin — ohne Telefon, ohne Wartezeit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative p-8 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
