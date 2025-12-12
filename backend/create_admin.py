#!/usr/bin/env python
"""
Script pour créer un superutilisateur Django de manière non-interactive.
Usage: python create_admin.py
"""

import os
import sys
import django

# Configuration de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import User

def create_admin():
    email = 'admin@f1.com'
    password = 'admin123'
    name = 'Administrateur'
    
    # Vérifier si l'utilisateur existe déjà
    if User.objects.filter(email=email).exists():
        print(f"⚠️  L'utilisateur {email} existe déjà.")
        user = User.objects.get(email=email)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.role = 'admin'
        user.save()
        print(f"✅ Le compte a été mis à jour avec le mot de passe: {password}")
    else:
        # Créer le superutilisateur
        user = User.objects.create_superuser(
            email=email,
            password=password,
            name=name
        )
        print(f"✅ Superutilisateur créé avec succès!")
        print(f"   Email: {email}")
        print(f"   Mot de passe: {password}")
    
    print(f"\n📍 Vous pouvez maintenant vous connecter à:")
    print(f"   http://localhost:8000/admin")
    print(f"   avec l'email: {email}")

if __name__ == '__main__':
    create_admin()


