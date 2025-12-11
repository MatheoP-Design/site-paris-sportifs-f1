# 📁 Structure du Projet - F1 Betting App

## 📂 Arborescence complète

```
f1-betting-app/
│
├── 📄 README.md                          # Documentation principale
├── 📄 CHANGELOG.md                       # Historique des versions
├── 📄 DEPLOY-QUICK-START.md             # Guide de déploiement rapide
├── 📄 SECURITY-CHECKLIST.md             # Checklist de sécurité
├── 📄 PROJECT-STRUCTURE.md              # Ce fichier
├── 📄 Attributions.md                    # Licences et attributions
├── 📄 .gitignore                        # Fichiers à ignorer (Git)
│
├── 📄 App.tsx                           # ⭐ Composant principal
│
├── 📂 components/                        # Composants React
│   ├── 📄 Header.tsx                    # Navigation principale
│   ├── 📄 Hero.tsx                      # Section hero (accueil)
│   ├── 📄 NextRaceHome.tsx              # Prochaine course (accueil)
│   ├── 📄 AllRacesList.tsx              # Liste des 24 GP
│   ├── 📄 RaceDetails.tsx               # Détails GP + Coupon de paris
│   ├── 📄 UserProfile.tsx               # Profil utilisateur
│   ├── 📄 Leaderboard.tsx               # Classement
│   ├── 📄 AdminPanel.tsx                # Panel admin complet
│   ├── 📄 QuickDataImport.tsx           # Import rapide de données
│   ├── 📄 DriverStandings.tsx           # Classement pilotes (accueil)
│   ├── 📄 Statistics.tsx                # Statistiques globales
│   ├── 📄 AuthDialog.tsx                # Dialog connexion/inscription
│   ├── 📄 Footer.tsx                    # Pied de page
│   ├── 📄 NextRace.tsx                  # Composant prochaine course
│   ├── 📄 UpcomingRaces.tsx             # Courses à venir
│   ├── 📄 BettingInterface.tsx          # Interface de paris
│   │
│   ├── 📂 ui/                           # Composants Shadcn/UI
│   │   ├── 📄 accordion.tsx
│   │   ├── 📄 alert-dialog.tsx
│   │   ├── 📄 alert.tsx
│   │   ├── 📄 aspect-ratio.tsx
│   │   ├── 📄 avatar.tsx
│   │   ├── 📄 badge.tsx
│   │   ├── 📄 breadcrumb.tsx
│   │   ├── 📄 button.tsx
│   │   ├── 📄 calendar.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 carousel.tsx
│   │   ├── 📄 chart.tsx
│   │   ├── 📄 checkbox.tsx
│   │   ├── 📄 collapsible.tsx
│   │   ├── 📄 command.tsx
│   │   ├── 📄 context-menu.tsx
│   │   ├── 📄 dialog.tsx
│   │   ├── 📄 drawer.tsx
│   │   ├── 📄 dropdown-menu.tsx
│   │   ├── 📄 form.tsx
│   │   ├── 📄 hover-card.tsx
│   │   ├── 📄 input-otp.tsx
│   │   ├── 📄 input.tsx
│   │   ├── 📄 label.tsx
│   │   ├── 📄 menubar.tsx
│   │   ├── 📄 navigation-menu.tsx
│   │   ├── 📄 pagination.tsx
│   │   ├── 📄 popover.tsx
│   │   ├── 📄 progress.tsx
│   │   ├── 📄 radio-group.tsx
│   │   ├── 📄 resizable.tsx
│   │   ├── 📄 scroll-area.tsx
│   │   ├── 📄 select.tsx
│   │   ├── 📄 separator.tsx
│   │   ├── 📄 sheet.tsx
│   │   ├── 📄 sidebar.tsx
│   │   ├── 📄 skeleton.tsx
│   │   ├── 📄 slider.tsx
│   │   ├── 📄 sonner.tsx
│   │   ├── 📄 switch.tsx
│   │   ├── 📄 table.tsx
│   │   ├── 📄 tabs.tsx
│   │   ├── 📄 textarea.tsx
│   │   ├── 📄 toggle-group.tsx
│   │   ├── 📄 toggle.tsx
│   │   ├── 📄 tooltip.tsx
│   │   ├── 📄 use-mobile.ts
│   │   └── 📄 utils.ts
│   │
│   └── 📂 figma/                        # Composants Figma
│       └── 📄 ImageWithFallback.tsx     # ⚠️ Protégé
│
├── 📂 contexts/                          # Contexts React
│   └── 📄 AuthContext.tsx               # Gestion authentification
│
├── 📂 utils/                            # Utilitaires
│   ├── 📄 api.ts                        # ⭐ Appels API centralisés
│   └── 📂 supabase/
│       └── 📄 info.tsx                  # Config Supabase (public)
│
├── 📂 supabase/functions/server/        # Edge Functions
│   ├── 📄 index.tsx                     # ⭐ API routes (Hono)
│   └── 📄 kv_store.tsx                  # ⚠️ KV Store (protégé)
│
├── 📂 styles/
│   └── 📄 globals.css                   # ⭐ Styles globaux + scrollbar
│
└── 📂 guidelines/                       # Guidelines (protégé)
    └── 📄 Guidelines.md                 # ⚠️ Ne pas modifier

```

