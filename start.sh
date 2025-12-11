#!/bin/bash

# Script de démarrage pour le site F1
# Lance Django et Vite en parallèle

# Ne pas quitter immédiatement en cas d'erreur pour mieux les gérer
set -o pipefail

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Démarrage du site F1...${NC}\n"

# Mode debug (décommenter pour activer)
# set -x

# Fonction pour vérifier si un port est disponible
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 1
    else
        return 0
    fi
}

# Fonction pour vérifier la version de Python
check_python_version() {
    local python_cmd="$1"
    # Utiliser une syntaxe compatible avec toutes les versions de Python
    local version=$($python_cmd -c "import sys; print('{}.{}'.format(sys.version_info.major, sys.version_info.minor))" 2>/dev/null || echo "0.0")
    
    if [ "$version" = "0.0" ]; then
        return 1
    fi
    
    local major=$(echo $version | cut -d. -f1)
    local minor=$(echo $version | cut -d. -f2)
    
    if [ "$major" -lt 3 ] || ([ "$major" -eq 3 ] && [ "$minor" -lt 10 ]); then
        return 1
    fi
    return 0
}

# Fonction pour trouver un Python compatible
find_python() {
    # Essayer python3.12, python3.11, python3.10, puis python3
    for py in python3.12 python3.11 python3.10 python3; do
        if command -v "$py" &> /dev/null; then
            if check_python_version "$py"; then
                echo "$py"
                return 0
            fi
        fi
    done
    return 1
}

# Fonction pour vérifier et préparer le venv
setup_venv() {
    local backend_dir="$1"
    
    echo -e "${BLUE}Recherche d'un Python compatible (3.10+)...${NC}"
    
    # Trouver un Python compatible
    PYTHON_CMD=$(find_python)
    if [ -z "$PYTHON_CMD" ] || [ ! -n "$PYTHON_CMD" ]; then
        echo -e "${RED}❌ Python 3.10 ou supérieur est requis mais n'a pas été trouvé.${NC}"
        echo -e "${YELLOW}💡 Veuillez installer Python 3.10, 3.11 ou 3.12${NC}"
        echo -e "${YELLOW}   Sur macOS: brew install python@3.11${NC}"
        echo -e "${YELLOW}   Sur Linux: sudo apt install python3.11${NC}"
        echo -e "${YELLOW}   Vérifiez avec: python3 --version${NC}"
        return 1
    fi
    
    local python_version=$($PYTHON_CMD --version 2>&1 | awk '{print $2}' || echo "inconnue")
    echo -e "${GREEN}✓ Python $python_version trouvé ($PYTHON_CMD)${NC}"
    
    # Vérifier si le venv existe et est valide
    local venv_needs_recreate=0
    
    if [ ! -d "$backend_dir/.venv" ]; then
        venv_needs_recreate=1
    elif [ ! -f "$backend_dir/.venv/bin/python" ]; then
        venv_needs_recreate=1
    else
        # Vérifier que le venv utilise une version compatible de Python
        if ! check_python_version "$backend_dir/.venv/bin/python"; then
            echo -e "${YELLOW}⚠️  Le venv utilise une version de Python incompatible. Recréation...${NC}"
            venv_needs_recreate=1
        fi
    fi
    
    if [ "$venv_needs_recreate" -eq 1 ]; then
        if [ -d "$backend_dir/.venv" ]; then
            echo -e "${YELLOW}⚠️  Le venv doit être recréé...${NC}"
            rm -rf "$backend_dir/.venv"
        else
            echo -e "${YELLOW}⚠️  Le venv n'existe pas. Création en cours...${NC}"
        fi
        cd "$backend_dir"
        $PYTHON_CMD -m venv .venv || {
            echo -e "${RED}❌ Erreur lors de la création du venv${NC}"
            cd ..
            exit 1
        }
        echo -e "${GREEN}✓ Venv créé avec $PYTHON_CMD${NC}"
        cd ..
    fi
    
    # Mettre à jour pip
    echo -e "${BLUE}Mise à jour de pip...${NC}"
    if ! "$backend_dir/.venv/bin/pip" install --quiet --upgrade pip 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Impossible de mettre à jour pip, tentative avec verbose...${NC}"
        "$backend_dir/.venv/bin/pip" install --upgrade pip || {
            echo -e "${YELLOW}⚠️  Échec de la mise à jour de pip, continuation...${NC}"
        }
    fi
    
    # Vérifier si Django est installé avec la bonne version
    echo -e "${BLUE}Vérification de Django...${NC}"
    local django_version=""
    if [ -f "$backend_dir/.venv/bin/python" ]; then
        django_version=$("$backend_dir/.venv/bin/python" -c "import django; print(django.__version__)" 2>/dev/null || echo "")
    fi
    local required_version="5.1.2"
    
    if [ -z "$django_version" ] || [ "$django_version" != "$required_version" ]; then
        echo -e "${YELLOW}⚠️  Django n'est pas installé ou la version est incorrecte (trouvé: ${django_version:-none}, requis: $required_version)${NC}"
        echo -e "${BLUE}Installation des dépendances Python...${NC}"
        cd "$backend_dir"
        if ! .venv/bin/pip install -r requirements.txt; then
            echo -e "${RED}❌ Erreur lors de l'installation des dépendances${NC}"
            echo -e "${YELLOW}💡 Essayez de mettre à jour pip: .venv/bin/pip install --upgrade pip${NC}"
            echo -e "${YELLOW}💡 Vérifiez que vous avez Python 3.10+ : $PYTHON_CMD --version${NC}"
            cd ..
            return 1
        fi
        echo -e "${GREEN}✓ Dépendances Python installées${NC}"
        cd ..
    else
        echo -e "${GREEN}✓ Django $django_version est installé${NC}"
    fi
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}❌ Erreur: Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

