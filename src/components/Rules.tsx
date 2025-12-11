import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollText, ShieldCheck, AlertTriangle, GaugeCircle } from "lucide-react";

export function Rules() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-4">
          <ScrollText className="h-4 w-4 text-accent" />
          <span className="text-sm">Règlement des paris</span>
        </div>
        <h2>Conditions & Règles des Paris F1</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Lisez attentivement ce règlement avant de placer des paris. En utilisant la plateforme,
          vous acceptez automatiquement l&apos;ensemble de ces règles.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="general">Règles générales</TabsTrigger>
          <TabsTrigger value="bets">Types de paris</TabsTrigger>
          <TabsTrigger value="risks">Responsabilité</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Règles d&apos;utilisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc ml-5 space-y-2">
                <li>
                  <span className="font-medium text-foreground">Compte unique :</span>{" "}
                  chaque utilisateur ne peut posséder qu&apos;un seul compte actif.
                </li>
                <li>
                  <span className="font-medium text-foreground">Solde virtuel :</span>{" "}
                  l&apos;argent et les gains affichés sur le site sont fictifs et n&apos;ont aucune
                  valeur monétaire réelle.
                </li>
                <li>
                  <span className="font-medium text-foreground">Accès réservé :</span>{" "}
                  la plateforme est destinée à un public majeur (18+). En continuant, vous
                  confirmez être majeur dans votre pays de résidence.
                </li>
                <li>
                  <span className="font-medium text-foreground">Comportement :</span>{" "}
                  tout comportement abusif, frauduleux ou contraire aux CGU pourra entraîner
                  la suspension ou la fermeture du compte.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>Validation & annulation des paris</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc ml-5 space-y-2">
                <li>
                  Un pari est considéré comme <span className="font-medium text-foreground">validé</span>{" "}
                  lorsqu&apos;il apparaît dans l&apos;historique de vos paris avec le statut
                  <Badge variant="secondary" className="mx-1 align-middle">En cours</Badge>.
                </li>
                <li>
                  Une fois validé, un pari ne peut plus être modifié ni annulé par l&apos;utilisateur.
                </li>
                <li>
                  En cas d&apos;erreur technique manifeste (cote aberrante, pilote inexistant, etc.),
                  la plateforme se réserve le droit d&apos;annuler le pari et de recréditer la mise.
                </li>
                <li>
                  Les paris sur une course annulée ou définitivement interrompue sont remboursés.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bets" className="space-y-6">
          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>Types de paris disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc ml-5 space-y-2">
                <li>
                  <span className="font-medium text-foreground">Vainqueur :</span>{" "}
                  le pari est gagnant si le pilote choisi termine <span className="font-medium">1er</span> de la course.
                </li>
                <li>
                  <span className="font-medium text-foreground">Podium :</span>{" "}
                  le pari est gagnant si le pilote termine dans le <span className="font-medium">Top 3</span>.
                </li>
                <li>
                  <span className="font-medium text-foreground">Pole position :</span>{" "}
                  le pari est gagnant si le pilote réalise la <span className="font-medium">meilleure qualification</span>.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>Calcul des gains</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Les gains potentiels sont calculés selon la formule suivante :
              </p>
              <p className="font-mono text-xs bg-muted/60 rounded px-3 py-2 inline-block">
                gain = mise × cote
              </p>
              <ul className="list-disc ml-5 mt-3 space-y-2">
                <li>
                  Si le pari est <span className="font-medium text-foreground">gagnant</span>, le gain est
                  crédité sur votre solde à la fin de la course.
                </li>
                <li>
                  Si le pari est <span className="font-medium text-foreground">perdant</span>, la mise est définitivement
                  débitée de votre solde.
                </li>
                <li>
                  En cas de pari annulé / remboursé, la mise est recréditée intégralement.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Jeu responsable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc ml-5 space-y-2">
                <li>
                  Ce site est une <span className="font-medium text-foreground">simulation</span> de paris sportifs :
                  aucun argent réel n&apos;est engagé.
                </li>
                <li>
                  Utilisez la plateforme pour vous entraîner à gérer un bankroll virtuel et à analyser les risques.
                </li>
                <li>
                  Si vous jouez sur des sites de paris réels, ne misez jamais de l&apos;argent que vous ne pouvez
                  pas vous permettre de perdre.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GaugeCircle className="h-5 w-5 text-primary" />
                Limites & sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc ml-5 space-y-2">
                <li>
                  Un montant de mise minimum et maximum peut être appliqué pour certaines courses afin de
                  garantir un jeu équilibré.
                </li>
                <li>
                  Les comptes suspects (multi-comptes, scripts automatisés, etc.) peuvent être bloqués sans préavis.
                </li>
                <li>
                  En cas de problème ou de question sur un pari, contactez l&apos;administrateur du site.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}


