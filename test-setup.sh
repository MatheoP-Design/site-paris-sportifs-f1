#!/bin/bash

# Script de test pour diagnostiquer les problèmes de démarrage

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 Diagnostic du système...${NC}\n"

# Vérifier Python
echo -e "${BLUE}1. Vérification de Python:${NC}"
if command -v python3 &> /dev/null; then
    python3 --version
    for py in python3.12 python3.11 python3.10 python3; do
        if command -v "$py" &> /dev/null; then
            version=$($py -c "import sys; print('{}.{}'.format(sys.version_info.major, sys.version_info.minor))" 2>/dev/null || echo "erreur")
            echo -e "  ${GREEN}✓${NC} $py -> version $version"
        fi
    done
else
    echo -e "  ${RED}❌ Python3 n'est pas installé${NC}"
fi

# Vérifier Node
echo -e "\n${BLUE}2. Vérification de Node.js:${NC}"
if command -v node &> /dev/null; then
    node --version
    echo -e "  ${GREEN}✓${NC} Node.js est installé"
else
    echo -e "  ${RED}❌ Node.js n'est pas installé${NC}"
fi

# Vérifier npm
echo -e "\n${BLUE}3. Vérification de npm:${NC}"
if command -v npm &> /dev/null; then
    npm --version
    echo -e "  ${GREEN}✓${NC} npm est installé"
else
    echo -e "  ${RED}❌ npm n'est pas installé${NC}"
fi

# Vérifier le venv
echo -e "\n${BLUE}4. Vérification du venv:${NC}"
if [ -d "backend/.venv" ]; then
    echo -e "  ${GREEN}✓${NC} Le venv existe"
    if [ -f "backend/.venv/bin/python" ]; then
        venv_version=$(backend/.venv/bin/python --version 2>&1 || echo "erreur")
        echo -e "  ${GREEN}✓${NC} Python du venv: $venv_version"
    else
        echo -e "  ${RED}❌ Le Python du venv n'existe pas${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠️  Le venv n'existe pas${NC}"
fi

# Vérifier node_modules
echo -e "\n${BLUE}5. Vérification de node_modules:${NC}"
if [ -d "node_modules" ]; then
    echo -e "  ${GREEN}✓${NC} node_modules existe"
else
    echo -e "  ${YELLOW}⚠️  node_modules n'existe pas${NC}"
fi

# Vérifier les ports
echo -e "\n${BLUE}6. Vérification des ports:${NC}"
if command -v lsof &> /dev/null; then
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  ${YELLOW}⚠️  Le port 8000 est utilisé${NC}"
    else
        echo -e "  ${GREEN}✓${NC} Le port 8000 est libre"
    fi
    
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  ${YELLOW}⚠️  Le port 3000 est utilisé${NC}"
    else
        echo -e "  ${GREEN}✓${NC} Le port 3000 est libre"
    fi
else
    echo -e "  ${YELLOW}⚠️  lsof n'est pas disponible pour vérifier les ports${NC}"
fi

# Test de la fonction find_python
echo -e "\n${BLUE}7. Test de la fonction find_python:${NC}"
find_python() {
    for py in python3.12 python3.11 python3.10 python3; do
        if command -v "$py" &> /dev/null; then
            version=$($py -c "import sys; print('{}.{}'.format(sys.version_info.major, sys.version_info.minor))" 2>/dev/null || echo "0.0")
            major=$(echo $version | cut -d. -f1)
            minor=$(echo $version | cut -d. -f2)
            if [ "$major" -ge 3 ] && [ "$minor" -ge 10 ]; then
                echo "$py"
                return 0
            fi
        fi
    done
    return 1
}

PYTHON_FOUND=$(find_python)
if [ -n "$PYTHON_FOUND" ]; then
    echo -e "  ${GREEN}✓${NC} Python compatible trouvé: $PYTHON_FOUND"
else
    echo -e "  ${RED}❌ Aucun Python compatible trouvé${NC}"
fi

echo -e "\n${BLUE}✅ Diagnostic terminé${NC}\n"


