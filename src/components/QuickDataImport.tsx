import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Database, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../utils/api';

interface QuickDataImportProps {
  onImportComplete?: () => void;
}

export function QuickDataImport({ onImportComplete }: QuickDataImportProps) {
  const { accessToken } = useAuth();
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState('');
  const [completed, setCompleted] = useState(false);

  const importAllData = async () => {
    if (!accessToken) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      setImporting(true);
      setCompleted(false);

      setProgress('🗑️ Nettoyage de la base de données...');
      const cleanData = await adminApi.cleanDatabase(accessToken);
      setProgress(`✓ Base nettoyée (${cleanData.deleted} éléments supprimés)`);
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress('👤 Import des 20 pilotes...');
      const driversData = await adminApi.importDrivers(accessToken);
      setProgress(`✓ ${driversData.count} pilotes importés`);
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress('🏁 Import des 24 Grands Prix...');
      const racesData = await adminApi.importRaces(accessToken);
      setProgress(`✓ ${racesData.count} Grands Prix importés`);
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress('🔗 Association des pilotes aux courses avec cotes...');
      const associationsData = await adminApi.importAssociations(accessToken);
      setProgress(`✓ ${associationsData.count} associations créées avec cotes`);

      setCompleted(true);
      toast.success('Import complet réussi !');

      // Call the callback to refresh admin data
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error: any) {
      console.error('Error importing data:', error);
      toast.error(error.message || 'Erreur lors de l\'import');
      setProgress('❌ Erreur lors de l\'import');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Import Complet F1 2026
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-2">Import intelligent en 1 clic</p>
              <p className="text-sm text-muted-foreground">
                Cet outil effectue un import propre :
              </p>
            </div>
          </div>
          <ul className="text-sm space-y-1 ml-7 list-disc text-muted-foreground">
            <li>🗑️ Nettoie d'abord toutes les courses, pilotes, associations et paris existants</li>
            <li>👤 Importe 20 pilotes (Hamilton → Ferrari, Sainz → Williams)</li>
            <li>🏁 Importe 24 Grands Prix 2026 (Mars à Décembre)</li>
            <li>🔗 Crée 480 associations avec cotes réalistes</li>
            <li>💰 Remet le solde de tous les utilisateurs à 1000€ (nouveau bankroll de départ)</li>
          </ul>
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 mt-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <Trash2 className="h-4 w-4 flex-shrink-0" />
              <span>Les paris des utilisateurs sont supprimés</span>
            </p>
          </div>
        </div>

        {progress && (
          <div className={`rounded-lg p-4 border ${completed
            ? 'bg-green-500/10 border-green-500/20'
            : progress.includes('❌')
              ? 'bg-destructive/10 border-destructive/20'
              : 'bg-primary/10 border-primary/20'
            }`}>
            <div className="flex items-center gap-2">
              {importing && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              {completed && <CheckCircle className="h-4 w-4 text-green-500" />}
              {!importing && !completed && progress.includes('❌') && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm font-mono">{progress}</span>
            </div>
          </div>
        )}

        <Button
          onClick={importAllData}
          disabled={importing}
          className="w-full"
          size="lg"
        >
          {importing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Import en cours...
            </>
          ) : (
            <>
              <Database className="h-5 w-5 mr-2" />
              Nettoyer et Importer les données
            </>
          )}
        </Button>

        {completed && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400 mb-1">
                  Import terminé avec succès !
                </p>
                <p className="text-sm text-muted-foreground">
                  Allez sur la page <strong>Paris</strong> pour voir tous les GP et placer vos paris.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}