# Préparer le venv
echo -e "${BLUE}Configuration de l'environnement Python...${NC}"
if ! setup_venv "backend"; then
    echo -e "${RED}❌ Impossible de préparer l'environnement Python${NC}"
    exit 1
fi

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules n'existe pas. Installation en cours...${NC}"
    npm install
    echo -e "${GREEN}✓ Dépendances Node installées${NC}"
fi

# Vérifier les migrations Django avec le venv
echo -e "${BLUE}Vérification des migrations Django...${NC}"
# Utiliser le Python du venv directement
cd backend
if [ ! -f ".venv/bin/python" ]; then
    echo -e "${RED}❌ Le venv Python n'existe pas ou est corrompu${NC}"
    cd ..
    exit 1
fi

if ! .venv/bin/python manage.py migrate --noinput 2>&1; then
    echo -e "${RED}❌ Erreur lors de l'application des migrations${NC}"
    echo -e "${YELLOW}💡 Vérifiez les logs ci-dessus pour plus de détails${NC}"
    cd ..
    exit 1
fi
echo -e "${GREEN}✓ Migrations à jour${NC}"
cd ..

# Fonction pour nettoyer les processus à l'arrêt
cleanup() {
    echo -e "\n${YELLOW}Arrêt des serveurs...${NC}"
    kill $DJANGO_PID $VITE_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Vérifier les ports
if ! check_port 8000; then
    echo -e "${RED}❌ Le port 8000 est déjà utilisé. Arrêtez le processus qui l'utilise.${NC}"
    exit 1
fi

if ! check_port 3000; then
    echo -e "${RED}❌ Le port 3000 est déjà utilisé. Arrêtez le processus qui l'utilise.${NC}"
    exit 1
fi

# Démarrer Django avec le venv
echo -e "\n${BLUE}📦 Démarrage du serveur Django (port 8000)...${NC}"
# Utiliser le Python du venv directement (plus fiable que source activate en arrière-plan)
cd backend
.venv/bin/python manage.py runserver 8000 > /tmp/django.log 2>&1 &
DJANGO_PID=$!
cd ..

# Attendre un peu pour que Django démarre
sleep 3

# Vérifier que Django a démarré correctement
if ! kill -0 $DJANGO_PID 2>/dev/null; then
    echo -e "${RED}❌ Erreur lors du démarrage de Django. Vérifiez les logs: /tmp/django.log${NC}"
    exit 1
fi

# Démarrer Vite
echo -e "${BLUE}⚡ Démarrage du serveur Vite (port 3000)...${NC}"
npm run dev > /tmp/vite.log 2>&1 &
VITE_PID=$!

# Attendre un peu pour que Vite démarre
sleep 2

# Vérifier que Vite a démarré correctement
if ! kill -0 $VITE_PID 2>/dev/null; then
    echo -e "${RED}❌ Erreur lors du démarrage de Vite. Vérifiez les logs: /tmp/vite.log${NC}"
    kill $DJANGO_PID 2>/dev/null || true
    exit 1
fi

echo -e "\n${GREEN}✅ Les deux serveurs sont démarrés !${NC}\n"
echo -e "${GREEN}📍 Frontend:    http://localhost:3000${NC}"
echo -e "${GREEN}📍 Backend API: http://localhost:8000/api${NC}"
echo -e "${GREEN}📍 Django Admin: http://localhost:8000/admin${NC}\n"
echo -e "${YELLOW}💡 Pour voir les logs:${NC}"
echo -e "   - Django: tail -f /tmp/django.log"
echo -e "   - Vite:   tail -f /tmp/vite.log\n"
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter les serveurs${NC}\n"

# Attendre que les processus se terminent
wait

