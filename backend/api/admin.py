from django.contrib import admin
from django.contrib.admin import AdminSite

from .models import Bet, Driver, Race, RaceDriver, User


# Personnalisation du site admin
class F1AdminSite(AdminSite):
    site_header = "🏎️ Administration F1"
    site_title = "Administration F1"
    index_title = "Panneau d'administration - Paris Sportifs F1"


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'balance', 'banned', 'created_at')
    search_fields = ('email', 'name')
    list_filter = ('role', 'banned', 'created_at')
    list_per_page = 25
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Informations de connexion', {
            'fields': ('email', 'password')
        }),
        ('Profil', {
            'fields': ('name', 'role', 'balance', 'banned')
        }),
        ('Dates', {
            'fields': ('created_at',)
        }),
    )


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'country', 'number')
    search_fields = ('name', 'team', 'country')
    list_filter = ('team', 'country')
    list_per_page = 25


@admin.register(Race)
class RaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'circuit', 'country', 'date', 'laps')
    search_fields = ('name', 'country', 'city', 'circuit')
    list_filter = ('country', 'date')
    list_per_page = 25
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'circuit', 'city', 'country', 'flag')
        }),
        ('Détails de la course', {
            'fields': ('date', 'laps', 'distance', 'image')
        }),
    )


@admin.register(RaceDriver)
class RaceDriverAdmin(admin.ModelAdmin):
    list_display = ('race', 'driver', 'winner_odds', 'podium_odds', 'pole_odds')
    search_fields = ('race__name', 'driver__name')
    list_filter = ('race', 'driver__team')
    list_per_page = 25
    
    fieldsets = (
        ('Association', {
            'fields': ('race', 'driver')
        }),
        ('Cotes', {
            'fields': ('winner_odds', 'podium_odds', 'pole_odds')
        }),
    )


@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
    list_display = ('user', 'race', 'bet_type', 'selection', 'amount', 'status', 'created_at')
    list_filter = ('status', 'bet_type')
    search_fields = ('user__email', 'selection', 'race__name')
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'race')
