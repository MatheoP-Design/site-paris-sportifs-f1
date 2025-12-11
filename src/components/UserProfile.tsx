import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import {
  User,
  Wallet,
  History,
  Settings,
  TrendingUp,
  TrendingDown,
  Bell,
  Shield,
  CreditCard,
  Check,
  X,
  Loader2,
  Filter,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { bettingApi, statsApi } from "../utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function UserProfile() {
  const { user, accessToken, signOut } = useAuth();
  const [bets, setBets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (accessToken && user) {
      loadUserData();
    }
  }, [accessToken, user]);

  const loadUserData = async () => {
    if (!accessToken || !user) return;

    try {
      setLoading(true);
      const [betsData, statsData] = await Promise.all([
        bettingApi.getMyBets(accessToken),
        statsApi.getUserStats(user.id),
      ]);

      setBets(betsData.bets);
      setStats(statsData.stats);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getResultBadge = (result: string) => {
    if (result === "won")
      return (
        <Badge className="bg-green-600">
          <Check className="h-3 w-3 mr-1" />
          Gagné
        </Badge>
      );
    if (result === "lost")
      return (
        <Badge variant="destructive">
          <X className="h-3 w-3 mr-1" />
          Perdu
        </Badge>
      );
    return <Badge variant="secondary">En cours</Badge>;
  };

  const filteredBets = bets.filter((bet) => {
    if (filterStatus === "all") return true;
    return bet.status === filterStatus;
  });

  if (!user) {
    return (
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">Connexion requise</h3>
          <p className="text-muted-foreground">
            Veuillez vous connecter pour accéder à votre profil
          </p>
        </Card>
      </section>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h2>Mon Profil</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Profile Summary - Fixed width */}
        <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50 h-fit lg:sticky lg:top-24">
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-4 border-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-2xl">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3>{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                Membre depuis {memberSince}
              </p>
              <Badge className="mt-2 bg-accent text-accent-foreground">
                {user.role === "admin" ? "Administrateur" : "Membre"}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Solde</span>
                </div>
                <span className="text-xl">€{user.balance.toFixed(2)}</span>
              </div>

              {stats && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        Profit
                      </span>
                    </div>
                    <span
                      className={`text-lg ${
                        stats.profit >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      €{stats.profit.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">
                        Paris placés
                      </span>
                    </div>
                    <span>{stats.totalBets}</span>
                  </div>
                </>
              )}
            </div>

            <Button className="w-full gap-2" variant="outline" disabled>
              <Wallet className="h-4 w-4" />
              Recharger mon compte
            </Button>
          </div>
        </Card>

        {/* Main Content */}
        <div>
          <Tabs defaultValue="history" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3>Mes paris récents</h3>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="pending">En cours</SelectItem>
                          <SelectItem value="won">Gagnés</SelectItem>
                          <SelectItem value="lost">Perdus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredBets.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Aucun pari trouvé</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredBets.map((bet) => (
                        <div
                          key={bet.id}
                          className="rounded-lg border border-border bg-background/50 p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4>{bet.selection}</h4>
                                {getResultBadge(bet.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {bet.betType}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                {new Date(bet.placedAt).toLocaleDateString("fr-FR")}
                              </div>
                              {bet.status === "won" && (
                                <div className="text-green-500">
                                  +€{bet.potentialWin.toFixed(2)}
                                </div>
                              )}
                              {bet.status === "lost" && (
                                <div className="text-red-500">
                                  -€{bet.amount.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Mise: €{bet.amount.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground">
                              Cote: {bet.odds.toFixed(2)}
                            </span>
                            {bet.status === "pending" && (
                              <span className="text-muted-foreground">
                                Gain potentiel: €{bet.potentialWin.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
                <div className="p-6">
                  <h3 className="mb-6">Mes statistiques</h3>
                  {loading || !stats ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Taux de réussite
                          </span>
                          {stats.wonBets > stats.lostBets ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-3xl text-primary">
                          {stats.totalBets > 0
                            ? ((stats.wonBets / stats.totalBets) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stats.wonBets}/{stats.totalBets} paris gagnés
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">ROI</span>
                          {stats.roi >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div
                          className={`text-3xl ${
                            stats.roi >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {stats.roi >= 0 ? "+" : ""}
                          {stats.roi.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Retour sur investissement
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Mise moyenne
                          </span>
                        </div>
                        <div className="text-3xl">
                          €{stats.averageStake.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Par pari
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Meilleur gain
                          </span>
                        </div>
                        <div className="text-3xl text-primary">
                          €
                          {stats.bestWin
                            ? stats.bestWin.potentialWin.toFixed(2)
                            : "0.00"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stats.bestWin ? stats.bestWin.selection : "-"}
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Total misé
                          </span>
                        </div>
                        <div className="text-3xl">€{stats.totalStaked.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Sur tous les paris
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Paris en cours
                          </span>
                        </div>
                        <div className="text-3xl text-accent">
                          {stats.pendingBets}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          En attente de résultat
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div>Alertes de courses</div>
                          <p className="text-sm text-muted-foreground">
                            Recevoir des notifications avant chaque GP
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div>Résultats de paris</div>
                          <p className="text-sm text-muted-foreground">
                            Notification à la fin de chaque course
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div>Promotions</div>
                          <p className="text-sm text-muted-foreground">
                            Offres spéciales et bonus
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Sécurité
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled
                      >
                        Changer le mot de passe
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled
                      >
                        Activer l'authentification à deux facteurs
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Informations du compte
                    </h3>
                    <div className="space-y-3">
                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="text-sm text-muted-foreground mb-1">Email</div>
                        <div>{user.email}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          Statut du compte
                        </div>
                        <Badge
                          variant={user.banned ? "destructive" : "default"}
                          className="mt-1"
                        >
                          {user.banned ? "Banni" : "Actif"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-destructive">
                      <LogOut className="h-5 w-5" />
                      Déconnexion
                    </h3>
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}