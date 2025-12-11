#!/bin/bash

# Script pour démarrer uniquement le backend Django

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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
    local version=$($python_cmd -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')" 2>/dev/null || echo "0.0")
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
    # Trouver un Python compatible
    PYTHON_CMD=$(find_python)
    if [ -z "$PYTHON_CMD" ]; then
        echo -e "${RED}❌ Python 3.10 ou supérieur est requis mais n'a pas été trouvé.${NC}"
        echo -e "${YELLOW}💡 Veuillez installer Python 3.10, 3.11 ou 3.12${NC}"
        echo -e "${YELLOW}   Sur macOS: brew install python@3.11${NC}"
        echo -e "${YELLOW}   Sur Linux: sudo apt install python3.11${NC}"
        exit 1
    fi
    
    local python_version=$($PYTHON_CMD --version 2>&1 | awk '{print $2}')
    echo -e "${GREEN}✓ Python $python_version trouvé${NC}"
    
    # Vérifier si le venv existe et est valide
    local venv_needs_recreate=0
    
    if [ ! -d ".venv" ]; then
        venv_needs_recreate=1
    elif [ ! -f ".venv/bin/python" ]; then
        venv_needs_recreate=1
    else
        # Vérifier que le venv utilise une version compatible de Python
        if ! check_python_version ".venv/bin/python"; then
            echo -e "${YELLOW}⚠️  Le venv utilise une version de Python incompatible. Recréation...${NC}"
            venv_needs_recreate=1
        fi
    fi
    
    if [ "$venv_needs_recreate" -eq 1 ]; then
        if [ -d ".venv" ]; then
            echo -e "${YELLOW}⚠️  Le venv doit être recréé...${NC}"
            rm -rf .venv
        else
            echo -e "${YELLOW}⚠️  Le venv n'existe pas. Création en cours...${NC}"
        fi
        $PYTHON_CMD -m venv .venv || {
            echo -e "${RED}❌ Erreur lors de la création du venv${NC}"
            exit 1
        }
        echo -e "${GREEN}✓ Venv créé avec $PYTHON_CMD${NC}"
    fi
    
    # Mettre à jour pip
    echo -e "${BLUE}Mise à jour de pip...${NC}"
    .venv/bin/pip install --quiet --upgrade pip || {
        echo -e "${YELLOW}⚠️  Impossible de mettre à jour pip, continuation...${NC}"
    }
    
    # Vérifier si Django est installé avec la bonne version
    local django_version=$(.venv/bin/python -c "import django; print(django.__version__)" 2>/dev/null || echo "")
    local required_version="5.1.2"
    
    if [ -z "$django_version" ] || [ "$django_version" != "$required_version" ]; then
        echo -e "${YELLOW}⚠️  Django n'est pas installé ou la version est incorrecte (trouvé: ${django_version:-none}, requis: $required_version)${NC}"
        echo -e "${BLUE}Installation des dépendances...${NC}"
        .venv/bin/pip install --quiet -r requirements.txt || {
            echo -e "${RED}❌ Erreur lors de l'installation des dépendances${NC}"
            echo -e "${YELLOW}💡 Essayez de mettre à jour pip: .venv/bin/pip install --upgrade pip${NC}"
            exit 1
        }
        echo -e "${GREEN}✓ Dépendances installées${NC}"
    else
        echo -e "${GREEN}✓ Django $django_version est installé${NC}"
    fi
}

echo -e "${BLUE}📦 Démarrage du serveur Django...${NC}\n"

cd backend

# Préparer le venv
setup_venv

# Activer le venv
source .venv/bin/activate

# Vérifier les migrations
echo -e "${BLUE}Vérification des migrations...${NC}"
python manage.py migrate --noinput || {
    echo -e "${RED}❌ Erreur lors de l'application des migrations${NC}"
    echo -e "${YELLOW}💡 Vérifiez les logs ci-dessus pour plus de détails${NC}"
    exit 1
}
echo -e "${GREEN}✓ Migrations à jour${NC}\n"

# Vérifier le port
if ! check_port 8000; then
    echo -e "${RED}❌ Le port 8000 est déjà utilisé. Arrêtez le processus qui l'utilise.${NC}"
    exit 1
fi

# Démarrer le serveur
echo -e "${GREEN}🚀 Serveur Django démarré sur http://localhost:8000${NC}"
echo -e "${GREEN}📍 API: http://localhost:8000/api${NC}"
echo -e "${GREEN}📍 Admin: http://localhost:8000/admin${NC}\n"
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}\n"

python manage.py runserver 8000

