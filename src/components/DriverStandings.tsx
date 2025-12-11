import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function DriverStandings() {
  const standings = [
    { pos: 1, name: "Max Verstappen", team: "Red Bull Racing", points: 258, wins: 8, poles: 6, change: "up", flag: "🇳🇱", color: "#0600EF" },
    { pos: 2, name: "Sergio Perez", team: "Red Bull Racing", points: 189, wins: 2, poles: 2, change: "same", flag: "🇲🇽", color: "#0600EF" },
    { pos: 3, name: "Lewis Hamilton", team: "Mercedes", points: 167, wins: 1, poles: 3, change: "up", flag: "🇬🇧", color: "#00D2BE" },
    { pos: 4, name: "Fernando Alonso", team: "Aston Martin", points: 149, wins: 0, poles: 0, change: "down", flag: "🇪🇸", color: "#006F62" },
    { pos: 5, name: "Charles Leclerc", team: "Ferrari", points: 135, wins: 1, poles: 2, change: "up", flag: "🇲🇨", color: "#DC0000" },
    { pos: 6, name: "Carlos Sainz", team: "Ferrari", points: 118, wins: 1, poles: 1, change: "down", flag: "🇪🇸", color: "#DC0000" },
  ];

  const getChangeIcon = (change: string) => {
    if (change === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-4">
          <Trophy className="h-4 w-4 text-accent" />
          <span className="text-sm">Championnat pilotes</span>
        </div>
        <h2>Classement mondial</h2>
        <p className="text-muted-foreground mt-2">Saison 2025 - Après 11 courses</p>
      </div>

      <div className="grid gap-4">
        {standings.map((driver, index) => (
          <motion.div
            key={driver.pos}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden border-accent/20 bg-gradient-to-r from-card to-card/50 transition-all hover:border-primary/50">
              <div className="flex items-center gap-4 p-4 md:p-6">
                {/* Position */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/50">
                  <span className="text-xl">{driver.pos}</span>
                </div>

                {/* Team Color Stripe */}
                <div 
                  className="h-12 w-1 rounded-full"
                  style={{ backgroundColor: driver.color }}
                />

                {/* Driver Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{driver.flag}</span>
                    <h3 className="truncate">{driver.name}</h3>
                    {getChangeIcon(driver.change)}
                  </div>
                  <div className="text-sm text-muted-foreground">{driver.team}</div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Victoires</div>
                    <div className="text-xl text-primary">{driver.wins}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Pôles</div>
                    <div className="text-xl text-accent">{driver.poles}</div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {driver.points} pts
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
