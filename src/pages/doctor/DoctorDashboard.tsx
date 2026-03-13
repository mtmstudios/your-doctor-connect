import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/landing/Navbar";
import { useAuth, DEMO_PRACTICE, DEMO_BOOKINGS } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  Calendar, Users, TrendingUp, Star, CheckCircle2, XCircle,
  Clock, Bell, Settings, LogOut, FileText, ChevronRight, AlertTriangle, Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Booking {
  id: string;
  patient_name: string;
  patient_email: string;
  created_at: string;
  status: string;
  notes: string;
  booking_code: string;
  no_show: boolean;
}

const DoctorDashboard = () => {
  const { user, signOut, doctorDemo } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [practice, setPractice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmNoShow, setConfirmNoShow] = useState<string | null>(null);

  useEffect(() => {
    // Doctor demo mode — use mock data instantly
    if (doctorDemo) {
      setPractice(DEMO_PRACTICE);
      setBookings(DEMO_BOOKINGS as any);
      setLoading(false);
      return;
    }
    if (!user) return;
    const load = async () => {
      try {
        const [{ data: p, error: pe }, { data: b, error: be }] = await Promise.all([
          supabase.from("practices").select("*").eq("user_id", user.id).single(),
          supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(20),
        ]);
        if (pe && pe.code !== "PGRST116") console.warn("Practice load error:", pe.message);
        if (be) console.warn("Bookings load error:", be.message);
        if (p) setPractice(p);
        if (b) setBookings(b);
      } catch (err) {
        toast.error("Fehler beim Laden der Daten.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, doctorDemo]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNoShow = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ no_show: true, status: "no_show" })
      .eq("id", bookingId);

    if (error) {
      toast.error("Fehler beim Aktualisieren.");
      return;
    }
    setBookings((prev) =>
      prev.map((b) => b.id === bookingId ? { ...b, no_show: true, status: "no_show" } : b)
    );
    toast.info("Als No-Show markiert.");
    setConfirmNoShow(null);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((b) => b.created_at?.startsWith(todayStr)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-5xl px-4">
          {/* Skeleton */}
          {[1,2,3].map(i => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Doctor Demo Banner */}
      {doctorDemo && (
        <div className="bg-blue-600 text-white text-center py-2 px-4 text-sm flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Demo-Modus aktiv — Arzt-Dashboard mit Beispieldaten</span>
          <button onClick={handleSignOut} className="ml-4 underline text-blue-200 hover:text-white text-xs">
            Beenden
          </button>
        </div>
      )}

      {/* No-show confirmation modal */}
      {confirmNoShow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border shadow-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-semibold">Als No-Show markieren?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Diese Aktion kann nicht rückgängig gemacht werden. Der Patient wird als nicht erschienen gewertet.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmNoShow(null)}
              >
                Abbrechen
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleNoShow(confirmNoShow)}
              >
                Ja, markieren
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{practice?.name || "Meine Praxis"}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {practice?.is_verified ? (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" />Verifiziert
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-xs text-amber-600 border-amber-300">
                  <Clock className="w-3 h-3" />Prüfung ausstehend
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {practice?.plan || "Free"}
              </Badge>
              {practice?.specialty?.map((s: string) => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Einstellungen kommen bald.")}
              title="Einstellungen"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} title="Abmelden">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Verification warning */}
        {!practice?.is_verified && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6 flex items-start gap-3">
            <Bell className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm text-amber-900">Verifizierung ausstehend</div>
              <div className="text-xs text-amber-700 mt-0.5">
                Ihre Praxis wird innerhalb von 24h geprüft. Danach können Patienten Termine buchen.
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Heute", value: todayBookings, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
            { label: "Gesamt", value: bookings.length, icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
            {
              label: "Bewertung",
              value: practice?.rating_avg ? `${Number(practice.rating_avg).toFixed(1)}★` : "–",
              icon: Star,
              color: "text-accent",
              bg: "bg-accent/10",
            },
            { label: "Plan", value: practice?.plan || "Free", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl bg-card border shadow-card p-4 hover:shadow-card-hover transition-shadow">
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Upgrade CTA */}
        {(!practice?.plan || practice?.plan === "free") && (
          <div className="rounded-2xl gradient-hero p-5 mb-8 flex items-center justify-between gap-4">
            <div className="text-primary-foreground">
              <h3 className="font-bold text-lg">Starter für €49/Monat</h3>
              <p className="text-sm text-primary-foreground/80 mt-0.5">
                SMS-Erinnerungen · Überweisungseingang · Flash-Termin · Analytics
              </p>
            </div>
            <Button variant="secondary" className="shrink-0" onClick={() => toast.info("Stripe kommt bald!")}>
              Upgraden <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Aktuelle Buchungen</h2>
            {bookings.length > 0 && (
              <span className="text-xs text-muted-foreground">{bookings.length} Einträge</span>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground mb-1">Noch keine Buchungen</p>
              <p className="text-sm text-muted-foreground">
                Sobald Patienten Termine buchen, erscheinen sie hier.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`rounded-xl border bg-card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all ${booking.no_show ? "opacity-60" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {booking.patient_name?.[0] || "P"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{booking.patient_name}</span>
                      <Badge
                        variant={booking.no_show ? "destructive" : booking.status === "bestaetigt" ? "secondary" : "outline"}
                        className="text-xs shrink-0"
                      >
                        {booking.no_show ? "No-Show" : booking.status === "bestaetigt" ? "Bestätigt" : booking.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(booking.created_at), "d. MMM yyyy, HH:mm", { locale: de })}
                      {" · "}
                      <span className="font-mono">#{booking.booking_code}</span>
                    </div>
                    {booking.notes && (
                      <div className="text-xs text-muted-foreground mt-1 truncate italic">
                        "{booking.notes}"
                      </div>
                    )}
                  </div>

                  {!booking.no_show && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      title="Als No-Show markieren"
                      onClick={() => setConfirmNoShow(booking.id)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
