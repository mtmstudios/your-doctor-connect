import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Impressum = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">Impressum</h1>
      <p className="text-muted-foreground">Diese Seite wird in Kürze mit den vollständigen Impressum-Informationen ergänzt.</p>
    </div>
    <Footer />
  </div>
);

export default Impressum;
