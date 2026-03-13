import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2, MapPin, Calendar, Clock, ArrowLeft,
  Loader2, Star
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

const BookingConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctor = state?.doctor;
  const slot = state?.slot;

  const [notes, setNotes] = useState("");
  const [punctualAgreed, setPunctualAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (!doctor || !slot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Keine Buchungsdaten vorhanden.</p>
          <Button onClick={() => navigate("/app/patient/search")}>Zurück zur Suche</Button>
        </div>
      </div>
    );
  }

  const handleBook = async () => {
    if (!punctualAgreed) {
      toast.error("Bitte bestätige die Pünktlichkeitsvereinbarung.");
      return;
    }
    setLoading(true);

    try {
      const N8N_BOOK_WEBHOOK = import.meta.env.VITE_N8N_BOOK_WEBHOOK as string;

      if (N8N_BOOK_WEBHOOK) {
        const res = await fetch(N8N_BOOK_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            practiceId: doctor.id,
            patientId: user?.id,
            slotDate: slot.date,
            slotTime: slot.time,
            notes,
          }),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message || "Buchung fehlgeschlagen");
        setSuccess(result.booking_code || "ZA-" + Math.random().toString(36).slice(2, 8).toUpperCase());
      } else {
        // Mock for dev
        await new Promise((r) => setTimeout(r, 1500));

        // Save to Supabase directly in dev mode
        const { data: booking, error } = await supabase
          .from("bookings")
          .insert({
            practice_id: doctor.id,
            patient_id: user?.id,
            patient_name: user?.email?.split("@")[0] || "Patient",
            patient_email: user?.email || "",
            patient_phone: "",
            notes,
            status: "bestaetigt",
            booking_code: "ZA-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          })
          .select()
          .single();

        if (error) console.warn("Booking insert:", error.message);
        setSuccess(booking?.booking_code || "ZA-DEV001");
      }

      toast.success("Termin erfolgreich gebucht!");
    } catch (err: any) {
      toast.error("Fehler: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-md text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Termin gebucht!</h1>
          <p className="text-muted-foreground mb-6">
            Dein Termin bei {doctor.name} wurde bestätigt. Du erhältst eine Bestätigung per E-Mail.
          </p>
          <div className="rounded-xl bg-muted/50 p-4 mb-6 text-sm">
            <p className="text-muted-foreground">Buchungscode</p>
            <p className="text-xl font-mono font-bold text-foreground mt-1">{success}</p>
          </div>
          <Button className="w-full py-5 mb-3" onClick={() => navigate("/app/patient/dashboard")}>
            Zum Dashboard
          </Button>
          <Button variant="outline" className="w-full py-5" onClick={() => navigate("/app/patient/search")}>
            Weiteren Termin suchen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </button>

        <h1 className="text-2xl font-bold mb-6">Termin bestätigen</h1>

        {/* Doctor summary */}
        <div className="rounded-2xl border bg-card p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg font-bold text-primary">
              {doctor.name.split(" ").pop()?.[0]}
            </div>
            <div>
              <h3 className="font-semibold">{doctor.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                {doctor.rating_avg} · {doctor.specialty}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{format(parseISO(slot.date), "EEEE, d. MMMM yyyy", { locale: de })}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{slot.time} Uhr · {slot.duration} Min.</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{doctor.address}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2 mb-5">
          <Label>Anmerkung an den Arzt (optional)</Label>
          <Textarea
            placeholder="z.B. Bitte bestimmte Befunde mitbringen..."
            maxLength={200}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={3}
          />
          <p className="text-xs text-muted-foreground text-right">{notes.length}/200</p>
        </div>

        {/* Agreement */}
        <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-muted/50">
          <Checkbox
            id="punctual"
            checked={punctualAgreed}
            onCheckedChange={(v) => setPunctualAgreed(!!v)}
          />
          <Label htmlFor="punctual" className="text-sm leading-relaxed cursor-pointer">
            Ich erscheine pünktlich oder sage mindestens 24 Stunden vorher ab.
          </Label>
        </div>

        <Button
          className="w-full py-6 text-base"
          disabled={!punctualAgreed || loading}
          onClick={handleBook}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Buchung läuft...</>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Verbindlich buchen
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirm;
