import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center">
            <Logo size="sm" variant="auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Startseite
            </Link>
            <Link to="/app/doctor/register" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Für Ärzte
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/patient/login")}>
              Anmelden
            </Button>
            <Button size="sm" className="rounded-lg" onClick={() => navigate("/app/patient/register")}>
              Jetzt starten
            </Button>
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-border/50 pt-3 mt-1">
            <Link to="/" className="block text-sm font-medium text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Startseite</Link>
            <Link to="/app/doctor/register" className="block text-sm font-medium text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Für Ärzte</Link>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { navigate("/app/patient/login"); setMobileOpen(false); }}>Anmelden</Button>
              <Button size="sm" className="flex-1" onClick={() => { navigate("/app/patient/register"); setMobileOpen(false); }}>Jetzt starten</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
