import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Medal, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { leaderboardApi } from '../utils/api';
import { motion } from 'motion/react';

interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  profit: number;
  balance: number;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const { leaderboard: data } = await leaderboardApi.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-500/50 bg-yellow-500/5';
      case 2:
        return 'border-gray-400/50 bg-gray-400/5';
      case 3:
        return 'border-amber-700/50 bg-amber-700/5';
      default:
        return 'border-border';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-primary" />
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Classement des Parieurs
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les meilleurs parieurs de la plateforme classés selon leurs profits totaux
          </p>
        </motion.div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </Card>
            ))
          ) : leaderboard.length === 0 ? (
            <Card className="p-12 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Aucun parieur pour le moment</h3>
              <p className="text-muted-foreground">
                Soyez le premier à placer des paris et à figurer au classement !
              </p>
            </Card>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isProfitable = entry.profit > 0;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-6 hover:shadow-lg transition-all ${getRankColor(rank)}`}>
                    <div className="flex items-center gap-6">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 flex items-center justify-center">
                        {getRankIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                          {entry.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="truncate">{entry.name}</h3>
                          {rank <= 3 && (
                            <Badge variant="secondary" className="text-xs">
                              TOP {rank}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{entry.totalBets} paris</span>
                          <span>•</span>
                          <span>{entry.winRate.toFixed(1)}% victoires</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-right">
                        {/* Profit */}
                        <div>
                          <div className="flex items-center gap-1 justify-end mb-1">
                            {isProfitable ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={`font-bold ${
                                isProfitable ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {isProfitable ? '+' : ''}
                              {entry.profit.toFixed(2)}€
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Profit total</p>
                        </div>

                        {/* Balance */}
                        <div className="hidden sm:block">
                          <div className="font-bold mb-1">{entry.balance.toFixed(2)}€</div>
                          <p className="text-xs text-muted-foreground">Solde actuel</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Stats Summary */}
        {!loading && leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto"
          >
            <Card className="p-6 text-center bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
              <Trophy className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <div className="font-bold text-2xl mb-1">
                {leaderboard[0]?.name || '-'}
              </div>
              <p className="text-sm text-muted-foreground">Meilleur parieur</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="font-bold text-2xl mb-1">
                {leaderboard.reduce((sum, e) => sum + e.totalBets, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total des paris</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <Award className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <div className="font-bold text-2xl mb-1">
                {(
                  leaderboard.reduce((sum, e) => sum + e.winRate, 0) / leaderboard.length
                ).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Taux de victoire moyen</p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
