import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/landing/Navbar";
import {
  MapPin, Star, Clock, Shield, Award, ArrowLeft,
  Calendar, Globe, ChevronRight
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

const RANK_LABELS = ["🥇 Frühester", "🥈 2. Option", "🥉 3. Option"];
const RANK_COLORS = [
  "border-l-4 border-l-primary",
  "border-l-4 border-l-secondary",
  "border-l-4 border-l-accent",
];

const SearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const results: any[] = state?.results || [];
  const specialty: string = state?.specialty || "";

  if (!results.length) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Keine Termine gefunden</h2>
          <p className="text-muted-foreground mb-6">Bitte erweitere deinen Suchradius oder ändere die Fachrichtung.</p>
          <Button onClick={() => navigate("/app/patient/search")}>Erneut suchen</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <button
          onClick={() => navigate("/app/patient/search")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Neue Suche
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Die 3 frühesten Termine</h1>
          <p className="text-muted-foreground">
            {specialty} · {state?.plz} · {state?.radius} km Radius
          </p>
        </div>

        <div className="space-y-4">
          {results.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl bg-card border shadow-card hover:shadow-card-hover transition-all ${RANK_COLORS[i]}`}
            >
              <div className="p-5">
                {/* Rank badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-semibold text-muted-foreground">{RANK_LABELS[i]}</span>
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
                      <span className="shrink-0">· {doc.distance_km} km</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
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

                {/* Next slot highlight */}
                <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {format(parseISO(doc.next_slot.date), "EEEE, d. MMMM yyyy", { locale: de })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        {doc.next_slot.time} Uhr · {doc.next_slot.duration} Min.
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  className="w-full py-5 text-base"
                  onClick={() =>
                    navigate("/app/patient/booking/confirm", {
                      state: { doctor: doc, slot: doc.next_slot, specialty, plz: state?.plz },
                    })
                  }
                >
                  Termin buchen
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
