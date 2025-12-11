from decimal import Decimal
from typing import Any, Dict

from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Count, Q, Sum
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Bet, Driver, Race, RaceDriver, User
from .permissions import IsAdminRole
from .seed_data import DRIVERS_2025, RACES_2025
from .serializers import (
    BetSerializer,
    DriverSerializer,
    LeaderboardEntrySerializer,
    RaceDriverSerializer,
    RaceSerializer,
    UserSerializer,
    UserStatsSerializer,
)


def build_tokens(user: User) -> Dict[str, str]:
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


def serialize_user(user: User) -> Dict[str, Any]:
    return UserSerializer(user).data


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name')

        if not all([email, password, name]):
            return Response({'error': 'Tous les champs sont requis'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Un compte existe déjà avec cet email'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(email=email, password=password, name=name)
        tokens = build_tokens(user)
        return Response({'user': serialize_user(user), **tokens}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not all([email, password]):
            return Response({'error': 'Email et mot de passe requis'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.banned:
            return Response({'error': 'Compte banni. Contactez le support.'}, status=status.HTTP_403_FORBIDDEN)

        tokens = build_tokens(user)
        return Response({'user': serialize_user(user), **tokens})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'user': serialize_user(request.user)})


class RaceListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        races = Race.objects.all().order_by('date')
        return Response({'races': RaceSerializer(races, many=True).data})


class RaceDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, race_id: int):
        try:
            race = Race.objects.get(pk=race_id)
        except Race.DoesNotExist:
            return Response({'error': 'Course introuvable'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'race': RaceSerializer(race).data})


class RaceDriversView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, race_id: int):
        try:
            race = Race.objects.get(pk=race_id)
        except Race.DoesNotExist:
            return Response({'error': 'Course introuvable'}, status=status.HTTP_404_NOT_FOUND)

        entries = race.entries.select_related('driver').all()
        return Response({'drivers': RaceDriverSerializer(entries, many=True).data})


class DriverListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        drivers = Driver.objects.all().order_by('name')
        return Response({'drivers': DriverSerializer(drivers, many=True).data})


class PlaceBetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.banned:
            return Response({'error': 'Votre compte est banni'}, status=status.HTTP_403_FORBIDDEN)

        race_id = request.data.get('raceId')
        bet_type = request.data.get('betType')
        selection = request.data.get('selection')
        amount = request.data.get('amount')
        odds = request.data.get('odds')

        if not all([race_id, bet_type, selection, amount, odds]):
            return Response({'error': 'Tous les champs sont requis'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            race = Race.objects.get(pk=race_id)
        except Race.DoesNotExist:
            return Response({'error': 'Course introuvable'}, status=status.HTTP_404_NOT_FOUND)

        amount = Decimal(str(amount))
        odds = Decimal(str(odds))

        if user.balance < amount:
            return Response({'error': 'Solde insuffisant'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            bet = Bet.objects.create(
                user=user,
                race=race,
                bet_type=bet_type,
                selection=selection,
                amount=amount,
                odds=odds,
            )
            user.balance -= amount
            user.save(update_fields=['balance'])

        return Response({'bet': BetSerializer(bet).data}, status=status.HTTP_201_CREATED)


class MyBetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bets = request.user.bets.select_related('race').order_by('-created_at')
        return Response({'bets': BetSerializer(bets, many=True).data})


class LeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.annotate(
            total_bets=Count('bets'),
            total_wins=Count('bets', filter=Q(bets__status='won')),
            total_losses=Count('bets', filter=Q(bets__status='lost')),
            won_amount=Sum('bets__potential_win', filter=Q(bets__status='won')),
            lost_amount=Sum('bets__amount', filter=Q(bets__status='lost')),
        )

        leaderboard = []
        for user in users:
            won_amount = user.won_amount or Decimal('0.0')
            lost_amount = user.lost_amount or Decimal('0.0')
            profit = float(won_amount - lost_amount)
            win_rate = 0.0
            if user.total_bets:
                win_rate = round((user.total_wins / user.total_bets) * 100, 2)

            leaderboard.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'totalBets': user.total_bets,
                'totalWins': user.total_wins,
                'totalLosses': user.total_losses,
                'winRate': win_rate,
                'profit': profit,
                'balance': float(user.balance),
            })

        leaderboard.sort(key=lambda entry: entry['profit'], reverse=True)
        return Response({'leaderboard': LeaderboardEntrySerializer(leaderboard, many=True).data})


class UserStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id: int):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)

        bets = user.bets.all()
        total_bets = bets.count()
        won_bets = bets.filter(status='won').count()
        lost_bets = bets.filter(status='lost').count()
        pending_bets = bets.filter(status='pending').count()
        total_staked = bets.aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
        best_win = bets.filter(status='won').order_by('-potential_win').first()

        won_amount = bets.filter(status='won').aggregate(total=Sum('potential_win'))['total'] or Decimal('0.0')
        lost_amount = bets.filter(status='lost').aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
        profit = won_amount - lost_amount
        roi = (profit / total_staked * 100) if total_staked > 0 else Decimal('0.0')
        avg_stake = (total_staked / total_bets) if total_bets > 0 else Decimal('0.0')

        stats = {
            'totalBets': total_bets,
            'wonBets': won_bets,
            'lostBets': lost_bets,
            'pendingBets': pending_bets,
            'profit': float(profit),
            'roi': float(roi),
            'totalStaked': float(total_staked),
            'averageStake': float(avg_stake),
            'bestWin': BetSerializer(best_win).data if best_win else None,
        }

        return Response({'stats': UserStatsSerializer(stats).data})


# -------------------- Admin endpoints --------------------


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        total_users = User.objects.count()
        total_races = Race.objects.count()
        active_bets = Bet.objects.filter(status='pending').count()
        total_volume = Bet.objects.aggregate(total=Sum('amount'))['total'] or Decimal('0.0')

        return Response({
            'stats': {
                'totalUsers': total_users,
                'totalRaces': total_races,
                'activeBets': active_bets,
                'totalVolume': float(total_volume),
            }
        })


class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        users = User.objects.all().order_by('created_at')
        return Response({'users': UserSerializer(users, many=True).data})


class AdminUserBanView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, user_id: int):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)

        banned = request.data.get('banned')
        if banned is None:
            return Response({'error': 'Valeur manquante'}, status=status.HTTP_400_BAD_REQUEST)

        user.banned = bool(banned)
        user.save(update_fields=['banned'])
        return Response({'user': UserSerializer(user).data})


