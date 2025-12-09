import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Header for Private User pages
 * Shows logo and user menu
 */
export const PrivateHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = usePrivateAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/private/login');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="cursor-pointer"
          onClick={() => navigate('/private/dashboard')}
        >
          <Logo />
        </div>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">החשבון שלי</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => navigate('/private/profile')}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 ml-2" />
                פרופיל
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive"
              >
                <LogOut className="w-4 h-4 ml-2" />
                התנתק
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
