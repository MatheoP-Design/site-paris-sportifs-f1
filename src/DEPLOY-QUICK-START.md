# 🚀 Guide de Déploiement Rapide - F1 Betting App

## ⚡ Mise en ligne en 10 minutes

### Étape 1 : Télécharger l'archive (✅ Déjà fait)

Vous avez déjà téléchargé l'archive du projet. Passez à l'étape 2.

---

### Étape 2 : Créer un projet Supabase (5 min)

1. **Aller sur [supabase.com](https://supabase.com)**
2. **Créer un compte** (gratuit)
3. **Créer un nouveau projet** :
   - Nom : `f1-betting` (ou autre)
   - Database Password : Choisir un mot de passe fort
   - Region : Choisir la plus proche de vos utilisateurs
   - Plan : **Free** (suffisant pour commencer)

4. **Attendre 2-3 minutes** que le projet se crée

5. **Noter vos clés** :
   - Aller dans **Settings** → **API**
   - Copier :
     - `Project URL` : `https://xxxxx.supabase.co`
     - `anon/public` key : `eyJhbG...`
     - `service_role` key : `eyJhbG...` (⚠️ À garder secrète !)

---

### Étape 3 : Configuration de l'application (2 min)

#### Option A : Déploiement sur Figma Make (Recommandé)

1. **Importer le projet** dans Figma Make
2. **Configurer les variables d'environnement** :
   - Les clés Supabase seront automatiquement détectées
3. **Publier** directement

#### Option B : Déploiement manuel

1. **Modifier `/utils/supabase/info.tsx`** :
```typescript
export const projectId = "VOTRE_PROJECT_ID" // Extraire de l'URL Supabase
export const publicAnonKey = "VOTRE_ANON_KEY" // Copié de Supabase
```

2. **Configurer les variables d'environnement Supabase** :
   - Dans Supabase Dashboard → Settings → API
   - Les Edge Functions utiliseront automatiquement :
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

---

### Étape 4 : Déployer les Edge Functions (2 min)

**Via Supabase CLI** :

```bash
# 1. Installer Supabase CLI
npm install -g supabase

# 2. Se connecter
supabase login

# 3. Lier au projet
supabase link --project-ref VOTRE_PROJECT_ID

# 4. Déployer les functions
supabase functions deploy make-server-2856b216
```

**Vérification** :
- Aller dans Dashboard Supabase → Edge Functions
- Voir `make-server-2856b216` avec status "Active"

---

### Étape 5 : Déployer le frontend (1 min)

#### Option A : Via Figma Make
- Cliquer sur **Publish**
- L'app est en ligne ! 🎉

#### Option B : Via Vercel
```bash
npm install -g vercel
vercel deploy
```

#### Option C : Via Netlify
```bash
npm run build
# Glisser-déposer le dossier dist/ sur netlify.com
```

---

### Étape 6 : Premiers tests (5 min)

1. **Ouvrir l'application** dans le navigateur

2. **Créer un compte admin** :
   - Cliquer sur "Connexion" → "S'inscrire"
   - Email : `admin@example.com`
   - Nom : `Admin F1`
   - Mot de passe : Choisir un mot de passe fort
   - ✅ Vous avez **1000€** de solde de départ

3. **Accéder au panel admin** :
   - Cliquer sur l'icône Shield (🛡️) dans le header
   - Ou ajouter `#admin` à l'URL

4. **Importer les données** :
   - Onglet **"Pilotes"**
   - Cliquer sur **"🔄 Nettoyer et Importer les Données"**
   - Attendre 5-10 secondes
   - ✅ Vous avez maintenant :
     - **20 pilotes** F1 2025
     - **24 Grands Prix** avec images
     - **480 associations** pilotes-courses avec cotes

5. **Tester un pari** :
   - Cliquer sur **"Paris"** dans le header
   - Sélectionner un Grand Prix (ex: Monaco 🇲🇨)
   - Choisir un pilote (ex: Max Verstappen)
   - Cliquer sur **"Vainqueur"** (cote ~2.10)
   - Ajuster le montant dans le coupon (ex: 50€)
   - Cliquer sur **"Placer 1 pari"**
   - ✅ Pari placé ! Nouveau solde : 950€

6. **Résoudre le pari** (admin) :
   - **Admin** → Onglet **"Paris"**
   - Voir le pari placé
   - Cliquer sur **"Gagné"** ou **"Perdu"**
   - ✅ Le solde est mis à jour automatiquement

7. **Vérifier le profil** :
   - Cliquer sur **"Profil"** dans le header
   - Voir l'historique des paris
   - Voir les statistiques

---

## ✅ C'est terminé !

Votre application F1 Betting est maintenant en ligne et fonctionnelle ! 🏎️💨

### URLs importantes

- **Application** : `https://votre-app.com` (ou domaine Figma Make)
- **Supabase Dashboard** : `https://app.supabase.com/project/VOTRE_PROJECT_ID`
- **Edge Functions** : `https://VOTRE_PROJECT_ID.supabase.co/functions/v1/make-server-2856b216`

### Prochaines étapes

1. **Créer d'autres comptes utilisateurs** pour tester
2. **Personnaliser les cotes** si besoin (Admin → Courses)
3. **Ajouter des pilotes/courses** personnalisés
4. **Configurer un domaine personnalisé** (optionnel)
5. **Activer email verification** (production) : Voir README.md

---

## 🐛 Problèmes courants

### "Failed to fetch" lors de la connexion
**Cause** : Edge Functions pas déployées ou CORS

**Solution** :
```bash
# Redéployer les functions
supabase functions deploy make-server-2856b216

# Attendre 1-2 minutes
# Vider le cache du navigateur (Ctrl+Shift+R)
```

### Pas de pilotes après import
**Cause** : Erreur dans les Edge Functions

**Solution** :
1. Ouvrir la console navigateur (F12)
2. Voir les erreurs
3. Vérifier les logs Supabase : Dashboard → Logs → Edge Functions
4. Réessayer l'import

### "Unauthorized" partout
**Cause** : Mauvaise configuration des clés

**Solution** :
1. Vérifier `/utils/supabase/info.tsx` :
   - `projectId` correct
   - `publicAnonKey` correct
2. Vérifier les variables d'environnement Supabase
3. Redéployer les Edge Functions

---

## 📊 Monitoring

### Vérifier la santé de l'application

**Dashboard Supabase** → **Logs** :
- **Auth Logs** : Voir les connexions/inscriptions
- **Edge Functions Logs** : Voir les appels API
- **Database Logs** : Voir les requêtes (si vous utilisez SQL)

**Métriques importantes** :
- Nombre d'utilisateurs
- Nombre de paris
- Volume de paris
- Erreurs API

---

## 🔒 Sécurité post-déploiement

### ⚠️ À faire immédiatement

1. **Changer le mot de passe admin** si vous avez utilisé un mot de passe test
2. **Activer 2FA** sur votre compte Supabase : Dashboard → Account → Security
3. **Configurer les alertes** : Dashboard → Settings → Alerts

### ⚠️ Pour production stricte

1. **Activer email verification** :
   - Dashboard → Authentication → Settings
   - Enable email confirmations ✓
   - Configurer SMTP (SendGrid, Mailgun, AWS SES)

2. **Limiter CORS** :
   - Modifier `/supabase/functions/server/index.tsx`
   ```typescript
   app.use('*', cors({
     origin: 'https://votre-domaine.com',
     credentials: true,
   }));
   ```

3. **Configurer un domaine personnalisé** :
   - Dashboard → Settings → API → Custom Domain

4. **Activer les backups** :
   - Plan gratuit : 7 jours automatiques
   - Plans payants : Point-in-time recovery

---

## 📈 Scaling

### Limites du plan gratuit Supabase

- ✅ **500 000 invocations** Edge Functions/mois
- ✅ **50 000 utilisateurs actifs** /mois
- ✅ **500 Mo** de base de données
- ✅ **1 Go** de storage
- ✅ **2 Go** de bande passante/mois

**Suffisant pour** :
- MVP / Prototype
- 100-500 utilisateurs actifs
- 10 000+ paris/mois

### Quand upgrader ?

**Plan Pro (25$/mois)** :
- 2 000 000 invocations
- 100 000 utilisateurs actifs
- 8 Go base de données
- Point-in-time recovery
- Support email

**Indicateurs pour upgrader** :
- Plus de 50 000 utilisateurs actifs/mois
- Plus de 500 000 requêtes API/mois
- Besoin de backups avancés
- Besoin de support prioritaire

---

## 🎉 Félicitations !

Votre application de paris F1 est maintenant en production !

**Checklist finale** :
- [x] Supabase configuré
- [x] Edge Functions déployées
- [x] Frontend en ligne
- [x] Compte admin créé
- [x] Données importées (pilotes + GP)
- [x] Paris testés
- [x] Résolution de paris testée

**Partagez votre app** :
- Avec vos amis fans de F1
- Sur les réseaux sociaux
- Dans des communautés F1

**Besoin d'aide ?**
- Consulter le **README.md** pour la documentation complète
- Consulter le **SECURITY-CHECKLIST.md** pour la sécurité
- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)

---

**Bon déploiement ! 🏎️💨🔥**

*Dernière mise à jour : 2025*
