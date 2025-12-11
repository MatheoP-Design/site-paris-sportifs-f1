import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NextRaceHome } from "./components/NextRaceHome";
import { AllRacesList } from "./components/AllRacesList";
import { RaceDetails } from "./components/RaceDetails";
import { DriverStandings } from "./components/DriverStandings";
import { Statistics } from "./components/Statistics";
import { Rules } from "./components/Rules";
import { UserProfile } from "./components/UserProfile";
import { Leaderboard } from "./components/Leaderboard";
import { AdminPanel } from "./components/AdminPanel";
import { Footer } from "./components/Footer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useState } from "react";

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedRace, setSelectedRace] = useState<any>(null);

  // Handle hash-based navigation for admin panel
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setActiveTab('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handler to switch to betting tab
  const handleGoToBetting = () => {
    setActiveTab('betting');
    setSelectedRace(null); // Reset to show all races list
  };

  // Handler to select a race and show details
  const handleSelectRace = (race: any) => {
    setSelectedRace(race);
  };

  // Handler to go back to races list
  const handleBackToRacesList = () => {
    setSelectedRace(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Page Content */}
      <main>
        {activeTab === "home" && (
          <>
            <Hero />
            <NextRaceHome onViewDetails={handleGoToBetting} />
            <DriverStandings />
            
            {/* News/Testimonials Section */}
            <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-muted/20 to-background">
              <div className="mb-8">
                <h2>Actualités F1</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "Hamilton rejoint Ferrari pour 2025",
                    excerpt: "Le septuple champion du monde Lewis Hamilton rejoint la Scuderia Ferrari dans un transfert historique...",
                    date: "Il y a 2 heures"
                  },
                  {
                    title: "Verstappen vise un 4ème titre consécutif",
                    excerpt: "Le pilote Red Bull Racing se dit confiant pour la saison 2025 après des essais prometteurs...",
                    date: "Il y a 5 heures"
                  },
                  {
                    title: "5 rookies font leurs débuts en 2025",
                    excerpt: "La saison 2025 voit l'arrivée de nouveaux talents prometteurs sur la grille de départ...",
                    date: "Il y a 1 jour"
                  }
                ].map((news, index) => (
                  <div 
                    key={index}
                    className="group rounded-lg border border-border bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card cursor-pointer"
                  >
                    <div className="mb-4">
                      <div className="h-2 w-2 rounded-full bg-primary inline-block mr-2" />
                      <span className="text-sm text-muted-foreground">{news.date}</span>
                    </div>
                    <h3 className="mb-2 group-hover:text-primary transition-colors">{news.title}</h3>
                    <p className="text-sm text-muted-foreground">{news.excerpt}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "betting" && (
          <>
            {selectedRace ? (
              <RaceDetails race={selectedRace} onBack={handleBackToRacesList} />
            ) : (
              <AllRacesList onSelectRace={handleSelectRace} />
            )}
          </>
        )}

        {activeTab === "stats" && <Statistics />}

        {activeTab === "rules" && <Rules />}

        {activeTab === "profile" && <UserProfile />}

        {activeTab === "leaderboard" && <Leaderboard />}

        {user?.role === 'admin' && activeTab === "admin" && <AdminPanel />}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