class AdminUserRoleView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, user_id: int):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)

        role = request.data.get('role')
        if role not in dict(User.USER_ROLE_CHOICES):
            return Response({'error': 'Rôle invalide'}, status=status.HTTP_400_BAD_REQUEST)

        user.role = role
        user.is_staff = role == 'admin'
        user.save(update_fields=['role', 'is_staff'])
        return Response({'user': UserSerializer(user).data})


class AdminRacesView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        serializer = RaceSerializer(data=request.data)
        if serializer.is_valid():
            race = serializer.save()
            return Response({'race': RaceSerializer(race).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminRaceDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def put(self, request, race_id: int):
        try:
            race = Race.objects.get(pk=race_id)
        except Race.DoesNotExist:
            return Response({'error': 'Course introuvable'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RaceSerializer(race, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'race': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, race_id: int):
        try:
            race = Race.objects.get(pk=race_id)
        except Race.DoesNotExist:
            return Response({'error': 'Course introuvable'}, status=status.HTTP_404_NOT_FOUND)
        race.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminDriversView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        serializer = DriverSerializer(data=request.data)
        if serializer.is_valid():
            driver = serializer.save()
            return Response({'driver': DriverSerializer(driver).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDriverDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def put(self, request, driver_id: int):
        try:
            driver = Driver.objects.get(pk=driver_id)
        except Driver.DoesNotExist:
            return Response({'error': 'Pilote introuvable'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DriverSerializer(driver, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'driver': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, driver_id: int):
        try:
            driver = Driver.objects.get(pk=driver_id)
        except Driver.DoesNotExist:
            return Response({'error': 'Pilote introuvable'}, status=status.HTTP_404_NOT_FOUND)
        driver.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminRaceDriverView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, race_id: int):
        driver_id = request.data.get('driverId')
        winner_odds = request.data.get('winnerOdds', 0)
        podium_odds = request.data.get('podiumOdds', 0)
        pole_odds = request.data.get('poleOdds', 0)

        if not driver_id:
            return Response({'error': 'Pilote requis'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            race = Race.objects.get(pk=race_id)
            driver = Driver.objects.get(pk=driver_id)
        except (Race.DoesNotExist, Driver.DoesNotExist):
            return Response({'error': 'Course ou pilote introuvable'}, status=status.HTTP_404_NOT_FOUND)

        entry, _ = RaceDriver.objects.update_or_create(
            race=race,
            driver=driver,
            defaults={
                'winner_odds': Decimal(str(winner_odds)),
                'podium_odds': Decimal(str(podium_odds)),
                'pole_odds': Decimal(str(pole_odds)),
            },
        )
        return Response({'entry': RaceDriverSerializer(entry).data}, status=status.HTTP_201_CREATED)

    def delete(self, request, race_id: int, driver_id: int):
        deleted, _ = RaceDriver.objects.filter(race_id=race_id, driver_id=driver_id).delete()
        if not deleted:
            return Response({'error': 'Association introuvable'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminBetsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        bets = Bet.objects.select_related('user', 'race').order_by('-created_at')
        return Response({'bets': BetSerializer(bets, many=True).data})


class AdminSettleBetView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, bet_id):
        try:
            bet = Bet.objects.select_related('user').get(pk=bet_id)
        except Bet.DoesNotExist:
            return Response({'error': 'Pari introuvable'}, status=status.HTTP_404_NOT_FOUND)

        result = request.data.get('result')
        if result not in ('won', 'lost'):
            return Response({'error': 'Résultat invalide'}, status=status.HTTP_400_BAD_REQUEST)

        if bet.status != 'pending':
            return Response({'error': 'Pari déjà résolu'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            bet.status = result
            bet.save(update_fields=['status', 'updated_at'])

            if result == 'won':
                bet.user.balance += bet.potential_win
                bet.user.save(update_fields=['balance'])

        return Response({'bet': BetSerializer(bet).data})


class AdminImportCleanView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        deleted_entries = {
            'bets': Bet.objects.count(),
            'raceDrivers': RaceDriver.objects.count(),
            'races': Race.objects.count(),
            'drivers': Driver.objects.count(),
        }
        # Suppression complète des paris
        Bet.objects.all().delete()
        RaceDriver.objects.all().delete()
        Race.objects.all().delete()
        Driver.objects.all().delete()

        # Remise à 1000€ du solde de tous les utilisateurs
        User.objects.all().update(balance=Decimal('1000'))

        return Response({'deleted': sum(deleted_entries.values()), 'details': deleted_entries})


class AdminImportDriversView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        Driver.objects.all().delete()
        driver_instances = []
        for driver in DRIVERS_2025:
            payload = driver.copy()
            payload.pop('base_odds', None)
            driver_instances.append(Driver(**payload))

        Driver.objects.bulk_create(driver_instances)
        return Response({'count': len(driver_instances)})


class AdminImportRacesView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        Race.objects.all().delete()
        races = [Race(**race) for race in RACES_2025]
        Race.objects.bulk_create(races)
        return Response({'count': len(races)})


class AdminImportAssociationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        drivers = list(Driver.objects.all())
        races = list(Race.objects.all())

        if not drivers or not races:
            return Response({'error': "Importez d'abord les pilotes et les courses"}, status=status.HTTP_400_BAD_REQUEST)

        RaceDriver.objects.all().delete()
        created = 0

        for race in races:
            for driver in drivers:
                base_odds = next((d['base_odds'] for d in DRIVERS_2025 if d['name'] == driver.name), 25.0)
                winner = Decimal(str(base_odds))
                podium = max(winner * Decimal('0.6'), Decimal('1.50'))
                pole = max(winner * Decimal('0.8'), Decimal('1.80'))

                RaceDriver.objects.create(
                    race=race,
                    driver=driver,
                    winner_odds=winner,
                    podium_odds=podium,
                    pole_odds=pole,
                )
                created += 1

        return Response({'count': created})
