# 🏎️ F1 Betting - Application de Paris Sportifs Formule 1

Application web full-stack moderne et immersive pour les paris sportifs sur la Formule 1, désormais propulsée par un backend **Django REST**. ⚠️ Les sections historiques qui mentionnent Supabase sont en cours de mise à jour : référez-vous au README racine pour la configuration officielle du backend.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation et Déploiement](#installation-et-déploiement)
- [Configuration Supabase](#configuration-supabase)
- [Structure du Projet](#structure-du-projet)
- [Guide d'Utilisation](#guide-dutilisation)
- [Sécurité](#sécurité)
- [Support](#support)

## ✨ Fonctionnalités

### 🎯 Pour les Utilisateurs
- **Authentification complète** : Inscription, connexion, gestion de profil
- **Paris sur 24 Grands Prix** : Calendrier complet de la saison 2025 avec images spécifiques pour chaque circuit
- **Multiples types de paris** : 
  - Vainqueur de la course
  - Podium (Top 3)
  - Pole Position
- **Coupon de paris premium** : Interface élégante avec calcul des gains en temps réel
- **Profil utilisateur** : 
  - Historique complet des paris
  - Statistiques détaillées
  - Gestion du solde (1000€ de départ)
  - Filtres par statut (En cours, Gagnés, Perdus)
- **Classement des parieurs** : Leaderboard avec profits et taux de réussite
- **20 Pilotes F1** : Grille complète 2025 avec tous les teams

### 👑 Pour les Administrateurs
- **Dashboard statistiques** : Vue d'ensemble des utilisateurs, paris, volume
- **Gestion des utilisateurs** : 
  - Bannir/débannir
  - Modifier les rôles (admin/user)
  - Voir les statistiques par utilisateur
- **Gestion des courses** : 
  - Créer/modifier/supprimer des GP
  - 24 GP pré-configurés avec images
- **Gestion des paris** : 
  - Voir tous les paris
  - Résoudre les paris (Gagné/Perdu)
  - Mise à jour automatique des soldes
- **Import rapide** : 
  - Nettoyer complètement la base
  - Importer 20 pilotes
  - Importer 24 GP avec images
  - Créer 480 associations pilotes-courses avec cotes

### 🎨 Design & UX
- **Thème F1** : Couleurs noir, rouge et argent
- **Scrollbar personnalisée** : Rouge F1 sur toutes les listes
- **Scroll containerisé** : Optimisation UX sans scroll de page complet
- **Responsive** : Mobile, tablette, desktop
- **Animations fluides** : Transitions et micro-interactions
- **Icons** : Lucide React pour une UI cohérente

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS v4** pour le styling
- **Shadcn/UI** pour les composants
- **Motion/React** pour les animations
- **Sonner** pour les notifications toast
- **Lucide React** pour les icônes

### Backend
- **Supabase** : 
  - Auth (authentification)
  - Edge Functions (API serverless)
  - PostgreSQL (base de données)
  - Storage (non utilisé actuellement)
- **Hono** : Framework web pour Edge Functions
- **Key-Value Store** : Système custom pour le stockage

## 📦 Prérequis

- Compte Supabase (gratuit)
- Node.js 18+ (pour le développement local uniquement)
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

## 🚀 Installation et Déploiement

### Option 1 : Déploiement sur Figma Make (Recommandé)

L'application est déjà configurée pour Figma Make. Il suffit de :

1. **Télécharger l'archive** du projet
2. **Créer un projet Supabase** (voir section Configuration Supabase)
3. **Importer dans Figma Make** 
4. **Publier** via Figma Make

### Option 2 : Déploiement Manuel

#### 1. Cloner ou télécharger le projet

```bash
# Via Git
git clone [votre-repo-url]
cd f1-betting-app

# Ou télécharger et extraire l'archive ZIP
```

#### 2. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte gratuit
3. Créer un nouveau projet
4. Noter vos clés :
   - `Project URL` : https://[project-id].supabase.co
   - `Anon/Public Key` : eyJhbG...
   - `Service Role Key` : eyJhbG... (⚠️ À GARDER SECRÈTE)

#### 3. Configuration des variables d'environnement

Les variables d'environnement sont déjà configurées dans Figma Make. Si vous déployez manuellement :

**Fichier `/utils/supabase/info.tsx`** :
```typescript
export const projectId = "VOTRE_PROJECT_ID"
export const publicAnonKey = "VOTRE_ANON_KEY"
```

**Variables d'environnement Supabase** (déjà configurées automatiquement) :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

⚠️ **IMPORTANT** : Ne jamais exposer la `SERVICE_ROLE_KEY` dans le code frontend !

#### 4. Déployer les Edge Functions

Les Edge Functions sont dans `/supabase/functions/server/` :

```bash
# Installer Supabase CLI
npm install -g supabase

# Login
supabase login

# Lier au projet
supabase link --project-ref VOTRE_PROJECT_ID

# Déployer les functions
supabase functions deploy make-server-2856b216
```

#### 5. Build et déploiement du frontend

```bash
# Installer les dépendances
npm install

# Build de production
npm run build

# Le dossier dist/ contient les fichiers à déployer
```

**Options de déploiement** :
- **Vercel** : `vercel deploy`
- **Netlify** : Glisser-déposer le dossier `dist/`
- **Cloudflare Pages** : Connecter via Git
- **Figma Make** : Déploiement automatique

## ⚙️ Configuration Supabase

### 1. Base de données (KV Store)

La base de données utilise un système Key-Value custom. Une table `kv_store_2856b216` est créée automatiquement par les Edge Functions.

**Aucune migration SQL n'est nécessaire** ✅

### 2. Authentification

Supabase Auth est déjà configuré. Pour activer les logins sociaux (optionnel) :

1. Dashboard Supabase → Authentication → Providers
2. Activer Google, Facebook, GitHub, etc.
3. Suivre les instructions : [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

⚠️ **Email Confirmation** : Désactivée par défaut (auto-confirm). Pour activer :
- Dashboard → Authentication → Settings
- Décocher "Enable email confirmations"

### 3. Politiques de sécurité

Les politiques RLS (Row Level Security) ne sont pas utilisées car on utilise un système KV custom. La sécurité est gérée au niveau de l'API (Edge Functions).

### 4. CORS

CORS est déjà configuré dans les Edge Functions :
```typescript
app.use('*', cors());
```

## 📁 Structure du Projet

```
/
├── components/              # Composants React
│   ├── ui/                 # Composants Shadcn/UI
│   ├── Header.tsx          # Navigation principale
│   ├── Hero.tsx            # Section hero page d'accueil
│   ├── NextRaceHome.tsx    # Prochaine course (accueil)
│   ├── AllRacesList.tsx    # Liste des 24 GP
│   ├── RaceDetails.tsx     # Détails GP + Coupon de paris
│   ├── UserProfile.tsx     # Profil utilisateur
│   ├── Leaderboard.tsx     # Classement
│   ├── AdminPanel.tsx      # Panel admin complet
│   └── ...
├── contexts/               # Contexts React
│   └── AuthContext.tsx     # Gestion authentification
├── utils/                  # Utilitaires
│   ├── api.ts             # Appels API centralisés
│   └── supabase/
│       └── info.tsx       # Config Supabase (public)
├── supabase/functions/server/  # Edge Functions
│   ├── index.tsx          # API routes (Hono)
│   └── kv_store.tsx       # KV Store utilities
├── styles/
│   └── globals.css        # Styles globaux + scrollbar custom
├── App.tsx                # Composant principal
└── README.md              # Ce fichier
```

## 📖 Guide d'Utilisation

### Pour les Utilisateurs

#### 1. Inscription
1. Cliquer sur "Connexion" dans le header
2. Onglet "S'inscrire"
3. Remplir : Email, Nom, Mot de passe
4. Solde de départ : **1000€**

#### 2. Placer un pari
1. **Paris** → Sélectionner un Grand Prix
2. Choisir un pilote et un type de pari (Vainqueur/Podium/Pole)
3. Ajuster le montant dans le coupon
4. **Placer les paris** (bouton vert)

#### 3. Voir son profil
1. **Profil** dans le header
2. Onglets :
   - **Historique** : Tous les paris avec filtre
   - **Statistiques** : Taux de réussite, profits, etc.
   - **Paramètres** : Modifier le mot de passe

#### 4. Consulter le classement
1. **Classement** dans le header
2. Voir les meilleurs parieurs par profit

### Pour les Administrateurs

#### 1. Accéder au panel admin
- **Méthode 1** : Cliquer sur l'icône Shield dans le header
- **Méthode 2** : URL directe avec `#admin`

#### 2. Importer les données (Première fois)
1. **Admin** → Onglet "Pilotes"
2. Cliquer sur **"🔄 Nettoyer et Importer les Données"**
3. Étapes automatiques :
   - ✅ Nettoie la base (drivers, races, associations)
   - ✅ Importe 20 pilotes F1 2025
   - ✅ Importe 24 Grands Prix avec images
   - ✅ Crée 480 associations avec cotes

#### 3. Gérer les paris
1. **Admin** → Onglet "Paris"
2. Pour chaque pari en attente :
   - Bouton **Gagné** : Ajoute les gains au solde
   - Bouton **Perdu** : Mise perdue (déjà déduite)

#### 4. Gérer les utilisateurs
1. **Admin** → Onglet "Utilisateurs"
2. Actions :
   - **Bannir/Débannir** : Empêche de placer des paris
   - **Modifier le rôle** : Admin ou User

#### 5. Gérer les courses
1. **Admin** → Onglet "Courses"
2. Actions :
   - **Créer** : Formulaire en haut
   - **Modifier** : Cliquer sur ✏️
   - **Supprimer** : Cliquer sur 🗑️

## 🔒 Sécurité

### ✅ Points de sécurité vérifiés

#### Backend (Edge Functions)
- ✅ **Service Role Key** : Jamais exposée au frontend
- ✅ **Auth Middleware** : Vérification des tokens sur routes protégées
- ✅ **Admin Check** : Vérification du rôle admin
- ✅ **Input Validation** : Validation des données entrantes
- ✅ **Error Handling** : Messages d'erreur sécurisés (pas de stack traces)
- ✅ **CORS** : Configuré pour accepter toutes les origines
- ✅ **Rate Limiting** : Géré par Supabase

#### Frontend
- ✅ **Anon Key** : Utilisation de la clé publique uniquement
- ✅ **Token Storage** : Stockage sécurisé via Supabase SDK
- ✅ **XSS Protection** : React échappe automatiquement les strings
- ✅ **HTTPS** : Forcé par Supabase et Figma Make
- ✅ **Pas de secrets** : Aucune clé API privée dans le code

#### Base de données
- ✅ **KV Store** : Accès uniquement via Edge Functions
- ✅ **User Isolation** : Les paris sont liés par userId
- ✅ **Admin Routes** : Protégées par vérification du rôle
- ✅ **Banned Users** : Ne peuvent pas placer de paris

### ⚠️ À vérifier avant la production

1. **Limiter les CORS** (optionnel) :
```typescript
// Dans /supabase/functions/server/index.tsx
app.use('*', cors({
  origin: 'https://votre-domaine.com',
  credentials: true,
}));
```

2. **Activer Email Verification** (recommandé) :
   - Supabase Dashboard → Auth → Settings
   - Activer "Enable email confirmations"
   - Configurer un email provider (SMTP)

3. **Monitoring** :
   - Activer les logs Supabase
   - Surveiller les erreurs dans Dashboard → Logs

4. **Backup** :
   - Supabase fait des backups automatiques (plan gratuit : 7 jours)
   - Pour backups manuels : Dashboard → Database → Backups

5. **Rate Limiting** :
   - Supabase : Limites automatiques
   - Pour limites custom : Ajouter middleware dans Edge Functions

## 🎨 Personnalisation

### Modifier le thème

**Fichier `/styles/globals.css`** :

```css
@theme {
  /* Couleurs F1 */
  --color-primary: oklch(55% 0.27 25);        /* Rouge F1 */
  --color-accent: oklch(70% 0.05 250);        /* Argent */
  --color-background: oklch(15% 0.01 250);    /* Noir profond */
  --color-foreground: oklch(95% 0.01 250);    /* Blanc cassé */
  
  /* Modifier ici pour changer les couleurs */
}
```

### Modifier la scrollbar

```css
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(220, 0, 0, 0.3);  /* Changer la couleur ici */
}
```

### Ajouter des pilotes/courses

Via le panel admin :
- **Pilotes** : Admin → Pilotes → Créer
- **Courses** : Admin → Courses → Formulaire de création

## 📊 Données pré-configurées

### 20 Pilotes F1 2025
- Max Verstappen (Red Bull Racing) 🇳🇱
- Sergio Pérez (Red Bull Racing) 🇲🇽
- Charles Leclerc (Ferrari) 🇲🇨
- Lewis Hamilton (Ferrari) 🇬🇧
- George Russell (Mercedes) 🇬🇧
- Kimi Antonelli (Mercedes) 🇮🇹
- Lando Norris (McLaren) 🇬🇧
- Oscar Piastri (McLaren) 🇦🇺
- Fernando Alonso (Aston Martin) 🇪🇸
- Lance Stroll (Aston Martin) 🇨🇦
- Pierre Gasly (Alpine) 🇫🇷
- Jack Doohan (Alpine) 🇦🇺
- Yuki Tsunoda (RB) 🇯🇵
- Isack Hadjar (RB) 🇫🇷
- Nico Hülkenberg (Sauber) 🇩🇪
- Gabriel Bortoleto (Sauber) 🇧🇷
- Alexander Albon (Williams) 🇹🇭
- Carlos Sainz (Williams) 🇪🇸
- Esteban Ocon (Haas) 🇫🇷
- Oliver Bearman (Haas) 🇬🇧

### 24 Grands Prix 2025
Chaque GP a une image spécifique depuis Unsplash :
1. 🇦🇺 Australie (Melbourne) - 16 mars
2. 🇨🇳 Chine (Shanghai) - 23 mars
3. 🇯🇵 Japon (Suzuka) - 6 avril
4. 🇧🇭 Bahreïn (Sakhir) - 13 avril
5. 🇸🇦 Arabie Saoudite (Djeddah) - 20 avril
6. 🇺🇸 Miami - 4 mai
7. 🇮🇹 Émilie-Romagne (Imola) - 18 mai
8. 🇲🇨 Monaco - 25 mai
9. 🇪🇸 Espagne (Barcelone) - 1 juin
10. 🇨🇦 Canada (Montréal) - 15 juin
11. 🇦🇹 Autriche (Spielberg) - 29 juin
12. 🇬🇧 Grande-Bretagne (Silverstone) - 6 juillet
13. 🇧🇪 Belgique (Spa) - 27 juillet
14. 🇭🇺 Hongrie (Budapest) - 3 août
15. 🇳🇱 Pays-Bas (Zandvoort) - 31 août
16. 🇮🇹 Italie (Monza) - 7 septembre
17. 🇦🇿 Azerbaïdjan (Bakou) - 21 septembre
18. 🇸🇬 Singapour - 5 octobre
19. 🇺🇸 États-Unis (Austin) - 19 octobre
20. 🇲🇽 Mexique - 26 octobre
21. 🇧🇷 São Paulo - 9 novembre
22. 🇺🇸 Las Vegas - 22 novembre
23. 🇶🇦 Qatar (Lusail) - 30 novembre
24. 🇦🇪 Abu Dhabi - 7 décembre

## 🐛 Dépannage

### Problème : "Unauthorized" lors de la connexion
**Solution** :
- Vérifier que les Edge Functions sont déployées
- Vérifier `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`
- Vérifier que l'email est confirmé (ou auto-confirm activé)

### Problème : Pas de pilotes/courses après import
**Solution** :
- Ouvrir la console navigateur (F12)
- Vérifier les logs d'erreur
- Réessayer l'import : Admin → Pilotes → Nettoyer et Importer

### Problème : Les paris ne s'affichent pas
**Solution** :
- Vérifier que vous êtes connecté
- Vérifier dans Profil → Historique
- Si vide, placer un nouveau pari pour tester

### Problème : CORS Error
**Solution** :
- Vérifier que les Edge Functions sont bien déployées
- Vérifier la configuration CORS dans `index.tsx`
- Attendre 1-2 minutes après le déploiement

### Problème : Images des GP ne chargent pas
**Solution** :
- Les images viennent d'Unsplash (CDN externe)
- Vérifier votre connexion internet
- Les URLs sont statiques et devraient toujours fonctionner

## 📄 Licences

### Code Source
- Application développée pour Figma Make
- Utilise Shadcn/UI sous licence MIT

### Images
- Images Unsplash sous [licence Unsplash](https://unsplash.com/license)
- Utilisation commerciale autorisée
- Attribution appréciée mais non requise

### Icônes
- Lucide React sous licence ISC

## 🤝 Support

### Questions fréquentes
1. **Comment devenir admin ?**
   - Par défaut, le premier compte créé est admin
   - Les admins peuvent promouvoir d'autres utilisateurs

2. **Les paris sont-ils réels ?**
   - Non, c'est une démo avec de l'argent virtuel
   - Solde de départ : 1000€ virtuels

3. **Puis-je modifier les cotes ?**
   - Oui, via Admin → Courses → Modifier une course
   - Ou en modifiant le code d'import des associations

4. **Combien d'utilisateurs max ?**
   - Plan gratuit Supabase : 50 000 utilisateurs actifs/mois
   - Suffisant pour un prototype/MVP

### Ressources
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation Shadcn/UI](https://ui.shadcn.com)
- [Documentation React](https://react.dev)

### Contact
Pour toute question technique ou amélioration, référez-vous à la documentation Figma Make.

---

## 🎉 Prêt pour la production !

Votre application F1 Betting est maintenant prête à être déployée :

✅ **Sécurité** : Toutes les bonnes pratiques sont appliquées
✅ **Performance** : Optimisée avec scroll containerisé et images CDN
✅ **UX** : Interface premium et intuitive
✅ **Backend** : API robuste avec Supabase Edge Functions
✅ **Data** : 24 GP + 20 pilotes + 480 associations pré-configurées
✅ **Admin** : Panel complet pour gérer l'application

**Téléchargez l'archive, configurez Supabase et c'est parti ! 🏎️💨**

---

*Développé avec ❤️ pour les fans de Formule 1*
