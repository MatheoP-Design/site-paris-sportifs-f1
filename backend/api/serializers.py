from decimal import Decimal

from rest_framework import serializers

from .models import Bet, Driver, Race, RaceDriver, User


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ('id', 'name', 'team', 'country', 'flag', 'number', 'image')


class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = (
            'id',
            'name',
            'circuit',
            'city',
            'country',
            'flag',
            'date',
            'laps',
            'distance',
            'image',
        )


class RaceDriverSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(read_only=True)
    winnerOdds = serializers.SerializerMethodField()
    podiumOdds = serializers.SerializerMethodField()
    poleOdds = serializers.SerializerMethodField()

    class Meta:
        model = RaceDriver
        fields = ('id', 'driver', 'winnerOdds', 'podiumOdds', 'poleOdds')

    def get_winnerOdds(self, obj: RaceDriver) -> float:
        return float(obj.winner_odds)

    def get_podiumOdds(self, obj: RaceDriver) -> float:
        return float(obj.podium_odds)

    def get_poleOdds(self, obj: RaceDriver) -> float:
        return float(obj.pole_odds)


class BetSerializer(serializers.ModelSerializer):
    betType = serializers.CharField(source='bet_type')
    placedAt = serializers.DateTimeField(source='created_at')
    userId = serializers.IntegerField(source='user_id', read_only=True)
    raceName = serializers.CharField(source='race.name', read_only=True)
    potentialWin = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    odds = serializers.SerializerMethodField()

    class Meta:
        model = Bet
        fields = (
            'id',
            'userId',
            'race',
            'raceName',
            'betType',
            'selection',
            'amount',
            'odds',
            'potentialWin',
            'status',
            'placedAt',
        )
        read_only_fields = ('raceName', 'userId')

    def get_potentialWin(self, obj: Bet) -> float:
        return float(obj.potential_win)

    def get_amount(self, obj: Bet) -> float:
        return float(obj.amount)

    def get_odds(self, obj: Bet) -> float:
        return float(obj.odds)


class UserSerializer(serializers.ModelSerializer):
    totalBets = serializers.SerializerMethodField()
    totalWins = serializers.SerializerMethodField()
    totalLosses = serializers.SerializerMethodField()
    winRate = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'name',
            'balance',
            'role',
            'banned',
            'totalBets',
            'totalWins',
            'totalLosses',
            'winRate',
            'createdAt',
        )

    def get_totalBets(self, obj: User) -> int:
        return obj.bets.count()

    def get_totalWins(self, obj: User) -> int:
        return obj.bets.filter(status='won').count()

    def get_totalLosses(self, obj: User) -> int:
        return obj.bets.filter(status='lost').count()

    def get_winRate(self, obj: User) -> float:
        total = obj.bets.count()
        if total == 0:
            return 0.0
        return round((obj.bets.filter(status='won').count() / total) * 100, 2)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['balance'] = float(instance.balance)
        return data


class UserStatsSerializer(serializers.Serializer):
    totalBets = serializers.IntegerField()
    wonBets = serializers.IntegerField()
    lostBets = serializers.IntegerField()
    pendingBets = serializers.IntegerField()
    profit = serializers.FloatField()
    roi = serializers.FloatField()
    totalStaked = serializers.FloatField()
    averageStake = serializers.FloatField()
    bestWin = serializers.DictField(allow_null=True)


class LeaderboardEntrySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    email = serializers.EmailField()
    totalBets = serializers.IntegerField()
    totalWins = serializers.IntegerField()
    totalLosses = serializers.IntegerField()
    winRate = serializers.FloatField()
    profit = serializers.FloatField()
    balance = serializers.FloatField()

