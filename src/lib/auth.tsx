import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

const DEMO_KEY = "zumarzt_demo_mode";

export const enableDemoMode = () => localStorage.setItem(DEMO_KEY, "1");
export const disableDemoMode = () => localStorage.removeItem(DEMO_KEY);
export const isDemoMode = () => localStorage.getItem(DEMO_KEY) === "1";

// Fake demo user so components that use useAuth().user don't break
const DEMO_USER: Partial<User> = {
  id: "demo-user-id",
  email: "demo@zumarzt.de",
  user_metadata: { full_name: "Demo Patient" },
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  demo: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: false,
  demo: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [demo, setDemo] = useState(isDemoMode());

  useEffect(() => {
    // If demo mode is already active, no Supabase needed
    if (isDemoMode()) {
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
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  };

  const user = demo
    ? (DEMO_USER as User)
    : (session?.user ?? null);

  return (
    <AuthContext.Provider value={{ session, user, loading, demo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
