
# Site Web Paris Sportifs F1

Application complète de paris F1 comprenant :
- un front-end React/Vite (directory racine)
- un back-end Django/DRF (`backend/`) exposant toutes les API métier

## 🚀 Clonage et Installation

```bash
# Cloner le dépôt
git clone <URL_DU_DEPOT>
cd Site-Web-Paris-Sportifs-F1

# Installation automatique
npm run setup

# Démarrer les serveurs
npm start
```

Voir [GIT-SETUP.md](GIT-SETUP.md) pour les instructions complètes de configuration Git.

## Prérequis

- Node.js 18+
- **Python 3.10 ou supérieur** (3.11 ou 3.12 recommandé)
  - ⚠️ **Important** : Django 5.1.2 nécessite Python >= 3.10
  - Si vous avez une version plus ancienne, les scripts détecteront automatiquement un Python compatible
  - Voir [PYTHON-REQUIREMENTS.md](PYTHON-REQUIREMENTS.md) pour les instructions d'installation

## Installation rapide

### Méthode automatique (recommandée)

```bash
# Installation complète en une commande
./setup.sh
# ou
npm run setup
```

### Méthode manuelle

```bash
# Front
npm install

# Back
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optionnel mais conseillé
```

## Démarrage

### Méthode rapide (recommandée)

```bash
# Démarrer les deux serveurs en une commande
npm start
# ou
./start.sh
```

Cela démarre automatiquement :
- Django sur http://localhost:8000
- Vite sur http://localhost:3000

### Méthode manuelle (deux terminaux)

```bash
# Terminal 1 – API Django
npm run start:backend
# ou
./start-backend.sh

# Terminal 2 – Front React
npm run start:frontend
# ou
npm run dev
```

Le front consomme l’API via `VITE_API_BASE`. Par défaut elle pointe vers `http://localhost:8000/api`. Pour changer l’URL, créez un fichier `.env` à la racine :

```
VITE_API_BASE=https://votre-domaine/api
```

## Import des données de démo

1. Créez un compte puis transformez-le en administrateur (via l’interface Django admin ou via l’onglet Administration).
2. Rendez-vous sur la page Admin → section « Import Complet F1 2025 ».
3. Cliquez sur « Nettoyer et Importer les données ». Les courses, pilotes et associations sont générés automatiquement côté Django.

## Tests rapides de l’API

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123","name":"Demo"}'

curl http://localhost:8000/api/races
```

## Structure

- `src/` : front-end React (UI, contexts, utils…)
- `backend/` : projet Django (`config/`) + app `api/`
- `backend/api/seed_data.py` : pilotes/courses 2025 pour l’import en un clic

Bon développement ! 
  