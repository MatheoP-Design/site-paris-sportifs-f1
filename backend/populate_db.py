"""
Script de peuplement pour le backend Django actuel.

Il crée :
- quelques utilisateurs de démo
- les 24 Grands Prix 2025
- les 20 pilotes 2025
- les associations course/pilote avec cotes
- quelques paris d'exemple

À lancer depuis le dossier `backend/` :

    source .venv/bin/activate
    python populate_db.py
"""

import os
import django
import random
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from api.models import User, Race, Driver, RaceDriver, Bet  # noqa: E402
from api.seed_data import RACES_2025, DRIVERS_2025  # noqa: E402


# -----------------------------
# Utilisateurs
# -----------------------------
def create_users():
    users_data = [
        {"email": "matt@example.com", "name": "Matheo Poulain", "balance": 1000},
        {"email": "anna@example.com", "name": "Anna Dupont", "balance": 500},
        {"email": "leo@example.com", "name": "Leo Martin", "balance": 800},
    ]
    users = []
    for u in users_data:
        user, created = User.objects.get_or_create(
            email=u["email"],
            defaults={
                "name": u["name"],
                "balance": Decimal(u["balance"]),
                "role": "user",
            },
        )
        if created:
            user.set_password("password")
            user.save()
        users.append(user)
    print(f"{len(users)} utilisateurs créés/présents.")
    return users


# -----------------------------
# Courses (Races_2025)
# -----------------------------
def create_races():
    races = []
    for r in RACES_2025:
        race, _ = Race.objects.get_or_create(
            name=r["name"],
            defaults={
                "circuit": r["circuit"],
                "city": r["city"],
                "country": r["country"],
                "flag": r["flag"],
                "date": r["date"],
                "laps": r.get("laps", 50),
                "distance": Decimal(str(r.get("distance", 305.0))),
                "image": r.get("image", ""),
            },
        )
        races.append(race)
    print(f"{len(races)} courses créées/présentes.")
    return races


# -----------------------------
# Pilotes (Drivers_2025)
# -----------------------------
def create_drivers():
    drivers = []
    for d in DRIVERS_2025:
        driver, _ = Driver.objects.get_or_create(
            name=d["name"],
            defaults={
                "team": d["team"],
                "country": d["country"],
                "flag": d["flag"],
                "number": d.get("number", 0),
                "image": d.get("image", ""),
            },
        )
        drivers.append(driver)
    print(f"{len(drivers)} pilotes créés/présents.")
    return drivers


# -----------------------------
# Associations course/pilote + cotes
# -----------------------------
def create_race_drivers(races, drivers):
    RaceDriver.objects.all().delete()

    # Map pour retrouver les base_odds par nom de pilote
    base_odds_map = {d["name"]: Decimal(str(d.get("base_odds", 25.0))) for d in DRIVERS_2025}

    created = 0
    for race in races:
        for driver in drivers:
            base = base_odds_map.get(driver.name, Decimal("25.0"))
            winner = base
            podium = max(winner * Decimal("0.6"), Decimal("1.50"))
            pole = max(winner * Decimal("0.8"), Decimal("1.80"))

            RaceDriver.objects.create(
                race=race,
                driver=driver,
                winner_odds=winner,
                podium_odds=podium,
                pole_odds=pole,
            )
            created += 1

    print(f"{created} associations course/pilote créées.")
    return RaceDriver.objects.select_related("race", "driver").all()


# -----------------------------
# Paris de démo
# -----------------------------
def create_sample_bets(users, race_drivers):
    """Crée quelques paris aléatoires pour alimenter l’historique/stats."""
    states = ["pending", "won", "lost"]
    total_bets = 0

    for user in users:
        for _ in range(3):
            if user.balance < Decimal("10"):
                continue

            rd = random.choice(race_drivers)
            amount = Decimal(random.randint(10, int(user.balance)))
            odds = rd.winner_odds

            # Débiter la mise
            user.balance -= amount
            user.save(update_fields=["balance"])

            bet = Bet.objects.create(
                user=user,
                race=rd.race,
                bet_type="winner",
                selection=rd.driver.name,
                amount=amount,
                odds=odds,
                status="pending",
            )

            # Résultat aléatoire
            result = random.choices(states, weights=[0.5, 0.25, 0.25])[0]
            bet.status = result
            bet.save(update_fields=["status", "updated_at"])

            if result == "won":
                user.balance += bet.potential_win
                user.save(update_fields=["balance"])

            total_bets += 1

    print(f"{total_bets} paris de démo créés.")


# -----------------------------
# Main
# -----------------------------
if __name__ == "__main__":
    print("Peuplement de la base Django F1...")
    users = create_users()
    races = create_races()
    drivers = create_drivers()
    race_drivers = create_race_drivers(races, drivers)
    create_sample_bets(users, race_drivers)
    print("Peuplement terminé ✅")
