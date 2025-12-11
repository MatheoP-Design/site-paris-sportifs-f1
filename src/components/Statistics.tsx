import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Award, Zap } from "lucide-react";

export function Statistics() {
  const raceData = [
    { race: "Bahrain", verstappen: 25, hamilton: 18, leclerc: 15 },
    { race: "Arabie", verstappen: 18, hamilton: 25, leclerc: 12 },
    { race: "Australie", verstappen: 25, hamilton: 15, leclerc: 18 },
    { race: "Azerbaïdjan", verstappen: 25, hamilton: 12, leclerc: 10 },
    { race: "Miami", verstappen: 25, hamilton: 18, leclerc: 15 },
    { race: "Emilie-R.", verstappen: 18, hamilton: 25, leclerc: 15 },
  ];

  const performanceData = [
    { metric: "Qualifications", verstappen: 92, hamilton: 88, leclerc: 85 },
    { metric: "Courses", verstappen: 95, hamilton: 90, leclerc: 82 },
    { metric: "Fiabilité", verstappen: 88, hamilton: 92, leclerc: 78 },
    { metric: "Stratégie", verstappen: 90, hamilton: 94, leclerc: 86 },
  ];

  const driverStats = [
    { driver: "Max Verstappen", wins: 8, podiums: 10, poles: 6, fastestLaps: 5, points: 258, flag: "🇳🇱" },
    { driver: "Lewis Hamilton", wins: 1, podiums: 7, poles: 3, fastestLaps: 3, points: 167, flag: "🇬🇧" },
    { driver: "Charles Leclerc", wins: 1, podiums: 6, poles: 2, fastestLaps: 2, points: 135, flag: "🇲🇨" },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-4">
          <TrendingUp className="h-4 w-4 text-accent" />
          <span className="text-sm">Analytics</span>
        </div>
        <h2>Statistiques & Performances</h2>
        <p className="text-muted-foreground mt-2">Analysez les données pour optimiser vos paris</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Select defaultValue="2026">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Saison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">Saison 2026</SelectItem>
            <SelectItem value="2025">Saison 2025</SelectItem>
            <SelectItem value="2024">Saison 2024</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de circuit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les circuits</SelectItem>
            <SelectItem value="street">Circuits urbains</SelectItem>
            <SelectItem value="classic">Circuits classiques</SelectItem>
            <SelectItem value="mixed">Circuits mixtes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="evolution" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-6">
          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
            <div className="p-6">
              <h3 className="mb-6">Points par course - Top 3 pilotes</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={raceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="race" stroke="#a3a3a3" />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #c0c0c0', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="verstappen" stroke="#dc0000" strokeWidth={2} name="Verstappen" />
                  <Line type="monotone" dataKey="hamilton" stroke="#00D2BE" strokeWidth={2} name="Hamilton" />
                  <Line type="monotone" dataKey="leclerc" stroke="#DC0000" strokeWidth={2} strokeDasharray="5 5" name="Leclerc" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
            <div className="p-6">
              <h3 className="mb-6">Comparaison des performances (%)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="metric" stroke="#a3a3a3" />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #c0c0c0', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="verstappen" fill="#dc0000" name="Verstappen" />
                  <Bar dataKey="hamilton" fill="#00D2BE" name="Hamilton" />
                  <Bar dataKey="leclerc" fill="#c0c0c0" name="Leclerc" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {driverStats.map((driver, index) => (
            <Card key={driver.driver} className="border-accent/20 bg-gradient-to-br from-card to-card/50">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{driver.flag}</span>
                  <div>
                    <h3>{driver.driver}</h3>
                    <p className="text-sm text-muted-foreground">{driver.points} points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-primary" />
                      <div className="text-sm text-muted-foreground">Victoires</div>
                    </div>
                    <div className="text-2xl text-primary">{driver.wins}</div>
                  </div>

                  <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <div className="text-sm text-muted-foreground">Podiums</div>
                    </div>
                    <div className="text-2xl text-accent">{driver.podiums}</div>
                  </div>

                  <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <div className="text-sm text-muted-foreground">Pôles</div>
                    </div>
                    <div className="text-2xl">{driver.poles}</div>
                  </div>

                  <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-2">Tours rapides</div>
                    <div className="text-2xl">{driver.fastestLaps}</div>
                  </div>

                  <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-2">Points</div>
                    <div className="text-2xl text-primary">{driver.points}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}
