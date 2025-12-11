import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calendar, MapPin, Clock, Trophy, Target, Plus, Minus, X, 
  Loader2, AlertCircle, ArrowLeft, Check, ShoppingCart, Zap, ChevronUp
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { racesApi, bettingApi } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';

interface RaceDetailsProps {
  race: any;
  onBack: () => void;
}

export function RaceDetails({ race, onBack }: RaceDetailsProps) {
  const { user, accessToken, refreshUser } = useAuth();
  const [betAmount, setBetAmount] = useState(25);
  const [selectedBets, setSelectedBets] = useState<any[]>([]);
  const [raceDrivers, setRaceDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [betType, setBetType] = useState('winner');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (race) {
      loadRaceDrivers(race.id);
    }
  }, [race]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadRaceDrivers = async (raceId: string) => {
    try {
      setLoading(true);
      const { drivers } = await racesApi.getRaceDrivers(raceId);
      setRaceDrivers(drivers);
    } catch (error) {
      console.error('Error loading race drivers:', error);
      toast.error('Erreur lors du chargement des pilotes');
      setRaceDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [10, 25, 50, 100, 250];

  const addToBetSlip = (driver: any) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour parier');
      return;
    }

    const odds = 
      betType === 'winner' ? driver.winnerOdds :
      betType === 'podium' ? driver.podiumOdds :
      driver.poleOdds;

    if (!odds || odds === 0) {
      toast.error('Cotes non disponibles pour ce type de pari');
      return;
    }

    if (!selectedBets.find((bet) => bet.driver.id === driver.driver.id && bet.betType === betType)) {
      setSelectedBets([
        ...selectedBets,
        { 
          driver: driver.driver, 
          stake: betAmount, 
          odds,
          betType,
          raceId: race.id,
          raceName: race.name
        },
      ]);
      toast.success(`${driver.driver.name} ajouté au coupon`);
    } else {
      toast.info('Ce pari est déjà dans votre coupon');
    }
  };

  const removeBet = (driverName: string, type: string) => {
    setSelectedBets(
      selectedBets.filter((bet) => !(bet.driver.name === driverName && bet.betType === type))
    );
  };

  const updateBetStake = (driverName: string, type: string, newStake: number) => {
    setSelectedBets(
      selectedBets.map((bet) =>
        bet.driver.name === driverName && bet.betType === type
          ? { ...bet, stake: Math.max(1, newStake) }
          : bet
      )
    );
  };

  const totalStake = selectedBets.reduce((sum, bet) => sum + bet.stake, 0);
  const potentialWin = selectedBets.reduce(
    (sum, bet) => sum + bet.stake * bet.odds,
    0
  );

  const placeBets = async () => {
    if (!accessToken || !user) {
      toast.error('Veuillez vous connecter');
      return;
    }

    if (selectedBets.length === 0) {
      toast.error('Aucun pari sélectionné');
      return;
    }

    if (user.balance < totalStake) {
      toast.error('Solde insuffisant');
      return;
    }

    try {
      setPlacing(true);
      
      // Place all bets
      for (const bet of selectedBets) {
        await bettingApi.placeBet(accessToken, {
          raceId: bet.raceId,
          betType: bet.betType,
          selection: bet.driver.name,
          amount: bet.stake,
          odds: bet.odds,
        });
      }

      toast.success(`${selectedBets.length} pari(s) placé(s) avec succès !`);
      setSelectedBets([]);
      await refreshUser();
    } catch (error: any) {
      console.error('Error placing bets:', error);
      toast.error(error.message || 'Erreur lors du placement des paris');
    } finally {
      setPlacing(false);
    }
  };

  const getBetTypeLabel = (type: string) => {
    switch (type) {
      case 'winner':
        return 'Vainqueur';
      case 'podium':
        return 'Podium';
      case 'pole':
        return 'Pole Position';
      default:
        return type;
    }
  };

  const isPast = new Date(race.date) < new Date();

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      {/* Race Header */}
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-card to-card/50 mb-8">
        <div className="relative h-48 md:h-64">
          <ImageWithFallback
            src={race.image || 'https://images.unsplash.com/photo-1694865995615-e9fe6962c8dc?q=80&w=1200'}
            alt={race.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          <div className="absolute top-4 left-4 text-5xl">
            {race.flag}
          </div>

          {isPast && (
            <Badge variant="destructive" className="absolute top-4 right-4">
              Course terminée
            </Badge>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white drop-shadow-lg mb-1">
              {race.name}
            </h2>
            <p className="text-white/90">
              {race.circuit}
            </p>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div>
                  {new Date(race.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Lieu</div>
                <div>{race.city}, {race.country}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Distance</div>
                <div>{race.laps} tours ({race.distance} km)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!user && (
        <Alert className="mb-6 bg-primary/5 border-primary/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vous devez être connecté pour placer des paris. Créez un compte pour
            recevoir 1000€ de bonus !
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Drivers List */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="mb-4">Pilotes participants</h3>
            <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : raceDrivers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground p-6">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun pilote configuré pour cette course</p>
                </div>
              ) : (
                <Tabs
                  defaultValue="winner"
                  onValueChange={setBetType}
                  className="p-6"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="winner">Vainqueur</TabsTrigger>
                    <TabsTrigger value="podium">Podium</TabsTrigger>
                    <TabsTrigger value="pole">Pole Position</TabsTrigger>
                  </TabsList>

                  {['winner', 'podium', 'pole'].map((type) => (
                    <TabsContent key={type} value={type} className="mt-6">
                      {/* Scrollable container for drivers */}
                      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {raceDrivers.map((raceDriver, index) => {
                          const driver = raceDriver.driver;
                          const odds = 
                            type === 'winner' ? raceDriver.winnerOdds :
                            type === 'podium' ? raceDriver.podiumOdds :
                            raceDriver.poleOdds;

                          return (
                            <motion.div
                              key={driver.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4 transition-all hover:border-primary/50"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{driver.flag}</span>
                                <div>
                                  <div className="font-medium">{driver.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {driver.team}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="secondary"
                                  className="text-lg px-3 py-1"
                                >
                                  {odds > 0 ? odds.toFixed(2) : '-'}
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => addToBetSlip(raceDriver)}
                                  className="gap-2"
                                  disabled={!user || odds === 0 || isPast}
                                >
                                  <Plus className="h-4 w-4" />
                                  Parier
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </Card>
          </div>
        </div>

        {/* Betting Slip - Sticky Coupon */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-24 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
            <div className="relative">
              {/* Header avec gradient */}
              <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-6 border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg">Coupon de Paris</h3>
                      {selectedBets.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {selectedBets.length} sélection{selectedBets.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedBets.length > 0 && (
                    <Badge 
                      variant="default" 
                      className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                    >
                      {selectedBets.length}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {selectedBets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-primary/50" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Sélectionnez un pilote pour commencer
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedBets.map((bet) => (
                      <div
                        key={`${bet.driver.id}-${bet.betType}`}
                        className="rounded-lg border border-primary/20 bg-gradient-to-br from-background to-primary/5 p-4 hover:border-primary/40 transition-all duration-300 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">{bet.driver.flag}</span>
                              <span className="font-medium">{bet.driver.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getBetTypeLabel(bet.betType)}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive transition-colors"
                            onClick={() => removeBet(bet.driver.name, bet.betType)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 rounded-md bg-primary/10">
                            <span className="text-sm text-muted-foreground">Cote</span>
                            <span className="text-primary font-bold text-lg">{bet.odds.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 hover:bg-primary/10 hover:border-primary/50 transition-colors"
                              onClick={() =>
                                updateBetStake(bet.driver.name, bet.betType, Math.max(10, bet.stake - 10))
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={bet.stake}
                              onChange={(e) =>
                                updateBetStake(
                                  bet.driver.name,
                                  bet.betType,
                                  Number(e.target.value)
                                )
                              }
                              className="text-center h-9 font-medium border-primary/20 focus:border-primary/50"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 hover:bg-primary/10 hover:border-primary/50 transition-colors"
                              onClick={() =>
                                updateBetStake(bet.driver.name, bet.betType, bet.stake + 10)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-xs text-center p-2 rounded-md bg-accent/10 text-accent-foreground font-medium">
                            Gain: €{(bet.stake * bet.odds).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Montant par défaut
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="text-center"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setBetAmount(betAmount + 10)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        size="sm"
                        variant="outline"
                        onClick={() => setBetAmount(amount)}
                        className="flex-1"
                      >
                        {amount}€
                      </Button>
                    ))}
                  </div>

                  {selectedBets.length > 0 && (
                    <>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mise totale</span>
                          <span className="font-medium">€{totalStake.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Gains potentiels
                          </span>
                          <span className="text-primary font-medium">
                            €{potentialWin.toFixed(2)}
                          </span>
                        </div>
                        {user && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Solde après pari
                            </span>
                            <span
                              className={
                                user.balance - totalStake < 0
                                  ? 'text-destructive font-medium'
                                  : 'font-medium'
                              }
                            >
                              €{(user.balance - totalStake).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button
                        className="w-full gap-2"
                        size="lg"
                        onClick={placeBets}
                        disabled={!user || placing || user.balance < totalStake}
                      >
                        {placing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Placement en cours...
                          </>
                        ) : (
                          <>
                            <Check className="h-5 w-5" />
                            Placer {selectedBets.length} pari
                            {selectedBets.length > 1 ? 's' : ''}
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <Button
            className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-3 shadow-lg"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        )}
      </AnimatePresence>
    </section>
  );
}