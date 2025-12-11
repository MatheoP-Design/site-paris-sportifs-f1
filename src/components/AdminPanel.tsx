import { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  Edit,
  Plus,
  UserCog,
  Database,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { adminApi, racesApi } from '../utils/api';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { QuickDataImport } from './QuickDataImport';

export function AdminPanel() {
  const { user, accessToken } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [races, setRaces] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Race form state
  const [raceForm, setRaceForm] = useState({
    name: '',
    country: '',
    circuit: '',
    date: '',
    flag: '',
  });
  const [editingRace, setEditingRace] = useState<any>(null);

  useEffect(() => {
    if (accessToken && user?.role === 'admin') {
      loadAdminData();
    }
  }, [accessToken, user]);

  const loadAdminData = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const [statsData, usersData, racesData, betsData] = await Promise.all([
        adminApi.getStats(accessToken),
        adminApi.getUsers(accessToken),
        racesApi.getRaces(),
        adminApi.getBets(accessToken),
      ]);

      setStats(statsData.stats);
      setUsers(usersData.users);
      setRaces(racesData.races);
      setBets(betsData.bets);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, banned: boolean) => {
    if (!accessToken) return;

    try {
      await adminApi.banUser(accessToken, userId, banned);
      toast.success(banned ? 'Utilisateur banni' : 'Utilisateur débanni');
      loadAdminData();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    if (!accessToken) return;

    try {
      await adminApi.updateUserRole(accessToken, userId, role);
      toast.success('Rôle mis à jour');
      loadAdminData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const handleCreateRace = async () => {
    if (!accessToken) return;

    try {
      await adminApi.createRace(accessToken, raceForm);
      toast.success('Course créée avec succès');
      setRaceForm({ name: '', country: '', circuit: '', date: '', flag: '' });
      loadAdminData();
    } catch (error) {
      console.error('Error creating race:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const handleUpdateRace = async () => {
    if (!accessToken || !editingRace) return;

    try {
      await adminApi.updateRace(accessToken, editingRace.id, raceForm);
      toast.success('Course mise à jour');
      setEditingRace(null);
      setRaceForm({ name: '', country: '', circuit: '', date: '', flag: '' });
      loadAdminData();
    } catch (error) {
      console.error('Error updating race:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteRace = async (raceId: string) => {
    if (!accessToken) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette course ?')) return;

    try {
      await adminApi.deleteRace(accessToken, raceId);
      toast.success('Course supprimée');
      loadAdminData();
    } catch (error) {
      console.error('Error deleting race:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSettleBet = async (betId: string, result: 'won' | 'lost') => {
    if (!accessToken) return;

    try {
      await adminApi.settleBet(accessToken, betId, result);
      toast.success(`Pari résolu: ${result === 'won' ? 'gagné' : 'perdu'}`);
      loadAdminData();
    } catch (error) {
      console.error('Error settling bet:', error);
      toast.error('Erreur lors de la résolution');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md p-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">
            Vous devez être administrateur pour accéder à cette page.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1>Administration</h1>
          </div>
          <Alert className="bg-primary/5 border-primary/20">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Vous avez accès à toutes les fonctionnalités d'administration du site
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-6 md:grid-cols-4 mb-8"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalRaces}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Paris Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.activeBets}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Volume Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">
                  {stats.totalVolume.toFixed(0)}€
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="races" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="drivers" className="gap-2">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Pilotes</span>
            </TabsTrigger>
            <TabsTrigger value="bets" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Paris</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <CardDescription>
                  Gérer les comptes, bannir des utilisateurs et modifier les rôles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{user.name}</h4>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          {user.banned && (
                            <Badge variant="destructive">
                              <Ban className="h-3 w-3 mr-1" />
                              Banni
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Solde: {user.balance.toFixed(2)}€</span>
                          <span>Paris: {user.totalBets}</span>
                          <span>Taux: {user.winRate.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={user.banned ? 'default' : 'destructive'}
                          onClick={() => handleBanUser(user.id, !user.banned)}
                        >
                          {user.banned ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Débannir
                            </>
                          ) : (
                            <>
                              <Ban className="h-4 w-4 mr-1" />
                              Bannir
                            </>
                          )}
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <UserCog className="h-4 w-4 mr-1" />
                              Rôle
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier le rôle</DialogTitle>
                              <DialogDescription>
                                Changer le rôle de {user.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Button
                                className="w-full"
                                variant={user.role === 'admin' ? 'default' : 'outline'}
                                onClick={() => handleUpdateUserRole(user.id, 'admin')}
                              >
                                Administrateur
                              </Button>
                              <Button
                                className="w-full"
                                variant={user.role === 'user' ? 'default' : 'outline'}
                                onClick={() => handleUpdateUserRole(user.id, 'user')}
                              >
                                Utilisateur
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Races Tab */}
          <TabsContent value="races" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Courses</CardTitle>
                <CardDescription>
                  Créer, modifier et supprimer des Grands Prix
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Create/Edit Form */}
                <div className="mb-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <h4 className="mb-4">
                    {editingRace ? 'Modifier la course' : 'Créer une nouvelle course'}
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        placeholder="Grand Prix de Monaco"
                        value={raceForm.name}
                        onChange={(e) =>
                          setRaceForm({ ...raceForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        placeholder="Monaco"
                        value={raceForm.country}
                        onChange={(e) =>
                          setRaceForm({ ...raceForm, country: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="circuit">Circuit</Label>
                      <Input
                        id="circuit"
                        placeholder="Circuit de Monaco"
                        value={raceForm.circuit}
                        onChange={(e) =>
                          setRaceForm({ ...raceForm, circuit: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={raceForm.date}
                        onChange={(e) =>
                          setRaceForm({ ...raceForm, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="flag">Drapeau (emoji)</Label>
                      <Input
                        id="flag"
                        placeholder="🇲🇨"
                        value={raceForm.flag}
                        onChange={(e) =>
                          setRaceForm({ ...raceForm, flag: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={editingRace ? handleUpdateRace : handleCreateRace}
                      disabled={!raceForm.name || !raceForm.country || !raceForm.date}
                    >
                      {editingRace ? (
                        <>
                          <Edit className="h-4 w-4 mr-1" />
                          Mettre à jour
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Créer
                        </>
                      )}
                    </Button>
                    {editingRace && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingRace(null);
                          setRaceForm({
                            name: '',
                            country: '',
                            circuit: '',
                            date: '',
                            flag: '',
                          });
                        }}
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>

                {/* Races List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {races.map((race) => (
                    <div
                      key={race.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <h4 className="mb-1">
                          {race.flag} {race.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {race.circuit} • {new Date(race.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingRace(race);
                            setRaceForm({
                              name: race.name,
                              country: race.country,
                              circuit: race.circuit,
                              date: race.date,
                              flag: race.flag,
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteRace(race.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab with Seed Data Importer */}
          <TabsContent value="drivers" className="space-y-4">
            <QuickDataImport onImportComplete={loadAdminData} />
          </TabsContent>

          {/* Bets Tab */}
          <TabsContent value="bets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Paris</CardTitle>
                <CardDescription>
                  Résoudre et gérer les paris des utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {bets.map((bet) => {
                    const betUser = users.find((u) => u.id === bet.userId);
                    return (
                      <div
                        key={bet.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>{betUser?.name || 'Utilisateur inconnu'}</h4>
                            <Badge
                              variant={
                                bet.status === 'won'
                                  ? 'default'
                                  : bet.status === 'lost'
                                    ? 'destructive'
                                    : 'secondary'
                              }
                            >
                              {bet.status === 'won'
                                ? 'Gagné'
                                : bet.status === 'lost'
                                  ? 'Perdu'
                                  : 'En cours'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {bet.betType} sur {bet.selection}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span>Mise: {bet.amount}€</span>
                            <span>Cote: {bet.odds}</span>
                            <span>Gain potentiel: {bet.potentialWin.toFixed(2)}€</span>
                          </div>
                        </div>

                        {bet.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleSettleBet(bet.id, 'won')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Gagné
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleSettleBet(bet.id, 'lost')}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Perdu
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {bets.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      Aucun pari pour le moment
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}