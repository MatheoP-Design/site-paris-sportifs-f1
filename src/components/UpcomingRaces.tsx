import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { racesApi } from '../utils/api';
import { toast } from 'sonner';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function UpcomingRaces({ onSelectRace }: { onSelectRace?: (race: any) => void }) {
  const [races, setRaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemainingMap, setTimeRemainingMap] = useState<Record<string, TimeRemaining>>({});

  useEffect(() => {
    loadRaces();
  }, []);

  useEffect(() => {
    if (races.length === 0) return;

    const updateCountdowns = () => {
      const now = new Date().getTime();
      const newTimeMap: Record<string, TimeRemaining> = {};

      races.forEach((race) => {
        const raceDate = new Date(race.date).getTime();
        const distance = raceDate - now;

        if (distance < 0) {
          newTimeMap[race.id] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isPast: true,
          };
        } else {
          newTimeMap[race.id] = {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
            isPast: false,
          };
        }
      });

      setTimeRemainingMap(newTimeMap);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(interval);
  }, [races]);

  const loadRaces = async () => {
    try {
      setLoading(true);
      const { races: racesData } = await racesApi.getRaces();

      // Sort races by date
      const sortedRaces = racesData.sort(
        (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setRaces(sortedRaces);
    } catch (error) {
      console.error('Error loading races:', error);
      toast.error('Erreur lors du chargement des courses');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (time: TimeRemaining) => {
    if (time.isPast) {
      return 'Terminé';
    }

    if (time.days > 0) {
      return `Dans ${time.days}j ${time.hours}h`;
    } else if (time.hours > 0) {
      return `Dans ${time.hours}h ${time.minutes}m`;
    } else if (time.minutes > 0) {
      return `Dans ${time.minutes}m ${time.seconds}s`;
    } else {
      return `Dans ${time.seconds}s`;
    }
  };

  const getCountdownColor = (time: TimeRemaining) => {
    if (time.isPast) return 'destructive';
    if (time.days === 0 && time.hours < 24) return 'default';
    if (time.days < 7) return 'secondary';
    return 'outline';
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2>Prochains Grands Prix</h2>
          <p className="text-muted-foreground">Chargement des courses...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (races.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2>Prochains Grands Prix</h2>
        </div>
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">Aucune course disponible</h3>
          <p className="text-muted-foreground">
            Les courses de la saison seront bientôt disponibles
          </p>
        </Card>
      </section>
    );
  }

  // Separate upcoming and past races
  const now = new Date().getTime();
  const upcomingRaces = races.filter(
    (race) => new Date(race.date).getTime() >= now
  );
  const pastRaces = races.filter(
    (race) => new Date(race.date).getTime() < now
  );

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Upcoming Races */}
      {upcomingRaces.length > 0 && (
        <div className="mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm">{upcomingRaces.length} courses à venir</span>
            </div>
            <h2>Prochains Grands Prix 2025</h2>
            <p className="text-muted-foreground">
              Placez vos paris sur les prochaines courses de Formule 1
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingRaces.map((race, index) => {
              const time = timeRemainingMap[race.id];

              return (
                <motion.div
                  key={race.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
                    {/* Circuit Image */}
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={race.image || 'https://images.unsplash.com/photo-1694865995615-e9fe6962c8dc?q=80&w=1200'}
                        alt={race.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                      {/* Countdown Badge */}
                      {time && (
                        <Badge
                          variant={getCountdownColor(time)}
                          className="absolute top-4 right-4 font-mono"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formatCountdown(time)}
                        </Badge>
                      )}

                      {/* Flag */}
                      <div className="absolute top-4 left-4 text-4xl">
                        {race.flag}
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="mb-2 group-hover:text-primary transition-colors">
                          {race.name}
                        </h3>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>
                              {race.city}, {race.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                              {new Date(race.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Circuit Info */}
                        <div className="rounded-lg bg-muted/50 p-3 mb-4">
                          <div className="text-xs text-muted-foreground mb-1">Circuit</div>
                          <div className="text-sm font-medium">{race.circuit}</div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                        onClick={() => onSelectRace?.(race)}
                      >
                        Parier sur ce GP
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Races */}
      {pastRaces.length > 0 && (
        <div>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-muted bg-muted/20 px-4 py-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {pastRaces.length} courses passées
              </span>
            </div>
            <h2 className="text-muted-foreground">Courses Précédentes</h2>
            <p className="text-muted-foreground">
              Consultez les résultats des courses passées
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pastRaces.reverse().map((race, index) => {
              const time = timeRemainingMap[race.id];

              return (
                <motion.div
                  key={race.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="group overflow-hidden border-muted bg-muted/5 hover:border-muted-foreground/30 transition-all cursor-pointer opacity-60 hover:opacity-100">
                    <div className="relative h-32 overflow-hidden">
                      <ImageWithFallback
                        src={race.image || 'https://images.unsplash.com/photo-1694865995615-e9fe6962c8dc?q=80&w=1200'}
                        alt={race.name}
                        className="h-full w-full object-cover grayscale"
                      />
                      <div className="absolute inset-0 bg-background/80" />

                      <Badge
                        variant="destructive"
                        className="absolute top-2 right-2 text-xs"
                      >
                        Terminé
                      </Badge>

                      <div className="absolute top-2 left-2 text-2xl opacity-50">
                        {race.flag}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h4 className="text-sm mb-2 text-muted-foreground">
                        {race.name}
                      </h4>
                      <div className="text-xs text-muted-foreground">
                        {new Date(race.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-3 text-xs"
                        onClick={() => onSelectRace?.(race)}
                      >
                        Voir résultats
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
