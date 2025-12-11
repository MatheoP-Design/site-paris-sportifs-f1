import { Flag, Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
                <Flag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                F1 RACING BETS
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              La plateforme de paris sportifs dédiée à la Formule 1. 
              Vivez l'adrénaline de la course avec les meilleures cotes.
            </p>
          </div>

          <div>
            <h4 className="mb-4">Paris</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-primary">Prochains GP</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Paris en direct</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Cotes spéciales</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Paris combinés</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Informations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-primary">À propos</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Comment parier</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Jeu responsable</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Centre d'aide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Suivez-nous</h4>
            <div className="flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/50 transition-colors hover:border-primary hover:bg-primary/10">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/50 transition-colors hover:border-primary hover:bg-primary/10">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/50 transition-colors hover:border-primary hover:bg-primary/10">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/50 transition-colors hover:border-primary hover:bg-primary/10">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2025 F1 Racing Bets. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">Conditions générales</a>
            <a href="#" className="transition-colors hover:text-primary">Politique de confidentialité</a>
            <a href="#" className="transition-colors hover:text-primary">Cookies</a>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-yellow-600/30 bg-yellow-600/10 p-4">
          <p className="text-xs text-yellow-600">
            ⚠️ Le jeu peut créer une dépendance. Jouez de manière responsable. Interdit aux mineurs. 
            Ce site est fictif et créé à des fins de démonstration uniquement.
          </p>
        </div>
      </div>
    </footer>
  );
}
