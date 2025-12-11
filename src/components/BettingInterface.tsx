import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { racesApi } from "../utils/api";
import { toast } from "sonner";
import { RaceDetails } from "./RaceDetails";

export function BettingInterface() {
  const [races, setRaces] = useState<any[]>([]);
  const [selectedRace, setSelectedRace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadRaces();
  }, []);

  useEffect(() => {
    // Check if there's a pre-selected race from home page
    const preSelectedRaceId = sessionStorage.getItem('selectedRaceId');
    if (preSelectedRaceId && races.length > 0) {
      const race = races.find((r: any) => r.id === preSelectedRaceId);
      if (race) {
        setSelectedRace(race);
        sessionStorage.removeItem('selectedRaceId'); // Clear after use
      }
    }
  }, [races]);

  const loadRaces = async () => {
    try {
      setLoading(true);
      const { races: racesData } = await racesApi.getRaces();
      setRaces(racesData);
    } catch (error) {
      console.error("Error loading races:", error);
      toast.error("Erreur lors du chargement des courses");
    } finally {
      setLoading(false);
    }
  };

  if (selectedRace) {
    return <RaceDetails race={selectedRace} onBack={() => setSelectedRace(null)} />;
  }

  const now = new Date();
  const filteredRaces = races.filter((race) => {
    const raceDate = new Date(race.date);
    if (filter === 'upcoming') return raceDate >= now;
    if (filter === 'past') return raceDate < now;
    return true;
  });

  const upcomingCount = races.filter((r) => new Date(r.date) >= now).length;
  const pastCount = races.filter((r) => new Date(r.date) < now).length;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h2>Calendrier des Grands Prix</h2>
        <p className="text-muted-foreground mt-2">
          Consultez tous les Grands Prix et placez vos paris
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
          className="gap-2"
        >
          À venir
          <Badge variant="secondary" className="ml-1">{upcomingCount}</Badge>
        </Button>
        <Button
          variant={filter === 'past' ? 'default' : 'outline'}
          onClick={() => setFilter('past')}
          className="gap-2"
        >
          Terminés
          <Badge variant="secondary" className="ml-1">{pastCount}</Badge>
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="gap-2"
        >
          Tous
          <Badge variant="secondary" className="ml-1">{races.length}</Badge>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredRaces.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">Aucune course trouvée</h3>
          <p className="text-muted-foreground">
            {filter === 'upcoming' && 'Aucune course à venir pour le moment'}
            {filter === 'past' && 'Aucune course terminée'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRaces.map((race, index) => {
            const raceDate = new Date(race.date);
            const isPast = raceDate < now;
            const isUpcoming = raceDate >= now;
            const daysUntil = Math.ceil((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={race.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border-accent/20 bg-gradient-to-br from-card to-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => setSelectedRace(race)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={race.image || 'https://images.unsplash.com/photo-1694865995615-e9fe6962c8dc?q=80&w=1200'}
                      alt={race.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                    <div className="absolute top-4 left-4 text-4xl drop-shadow-lg">
                      {race.flag}
                    </div>

                    {isUpcoming && daysUntil <= 7 && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground animate-pulse">
                        Dans {daysUntil}j
                      </Badge>
                    )}

                    {isPast && (
                      <Badge variant="secondary" className="absolute top-4 right-4">
                        Terminé
                      </Badge>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white drop-shadow-lg mb-1">
                        {race.name}
                      </h3>
                      <p className="text-sm text-white/90">
                        {race.circuit}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {raceDate.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {race.city}, {race.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {race.laps} tours • {race.distance} km
                      </span>
                    </div>

                    <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                      {isPast ? 'Voir les résultats' : 'Parier sur ce GP'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}