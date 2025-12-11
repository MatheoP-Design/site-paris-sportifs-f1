#!/bin/bash

# Script de configuration initiale du projet
# Installe toutes les dépendances nécessaires

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔧 Configuration du projet F1...${NC}\n"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}❌ Erreur: Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

# Installation des dépendances Node
echo -e "${BLUE}📦 Installation des dépendances Node.js...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Dépendances Node installées${NC}\n"
else
    echo -e "${GREEN}✓ Dépendances Node déjà installées${NC}\n"
fi

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

# Configuration du backend Python
echo -e "${BLUE}🐍 Configuration du backend Python...${NC}"
cd backend

# Trouver un Python compatible
PYTHON_CMD=$(find_python)
if [ -z "$PYTHON_CMD" ]; then
    echo -e "${RED}❌ Python 3.10 ou supérieur est requis mais n'a pas été trouvé.${NC}"
    echo -e "${YELLOW}💡 Veuillez installer Python 3.10, 3.11 ou 3.12${NC}"
    echo -e "${YELLOW}   Sur macOS: brew install python@3.11${NC}"
    echo -e "${YELLOW}   Sur Linux: sudo apt install python3.11${NC}"
    exit 1
fi

python_version=$($PYTHON_CMD --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✓ Python $python_version trouvé${NC}"

# Vérifier si le venv existe et est valide
venv_needs_recreate=0

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
        echo -e "${YELLOW}Recréation du venv...${NC}"
        rm -rf .venv
    else
        echo -e "${YELLOW}Création du venv...${NC}"
    fi
    $PYTHON_CMD -m venv .venv || {
        echo -e "${RED}❌ Erreur lors de la création du venv${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Venv créé avec $PYTHON_CMD${NC}"
fi

echo -e "${BLUE}Mise à jour de pip...${NC}"
.venv/bin/pip install --quiet --upgrade pip || {
    echo -e "${YELLOW}⚠️  Impossible de mettre à jour pip, continuation...${NC}"
}

# Vérifier la version de Django
echo -e "${BLUE}Vérification de Django...${NC}"
django_version=$(.venv/bin/python -c "import django; print(django.__version__)" 2>/dev/null || echo "")
required_version="5.1.2"

if [ -z "$django_version" ] || [ "$django_version" != "$required_version" ]; then
    echo -e "${YELLOW}⚠️  Django n'est pas installé ou la version est incorrecte (trouvé: ${django_version:-none}, requis: $required_version)${NC}"
    echo -e "${BLUE}Installation des dépendances Python...${NC}"
    .venv/bin/pip install --quiet -r requirements.txt || {
        echo -e "${RED}❌ Erreur lors de l'installation des dépendances${NC}"
        echo -e "${YELLOW}💡 Essayez de mettre à jour pip: .venv/bin/pip install --upgrade pip${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Dépendances Python installées${NC}"
else
    echo -e "${GREEN}✓ Django $django_version est installé${NC}"
fi

echo -e "\n${BLUE}📊 Application des migrations Django...${NC}"
source .venv/bin/activate
python manage.py migrate --noinput || {
    echo -e "${RED}❌ Erreur lors de l'application des migrations${NC}"
    exit 1
}
echo -e "${GREEN}✓ Migrations appliquées${NC}"

# Remplir la base de données si elle est vide
echo -e "${BLUE}Vérification de la base de données...${NC}"
RACE_COUNT=$(python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings'); django.setup(); from api.models import Race; print(Race.objects.count())" 2>/dev/null || echo "0")

if [ "$RACE_COUNT" = "0" ]; then
    echo -e "${YELLOW}⚠️  La base de données est vide. Peuplement en cours...${NC}"
    if python populate_db.py 2>&1; then
        echo -e "${GREEN}✓ Base de données remplie avec les données de démo${NC}"
    else
        echo -e "${YELLOW}⚠️  Erreur lors du peuplement, continuation...${NC}"
    fi
else
    echo -e "${GREEN}✓ Base de données contient déjà $RACE_COUNT course(s)${NC}"
fi

cd ..

echo -e "\n${GREEN}✅ Configuration terminée !${NC}\n"
echo -e "${BLUE}Pour démarrer le projet, utilisez :${NC}"
echo -e "  ${GREEN}npm start${NC}          - Démarrer les deux serveurs"
echo -e "  ${GREEN}npm run start:backend${NC}  - Démarrer uniquement Django"
echo -e "  ${GREEN}npm run start:frontend${NC} - Démarrer uniquement Vite"
echo -e "  ${GREEN}./start.sh${NC}         - Démarrer les deux serveurs (alternative)\n"

