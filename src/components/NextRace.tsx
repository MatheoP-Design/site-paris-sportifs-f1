import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, MapPin, Clock, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function NextRace() {
  const topDrivers = [
    { name: "Max Verstappen", team: "Red Bull Racing", odds: "2.10", flag: "🇳🇱" },
    { name: "Lewis Hamilton", team: "Mercedes", odds: "3.50", flag: "🇬🇧" },
    { name: "Charles Leclerc", team: "Ferrari", odds: "4.20", flag: "🇲🇨" },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm">Prochain événement</span>
        </div>
        <h2>Grand Prix de Monaco</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Race Info */}
        <Card className="lg:col-span-2 overflow-hidden border-accent/20 bg-gradient-to-br from-card to-card/50">
          <div className="relative h-64">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1694865995615-e9fe6962c8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjB0cmFjayUyMGFlcmlhbHxlbnwxfHx8fDE3NjI2MTAzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Monaco Circuit"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <Badge className="absolute top-4 left-4 bg-primary">
              Dans 3 jours
            </Badge>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div>26 Mai 2026</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Circuit</div>
                  <div>Monte-Carlo</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Heure</div>
                  <div>15:00 CET</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button className="flex-1">Parier sur ce GP</Button>
              <Button variant="outline" className="flex-1">Voir les détails</Button>
            </div>
          </div>
        </Card>

        {/* Favorites */}
        <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
          <div className="p-6">
            <h3 className="mb-6">Favoris pour la victoire</h3>
            <div className="space-y-4">
              {topDrivers.map((driver, index) => (
                <motion.div
                  key={driver.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-center justify-between rounded-lg border border-border bg-background/50 p-4 transition-all hover:border-primary/50 hover:bg-background cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/50">
                      <span className="text-xl">{driver.flag}</span>
                    </div>
                    <div>
                      <div>{driver.name}</div>
                      <div className="text-sm text-muted-foreground">{driver.team}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl text-primary">{driver.odds}</div>
                    <div className="text-xs text-muted-foreground">cote</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              Voir tous les pilotes
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
