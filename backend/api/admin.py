from django.contrib import admin

from .models import Bet, Driver, Race, RaceDriver, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'balance', 'banned', 'created_at')
    search_fields = ('email', 'name')
    list_filter = ('role', 'banned')


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'country')
    search_fields = ('name', 'team')


@admin.register(Race)
class RaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'date')
    search_fields = ('name', 'country', 'city')
    list_filter = ('country',)


@admin.register(RaceDriver)
class RaceDriverAdmin(admin.ModelAdmin):
    list_display = ('race', 'driver', 'winner_odds', 'podium_odds', 'pole_odds')
    search_fields = ('race__name', 'driver__name')


@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
    list_display = ('user', 'race', 'bet_type', 'selection', 'amount', 'status', 'created_at')
    list_filter = ('status', 'bet_type')
    search_fields = ('user__email', 'selection', 'race__name')
