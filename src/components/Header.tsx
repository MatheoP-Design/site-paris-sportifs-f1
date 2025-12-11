import { Flag, TrendingUp, User, Menu, LogOut, Shield, Home, BarChart3, Trophy, ScrollText } from "lucide-react";
import LogoImage from '../assets/logo.png'; // <--- ASSUREZ-VOUS DU CHEMIN CORRECT VERS VOTRE LOGO
import { Button } from "./ui/button";
import { useState } from "react";
import { AuthDialog } from "./AuthDialog";
import { useAuth } from "../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'betting', label: 'Paris', icon: TrendingUp },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'rules', label: 'Règlement', icon: ScrollText },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'leaderboard', label: 'Classement', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('home')}>
            <div className="relative flex h-12 w-12 items-center justify-center">
              <img 
                src={LogoImage} 
                alt="Logo F1 Racing Bets" 
                className="h-full w-full object-contain"
              />
            </div>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              F1 RACING BETS
            </span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`transition-colors hover:text-primary flex items-center gap-2 ${
                  activeTab === item.id ? 'text-primary' : ''
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
            {user?.role === 'admin' && (
              <button
                onClick={() => onTabChange('admin')}
                className={`transition-colors hover:text-primary flex items-center gap-2 ${
                  activeTab === 'admin' ? 'text-primary' : ''
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden lg:flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 border border-accent/20">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm">€{user.balance.toFixed(2)}</span>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="hidden md:flex">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onTabChange('profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Mon Profil
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuItem onClick={() => onTabChange('admin')}>
                      <Shield className="h-4 w-4 mr-2" />
                      Administration
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="hidden md:flex"
              onClick={() => setAuthDialogOpen(true)}
            >
              <User className="h-4 w-4 mr-2" />
              Connexion
            </Button>
          )}
        </div>
      </div>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </header>
  );
}