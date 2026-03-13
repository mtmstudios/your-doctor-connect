import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/landing/Navbar";
import {
  MapPin, Star, Clock, Shield, Award, ArrowLeft,
  Calendar, Globe, ChevronRight, Zap,
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { de } from "date-fns/locale";

const RANK_LABELS = ["🥇 Frühester Termin", "🥈 2. Option", "🥉 3. Option"];
const RANK_BORDER = [
  "border-l-4 border-l-primary ring-1 ring-primary/10",
  "border-l-4 border-l-secondary",
  "border-l-4 border-l-muted-foreground/30",
];

const SearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const results: any[] = state?.results || [];
  const specialty: string = state?.specialty || "";

  const today = new Date();
  const firstDate = results[0]?.next_slot?.date
    ? differenceInDays(parseISO(results[0].next_slot.date), today)
    : null;

  if (!results.length) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Keine Termine gefunden</h2>
          <p className="text-muted-foreground mb-6">
            Bitte erweitere deinen Suchradius oder ändere die Fachrichtung.
          </p>
          <Button onClick={() => navigate("/app/patient/search")}>Erneut suchen</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Back */}
        <button
          onClick={() => navigate("/app/patient/search")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Neue Suche
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Die 3 frühesten Termine</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {specialty} · {state?.plz} · {state?.radius} km Radius
          </p>
          {firstDate !== null && firstDate <= 3 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              ⚡ Flash-Termin verfügbar — schon in {firstDate <= 0 ? "heute" : `${firstDate} Tag${firstDate !== 1 ? "en" : ""}`}!
            </div>
          )}
        </div>

        <div className="space-y-4">
          {results.map((doc, i) => {
            const daysUntil = doc.next_slot?.date
              ? differenceInDays(parseISO(doc.next_slot.date), today)
              : null;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl bg-card border shadow-card hover:shadow-card-hover transition-all ${RANK_BORDER[i]}`}
              >
                <div className="p-5">
                  {/* Rank + rating row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-muted-foreground">{RANK_LABELS[i]}</span>
                      {i === 0 && daysUntil !== null && daysUntil <= 3 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                          <Zap className="w-2.5 h-2.5" />FLASH
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      <span className="font-medium">{doc.rating_avg}</span>
                      <span className="text-muted-foreground">({doc.rating_count})</span>
                    </div>
                  </div>

                  {/* Doctor info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                      {doc.name.split(" ").pop()?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{doc.address}</span>
                        <span className="shrink-0 font-medium">· {doc.distance_km} km</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doc.accepts_gkv && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Shield className="w-3 h-3" />GKV
                      </Badge>
                    )}
                    {doc.accepts_pkv && (
                      <Badge variant="outline" className="text-xs gap-1 border-accent/50 text-accent">
                        <Award className="w-3 h-3" />PKV
                      </Badge>
                    )}
                    {doc.languages?.map((lang: string) => (
                      <Badge key={lang} variant="outline" className="text-xs gap-1">
                        <Globe className="w-3 h-3" />{lang}
                      </Badge>
                    ))}
                  </div>

                  {/* Next slot */}
                  <div className={`rounded-xl p-3 mb-4 ${i === 0 ? "bg-primary/8 border border-primary/20" : "bg-secondary/10 border border-secondary/20"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Calendar className={`w-4 h-4 shrink-0 ${i === 0 ? "text-primary" : "text-secondary"}`} />
                        <div>
                          <div className="font-semibold text-foreground text-sm">
                            {format(parseISO(doc.next_slot.date), "EEEE, d. MMMM", { locale: de })}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <Clock className="w-3 h-3" />
                            {doc.next_slot.time} Uhr · {doc.next_slot.duration} Min.
                          </div>
                        </div>
                      </div>
                      {daysUntil !== null && (
                        <span className={`text-xs font-bold shrink-0 px-2 py-1 rounded-lg ${daysUntil <= 3 ? "bg-orange-500/15 text-orange-500" : "bg-muted text-muted-foreground"}`}>
                          {daysUntil <= 0 ? "Heute" : daysUntil === 1 ? "Morgen" : `in ${daysUntil}d`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    className={`w-full py-5 text-base font-semibold ${i === 0 ? "" : "variant-outline"}`}
                    variant={i === 0 ? "default" : "outline"}
                    onClick={() =>
                      navigate("/app/patient/booking/confirm", {
                        state: {
                          doctor: doc,
                          slot: doc.next_slot,
                          specialty,
                          plz: state?.plz,
                        },
                      })
                    }
                  >
                    Termin buchen
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Alle Termine live — kostenlos für Patienten
        </p>
      </div>
    </div>
  );
};

export default SearchResults;