---

## 📝 Description des fichiers clés

### 🔴 Fichiers principaux à connaître

#### `/App.tsx` ⭐
**Composant principal de l'application**
- Gestion de la navigation (tabs)
- Routing basique (home, betting, stats, profile, leaderboard, admin)
- Provider d'authentification
- Gestion du hash pour admin (#admin)

**Points clés** :
```typescript
// Navigation state
const [activeTab, setActiveTab] = useState("home");
const [selectedRace, setSelectedRace] = useState<any>(null);

// Tabs : home, betting, stats, profile, leaderboard, admin
```

---

#### `/utils/api.ts` ⭐
**Centralisation de tous les appels API**
- Auth API (signup, me)
- Betting API (placeBet, getMyBets)
- Leaderboard API
- Races API
- Drivers API
- Stats API
- Admin API (users, races, drivers, bets)

**Points clés** :
```typescript
// Base API URL
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-2856b216`;

// Token auth
Authorization: token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`
```

---

#### `/supabase/functions/server/index.tsx` ⭐
**Backend API complet (Hono)**
- 25+ routes API
- Auth : signup, me
- Bets : place, my-bets
- Races : CRUD complet
- Drivers : CRUD complet
- Admin : users, bets, stats
- Import : clean, drivers, races, associations

**Points clés** :
```typescript
// Hono app
const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Auth helper
async function verifyUser(request: Request)
async function isAdmin(userId: string): Promise<boolean>

// Démarrage
Deno.serve(app.fetch);
```

---

#### `/styles/globals.css` ⭐
**Styles globaux et thème F1**
- Thème Tailwind v4 (noir, rouge, argent)
- Scrollbar personnalisée rouge F1
- Typography par défaut
- Tokens CSS

**Points clés** :
```css
@theme {
  --color-primary: oklch(55% 0.27 25);      /* Rouge F1 */
  --color-accent: oklch(70% 0.05 250);      /* Argent */
  --color-background: oklch(15% 0.01 250);  /* Noir */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(220, 0, 0, 0.3);         /* Rouge F1 */
}
```

---

### 🟡 Composants importants

#### `/components/Header.tsx`
**Barre de navigation principale**
- Tabs : Accueil, Paris, Stats, Profil, Classement
- Bouton Connexion/Profil
- Icône Shield pour admin
- Responsive mobile

---

#### `/components/RaceDetails.tsx`
**Page de détails d'un Grand Prix**
- Header avec infos GP (drapeau, circuit, date)
- Liste des 20 pilotes avec scroll containerisé
- Coupon de paris sticky (design premium)
- 3 types de paris par pilote
- Calcul automatique des gains
- Bouton "Placer les paris"

**Fonctionnalités coupon** :
- Design gradient premium
- Scroll max-h-[400px]
- Contrôles +/- pour chaque pari
- Affichage cote + gain potentiel
- Badge compteur de sélections

---

#### `/components/AdminPanel.tsx`
**Panel administrateur complet**
- 5 onglets : Dashboard, Users, Courses, Pilotes, Paris
- Statistiques globales
- CRUD utilisateurs (ban, rôle)
- CRUD courses
- Import rapide de données
- Résolution des paris

**Import de données** :
1. Clean : Supprime drivers, races, associations
2. Import drivers : 20 pilotes
3. Import races : 24 GP avec images
4. Import associations : 480 (20×24) avec cotes

---

#### `/components/UserProfile.tsx`
**Profil utilisateur**
- Card sticky avec infos (solde, stats)
- 3 onglets : Historique, Statistiques, Paramètres
- Historique avec filtre (Tous, En cours, Gagnés, Perdus)
- Scroll containerisé pour les paris
- Modification mot de passe avec bouton œil

---

#### `/components/Leaderboard.tsx`
**Classement des meilleurs parieurs**
- Tri par profit
- Affichage : Rang, Nom, Paris, Taux réussite, Profit
- Design premium avec podium visuel
- Filtre utilisateurs bannis

---

### 🟢 Contexts et utilitaires

#### `/contexts/AuthContext.tsx`
**Context d'authentification**
- État user global
- Fonctions : login, logout, signup
- Utilise Supabase Auth
- Stockage du token

**Usage** :
```typescript
const { user, login, logout, loading } = useAuth();

// login(email, password)
// logout()
// user?.role === 'admin'
```

---

#### `/utils/supabase/info.tsx`
**Configuration Supabase (public)**
```typescript
export const projectId = "brlfyoqzbppvtbbjzvlw"
export const publicAnonKey = "eyJhbG..."
```

⚠️ **À modifier** lors du déploiement avec vos clés Supabase

---

### 🔵 Backend (Edge Functions)

#### `/supabase/functions/server/kv_store.tsx` ⚠️
**KV Store custom (PROTÉGÉ)**
- Fonctions : get, set, del, mget, mset, mdel, getByPrefix
- Interface avec table `kv_store_2856b216`
- Utilise SUPABASE_SERVICE_ROLE_KEY

**Fonctions principales** :
```typescript
await kv.get('user:123')
await kv.set('user:123', userData)
await kv.del('user:123')
await kv.getByPrefix('bet:')
```

---

### 📘 Documentation

#### `/README.md`
**Documentation complète**
- Présentation
- Fonctionnalités
- Technologies
- Installation
- Configuration Supabase
- Structure du projet
- Guide d'utilisation
- Sécurité
- Personnalisation
- Dépannage

---

#### `/DEPLOY-QUICK-START.md`
**Guide de déploiement rapide (10 min)**
1. Créer projet Supabase
2. Configurer l'app
3. Déployer Edge Functions
4. Déployer frontend
5. Premiers tests

---

#### `/SECURITY-CHECKLIST.md`
**Checklist de sécurité complète**
- Vérification des clés API
- Authentification
- Validation des données
- Protection injections
- Gestion erreurs
- CORS
- Protection données
- Rate limiting
- Backups

---

#### `/CHANGELOG.md`
**Historique des versions**
- Version 1.0.0 Production Ready
- Toutes les fonctionnalités
- Stack technique
- Données pré-configurées
- Améliorations futures possibles

---

## 🎯 Fichiers à modifier pour personnalisation

### 1️⃣ Configuration Supabase
**Fichier** : `/utils/supabase/info.tsx`
```typescript
// Remplacer par vos clés Supabase
export const projectId = "VOTRE_PROJECT_ID"
export const publicAnonKey = "VOTRE_ANON_KEY"
```

---

### 2️⃣ Thème et couleurs
**Fichier** : `/styles/globals.css`
```css
@theme {
  /* Modifier les couleurs ici */
  --color-primary: oklch(55% 0.27 25);      /* Rouge F1 */
  --color-accent: oklch(70% 0.05 250);      /* Argent */
  --color-background: oklch(15% 0.01 250);  /* Noir */
}
```

---

### 3️⃣ Données de départ
**Fichier** : `/supabase/functions/server/index.tsx`

**Pilotes** : Ligne ~848
```typescript
const drivers = [
  { name: 'Max Verstappen', team: 'Red Bull Racing', ... },
  // Ajouter/modifier pilotes ici
];
```

**Grands Prix** : Ligne ~920
```typescript
const races = [
  { name: 'Grand Prix d\'Australie', ... },
  // Ajouter/modifier GP ici
];
```

**Cotes de base** : Ligne ~1050
```typescript
const driverBaseOdds: Record<string, number> = {
  'Max Verstappen': 2.10,
  // Modifier cotes ici
};
```

---

### 4️⃣ CORS (production)
**Fichier** : `/supabase/functions/server/index.tsx`
```typescript
// Ligne 9 : Limiter aux domaines spécifiques
app.use('*', cors({
  origin: 'https://votre-domaine.com',
  credentials: true,
}));
```

---

## ⚠️ Fichiers protégés (ne pas modifier)

### `/supabase/functions/server/kv_store.tsx`
**KV Store utilities**
- Géré automatiquement
- Ne pas modifier sauf si expertise Deno/Supabase

### `/components/figma/ImageWithFallback.tsx`
**Composant Figma**
- Système de fallback pour images
- Ne pas modifier

### `/guidelines/Guidelines.md`
**Guidelines Figma Make**
- Fichier système
- Ne pas modifier

---

## 📊 Statistiques du projet

### Taille du code
- **Total lignes** : ~5000+
- **Composants React** : 15+
- **Composants UI** : 30+
- **Routes API** : 25+
- **Fichiers documentation** : 5

### Technologies
- **Frontend** : 6 packages principaux
- **Backend** : 3 packages (Hono, Supabase, Deno)
- **UI Library** : Shadcn/UI (30+ composants)

### Données
- **Pilotes** : 20
- **Teams** : 10
- **Grands Prix** : 24
- **Associations** : 480
- **Types de paris** : 3

---

## 🔍 Guide rapide des fichiers

### Je veux modifier...

#### ...les couleurs du site
→ `/styles/globals.css` (tokens @theme)

#### ...les pilotes ou GP
→ `/supabase/functions/server/index.tsx` (section import)

#### ...le design du coupon de paris
→ `/components/RaceDetails.tsx` (ligne ~330+)

#### ...les cotes
→ `/supabase/functions/server/index.tsx` (driverBaseOdds)

#### ...la navigation
→ `/components/Header.tsx`

#### ...le profil utilisateur
→ `/components/UserProfile.tsx`

#### ...le panel admin
→ `/components/AdminPanel.tsx`

#### ...les routes API
→ `/supabase/functions/server/index.tsx`

#### ...la configuration Supabase
→ `/utils/supabase/info.tsx`

---

## ✅ Checklist avant déploiement

- [ ] Modifier `/utils/supabase/info.tsx` avec vos clés
- [ ] Déployer Edge Functions sur Supabase
- [ ] Tester la connexion
- [ ] Tester l'import de données
- [ ] Tester un pari complet
- [ ] Vérifier responsive mobile
- [ ] Vérifier toutes les pages
- [ ] Consulter `/SECURITY-CHECKLIST.md`

---

**📁 Structure du projet complète et documentée !**

*Pour plus d'informations, consulter README.md*
