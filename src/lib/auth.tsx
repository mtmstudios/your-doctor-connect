import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

// ─── Demo Keys ────────────────────────────────────────────────────────────────
const DEMO_KEY        = "zumarzt_demo_mode";
const DOCTOR_DEMO_KEY = "zumarzt_doctor_demo_mode";

export const enableDemoMode        = () => localStorage.setItem(DEMO_KEY, "1");
export const disableDemoMode       = () => localStorage.removeItem(DEMO_KEY);
export const isDemoMode            = () => localStorage.getItem(DEMO_KEY) === "1";

export const enableDoctorDemoMode  = () => localStorage.setItem(DOCTOR_DEMO_KEY, "1");
export const disableDoctorDemoMode = () => localStorage.removeItem(DOCTOR_DEMO_KEY);
export const isDoctorDemoMode      = () => localStorage.getItem(DOCTOR_DEMO_KEY) === "1";

// ─── Demo Users ───────────────────────────────────────────────────────────────
const DEMO_USER: Partial<User> = {
  id: "demo-user-id",
  email: "demo@zumarzt.de",
  user_metadata: { full_name: "Demo Patient" },
};

const DEMO_DOCTOR_USER: Partial<User> = {
  id: "demo-doctor-id",
  email: "demo-arzt@zumarzt.de",
  user_metadata: { full_name: "Dr. Demo Mustermann", role: "doctor" },
};

// ─── Mock Practice for Doctor Demo ───────────────────────────────────────────
export const DEMO_PRACTICE = {
  id: "demo-practice-id",
  name: "Orthopädie Dr. Mustermann",
  specialty: ["Orthopädie", "Sportmedizin"],
  address: "Königstraße 12, 70173 Stuttgart",
  plz: "70173",
  city: "Stuttgart",
  phone: "0711 123456",
  website: "www.ortho-mustermann.de",
  accepts_gkv: true,
  accepts_pkv: true,
  languages: ["Deutsch", "Englisch"],
  wheelchair_accessible: true,
  slot_duration_min: 20,
  is_verified: true,
  plan: "starter",
  rating_avg: 4.7,
  rating_count: 134,
};

export const DEMO_BOOKINGS = [
  {
    id: "b1", patient_name: "Maria Schneider", patient_email: "m.schneider@email.de",
    created_at: new Date().toISOString(), status: "bestaetigt",
    notes: "Knieschmerzen seit 3 Wochen", booking_code: "ZA-A1B2C3D4", no_show: false,
  },
  {
    id: "b2", patient_name: "Thomas Huber", patient_email: "t.huber@email.de",
    created_at: new Date(Date.now() - 86400000).toISOString(), status: "bestaetigt",
    notes: "", booking_code: "ZA-E5F6G7H8", no_show: false,
  },
  {
    id: "b3", patient_name: "Fatima Yilmaz", patient_email: "f.yilmaz@email.de",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(), status: "no_show",
    notes: "Rückenschmerzen", booking_code: "ZA-I9J0K1L2", no_show: true,
  },
  {
    id: "b4", patient_name: "Klaus Berger", patient_email: "k.berger@email.de",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(), status: "bestaetigt",
    notes: "", booking_code: "ZA-M3N4O5P6", no_show: false,
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  demo: boolean;
  doctorDemo: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: false,
  demo: false,
  doctorDemo: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession]       = useState<Session | null>(null);
  const [loading, setLoading]       = useState(isSupabaseConfigured);
  const [demo, setDemo]             = useState(isDemoMode());
  const [doctorDemo, setDoctorDemo] = useState(isDoctorDemoMode());

  useEffect(() => {
    if (isDemoMode() || isDoctorDemoMode()) {
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (demo) {
      disableDemoMode();
      setDemo(false);
      return;
    }
    if (doctorDemo) {
      disableDoctorDemoMode();
      setDoctorDemo(false);
      return;
    }
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  };

  const user = doctorDemo
    ? (DEMO_DOCTOR_USER as User)
    : demo
    ? (DEMO_USER as User)
    : (session?.user ?? null);

  return (
    <AuthContext.Provider value={{ session, user, loading, demo, doctorDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
