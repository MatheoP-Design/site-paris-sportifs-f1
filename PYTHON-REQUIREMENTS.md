# Exigences Python

## Version requise

Ce projet nécessite **Python 3.10 ou supérieur** car Django 5.1.2 nécessite Python >= 3.10.

## Vérifier votre version de Python

```bash
python3 --version
```

Si vous voyez une version inférieure à 3.10 (par exemple 3.9, 3.8, etc.), vous devez installer une version plus récente.

## Installation de Python 3.10+

### Sur macOS

Avec Homebrew :
```bash
brew install python@3.11
# ou
brew install python@3.12
```

### Sur Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3.11
# ou
sudo apt install python3.12
```

### Sur Windows

Téléchargez Python 3.11 ou 3.12 depuis [python.org](https://www.python.org/downloads/)

## Vérification après installation

Après installation, vérifiez que la nouvelle version est disponible :

```bash
python3.11 --version
# ou
python3.12 --version
```

## Le script détecte automatiquement

Les scripts `start.sh`, `start-backend.sh` et `setup.sh` détectent automatiquement un Python compatible (3.10, 3.11, ou 3.12) et l'utilisent pour créer le venv.

Si aucun Python compatible n'est trouvé, vous verrez un message d'erreur avec des instructions pour installer la bonne version.


