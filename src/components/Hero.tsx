import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Trophy, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1556208047-1a7a5df57398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMHJhY2luZyUyMGNpcmN1aXR8ZW58MXx8fHwxNzYyNjgxMDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="F1 Circuit"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto h-full px-4">
        <div className="flex h-full flex-col justify-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm">Saison 2025 / 2026 en direct</span>
            </div>

            <h1 className="text-6xl tracking-tight">
              Pariez sur la{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                vitesse
              </span>
            </h1>

            <p className="text-muted-foreground">
              Vivez l'adrénaline de la Formule 1 avec les meilleures cotes du marché. 
              Analysez les performances, suivez les statistiques en temps réel et placez vos paris en toute confiance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                <Trophy className="h-5 w-5" />
                Parier maintenant
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Voir les statistiques
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div>
                <div className="text-3xl text-primary">24</div>
                <div className="text-sm text-muted-foreground">Grands Prix</div>
              </div>
              <div>
                <div className="text-3xl text-accent">20</div>
                <div className="text-sm text-muted-foreground">Pilotes</div>
              </div>
              <div>
                <div className="text-3xl text-primary">10</div>
                <div className="text-sm text-muted-foreground">Écuries</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated stripe */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
