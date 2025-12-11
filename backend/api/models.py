import uuid
from decimal import Decimal

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager that relies on the email field."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire")
        email = self.normalize_email(email)
        extra_fields.setdefault("name", "")
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Le superuser doit avoir is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Le superuser doit avoir is_superuser=True")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """User model tailored for the betting platform."""

    USER_ROLE_CHOICES = [
        ("user", "Utilisateur"),
        ("admin", "Administrateur"),
    ]

    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("1000.00"))
    role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, default="user")
    banned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email


class Driver(models.Model):
    name = models.CharField(max_length=150)
    team = models.CharField(max_length=150)
    country = models.CharField(max_length=100, blank=True)
    flag = models.CharField(max_length=8, blank=True)
    number = models.PositiveIntegerField(default=0)
    image = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Race(models.Model):
    name = models.CharField(max_length=255)
    circuit = models.CharField(max_length=255)
    city = models.CharField(max_length=150)
    country = models.CharField(max_length=150)
    flag = models.CharField(max_length=8, blank=True)
    date = models.DateField()
    laps = models.PositiveIntegerField(default=50)
    distance = models.DecimalField(max_digits=6, decimal_places=1, default=Decimal("305.0"))
    image = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class RaceDriver(models.Model):
    race = models.ForeignKey(Race, on_delete=models.CASCADE, related_name="entries")
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="race_entries")
    winner_odds = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))
    podium_odds = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))
    pole_odds = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))

    class Meta:
        unique_together = ("race", "driver")

    def __str__(self):
        return f"{self.driver.name} @ {self.race.name}"


class Bet(models.Model):
    BET_TYPE_CHOICES = [
        ("winner", "Vainqueur"),
        ("podium", "Podium"),
        ("pole", "Pole position"),
    ]

    BET_STATUS_CHOICES = [
        ("pending", "En cours"),
        ("won", "Gagné"),
        ("lost", "Perdu"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bets")
    race = models.ForeignKey(Race, on_delete=models.CASCADE, related_name="bets")
    bet_type = models.CharField(max_length=20, choices=BET_TYPE_CHOICES)
    selection = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    odds = models.DecimalField(max_digits=6, decimal_places=2)
    potential_win = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"), editable=False)
    status = models.CharField(max_length=20, choices=BET_STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.potential_win = Decimal(self.amount) * Decimal(self.odds)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.selection} ({self.bet_type})"
