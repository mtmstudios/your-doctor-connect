import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/app/patient/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
