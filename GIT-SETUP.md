# Configuration Git et Partage du Projet

## État actuel

Le dépôt Git a été initialisé localement. Pour permettre à votre ami de cloner le projet, vous devez créer un dépôt distant sur GitHub, GitLab ou Bitbucket.

## Option 1 : GitHub (Recommandé)

### 1. Créer un nouveau dépôt sur GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur le bouton "+" en haut à droite → "New repository"
3. Nommez le dépôt (ex: `site-paris-sportifs-f1`)
4. Ne cochez PAS "Initialize with README" (le projet en a déjà un)
5. Cliquez sur "Create repository"

### 2. Lier votre dépôt local au dépôt GitHub

```bash
# Remplacez VOTRE_USERNAME et NOM_DU_REPO par vos valeurs
git remote add origin https://github.com/VOTRE_USERNAME/NOM_DU_REPO.git
git branch -M main
git push -u origin main
```

## Option 2 : GitLab

### 1. Créer un nouveau projet sur GitLab

1. Allez sur [gitlab.com](https://gitlab.com)
2. Cliquez sur "New project" → "Create blank project"
3. Nommez le projet
4. Cliquez sur "Create project"

### 2. Lier votre dépôt local au projet GitLab

```bash
git remote add origin https://gitlab.com/VOTRE_USERNAME/NOM_DU_PROJET.git
git branch -M main
git push -u origin main
```

## Option 3 : Bitbucket

### 1. Créer un nouveau dépôt sur Bitbucket

1. Allez sur [bitbucket.org](https://bitbucket.org)
2. Cliquez sur "Create" → "Repository"
3. Nommez le dépôt
4. Cliquez sur "Create repository"

### 2. Lier votre dépôt local au dépôt Bitbucket

```bash
git remote add origin https://bitbucket.org/VOTRE_USERNAME/NOM_DU_REPO.git
git branch -M main
git push -u origin main
```

## Instructions pour votre ami (Clonage)

Une fois le dépôt créé et poussé, votre ami peut cloner le projet :

```bash
# Remplacer l'URL par celle de votre dépôt
git clone https://github.com/VOTRE_USERNAME/NOM_DU_REPO.git
cd NOM_DU_REPO

# Installation et démarrage
npm run setup
npm start
```

## Commandes Git utiles

### Voir l'état du dépôt
```bash
git status
```

### Ajouter des modifications
```bash
git add .
git commit -m "Description des modifications"
git push
```

### Voir l'historique
```bash
git log
```

### Voir les branches
```bash
git branch
```

## Fichiers ignorés

Le fichier `.gitignore` est configuré pour ignorer :
- Les dossiers `node_modules/` et `.venv/`
- Les fichiers de base de données SQLite
- Les fichiers de build
- Les fichiers d'environnement (`.env`)
- Les fichiers de logs

## Sécurité

⚠️ **Important** : Ne commitez JAMAIS :
- Les fichiers `.env` contenant des clés secrètes
- Les mots de passe
- Les clés API
- Les fichiers de base de données avec des données sensibles

Le `.gitignore` est déjà configuré pour ignorer ces fichiers.

