import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";

// Patient Portal
import PatientRegister from "./pages/patient/PatientRegister";
import PatientLogin from "./pages/patient/PatientLogin";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientSearch from "./pages/patient/PatientSearch";
import SearchResults from "./pages/patient/SearchResults";
import BookingConfirm from "./pages/patient/BookingConfirm";

// Doctor Portal
import DoctorRegister from "./pages/doctor/DoctorRegister";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ── Public ── */}
            <Route path="/" element={<Index />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />

            {/* ── Patient Auth (public) ── */}
            <Route path="/app/patient/register" element={<PatientRegister />} />
            <Route path="/app/patient/login" element={<PatientLogin />} />

            {/* ── Patient Protected ── */}
            <Route path="/app/patient/dashboard" element={
              <ProtectedRoute><PatientDashboard /></ProtectedRoute>
            } />
            <Route path="/app/patient/search" element={
              <ProtectedRoute><PatientSearch /></ProtectedRoute>
            } />
            <Route path="/app/patient/results" element={
              <ProtectedRoute><SearchResults /></ProtectedRoute>
            } />
            <Route path="/app/patient/booking/confirm" element={
              <ProtectedRoute><BookingConfirm /></ProtectedRoute>
            } />

            {/* ── Doctor Portal ── */}
            <Route path="/app/doctor/register" element={<DoctorRegister />} />
            <Route path="/app/doctor/dashboard" element={
              <ProtectedRoute><DoctorDashboard /></ProtectedRoute>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
