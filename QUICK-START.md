# 🚀 Démarrage Rapide

## Installation (première fois uniquement)

```bash
./setup.sh
# ou
npm run setup
```

## Démarrage des serveurs

### Option 1 : Les deux serveurs en une commande (recommandé)

```bash
npm start
# ou
./start.sh
```

### Option 2 : Serveurs séparés

**Terminal 1 - Backend Django :**
```bash
npm run start:backend
# ou
./start-backend.sh
```

**Terminal 2 - Frontend Vite :**
```bash
npm run start:frontend
# ou
npm run dev
```

## URLs

Une fois démarrés, accédez à :

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000/api
- **Django Admin** : http://localhost:8000/admin

## Dépannage

### Port déjà utilisé

Si vous voyez une erreur "port already in use" :

```bash
# Trouver le processus utilisant le port 8000
lsof -i :8000

# Trouver le processus utilisant le port 3000
lsof -i :3000

# Arrêter le processus (remplacez PID par le numéro du processus)
kill -9 PID
```

### Vérifier les logs

```bash
# Logs Django
tail -f /tmp/django.log

# Logs Vite
tail -f /tmp/vite.log
```

### Réinstaller les dépendances

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

## Commandes utiles

```bash
# Appliquer les migrations Django
cd backend
source .venv/bin/activate
python manage.py migrate

# Créer un superutilisateur Django
python manage.py createsuperuser

# Vérifier la configuration
python manage.py check
```


