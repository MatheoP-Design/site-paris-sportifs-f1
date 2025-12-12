from django.contrib import admin

from .models import Bet, Driver, Race, RaceDriver, User


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
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'circuit', 'city', 'country', 'flag')
        }),
        ('Détails de la course', {
            'fields': ('date', 'laps', 'distance', 'image')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
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
    list_display = ('id', 'user', 'race', 'bet_type', 'selection', 'amount', 'odds', 'potential_win', 'status', 'created_at')
    list_filter = ('status', 'bet_type', 'created_at')
    search_fields = ('user__email', 'selection', 'race__name')
    list_per_page = 25
    readonly_fields = ('id', 'potential_win', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Informations du pari', {
            'fields': ('id', 'user', 'race', 'bet_type', 'selection')
        }),
        ('Montants et cotes', {
            'fields': ('amount', 'odds', 'potential_win')
        }),
        ('Statut', {
            'fields': ('status',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )
