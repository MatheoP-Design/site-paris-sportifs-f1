import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Clock, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
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

interface NextRaceHomeProps {
  onViewDetails: () => void;
}

export function NextRaceHome({ onViewDetails }: NextRaceHomeProps) {
  const [nextRace, setNextRace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    loadNextRace();
  }, []);

  useEffect(() => {
    if (!nextRace) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const raceDate = new Date(nextRace.date).getTime();
      const distance = raceDate - now;

      if (distance < 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
      } else {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          isPast: false,
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextRace]);

  const loadNextRace = async () => {
    try {
      setLoading(true);
      const { races } = await racesApi.getRaces();

      // Find the next upcoming race
      const now = new Date();
      const upcomingRaces = races
        .filter((race: any) => new Date(race.date) >= now)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (upcomingRaces.length > 0) {
        setNextRace(upcomingRaces[0]);
      } else {
        // If no upcoming races, show the most recent past race
        const sortedRaces = races.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        if (sortedRaces.length > 0) {
          setNextRace(sortedRaces[0]);
        }
      }
    } catch (error) {
      console.error('Error loading next race:', error);
      toast.error('Erreur lors du chargement de la prochaine course');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = () => {
    if (!timeRemaining) return '';

    if (timeRemaining.isPast) {
      return 'Course terminée';
    }

    const parts = [];
    if (timeRemaining.days > 0) parts.push(`${timeRemaining.days}j`);
    if (timeRemaining.hours > 0) parts.push(`${timeRemaining.hours}h`);
    if (timeRemaining.minutes > 0 || timeRemaining.days === 0) parts.push(`${timeRemaining.minutes}m`);
    if (timeRemaining.days === 0 && timeRemaining.hours === 0) parts.push(`${timeRemaining.seconds}s`);

    return parts.join(' ');
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!nextRace) {
    return (
      <section className="container mx-auto px-4 py-16">
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

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm">Prochain événement</span>
        </div>
        <h2>Prochaine Course</h2>
        <p className="text-muted-foreground mt-2">
          Ne manquez pas l'opportunité de placer vos paris
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-card to-card/50 max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="relative h-80 md:h-96">
            <ImageWithFallback
              src={nextRace.image || 'https://images.unsplash.com/photo-1694865995615-e9fe6962c8dc?q=80&w=1200'}
              alt={nextRace.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

            {/* Countdown Badge */}
            {timeRemaining && (
              <Badge
                variant={timeRemaining.isPast ? 'destructive' : 'default'}
                className="absolute top-6 right-6 text-lg px-4 py-2 font-mono"
              >
                <Clock className="h-5 w-5 mr-2" />
                {formatCountdown()}
              </Badge>
            )}

            {/* Flag */}
            <div className="absolute top-6 left-6 text-6xl drop-shadow-lg">
              {nextRace.flag}
            </div>

            {/* Race Name */}
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-white drop-shadow-lg mb-2">
                {nextRace.name}
              </h2>
              <p className="text-white/90 text-lg">
                {nextRace.circuit}
              </p>
            </div>
          </div>

          {/* Race Details */}
          <CardContent className="p-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Date</div>
                  <div className="font-medium">
                    {new Date(nextRace.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Lieu</div>
                  <div className="font-medium">
                    {nextRace.city}, {nextRace.country}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {timeRemaining?.isPast ? 'Statut' : 'Début dans'}
                  </div>
                  <div className="font-medium font-mono">
                    {formatCountdown()}
                  </div>
                </div>
              </div>
            </div>

            {/* Circuit Info */}
            <div className="rounded-lg bg-muted/50 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Circuit</div>
                  <div className="text-lg font-medium">{nextRace.circuit}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Distance</div>
                  <div className="text-lg font-medium">
                    {nextRace.laps} tours × {(nextRace.distance / nextRace.laps).toFixed(2)} km
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="flex-1 h-12 text-lg gap-2"
                onClick={onViewDetails}
              >
                <TrendingUp className="h-5 w-5" />
                Voir les cotes et parier
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
