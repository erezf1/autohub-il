import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, MessageSquare, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import { privateClient } from '@/integrations/supabase/privateClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Header for Private User pages
 * Shows: User name dropdown (left), Logo (center)
 * RTL layout: left = start, right = end
 */
export const PrivateHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = usePrivateAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;

      try {
        const { data } = await privateClient
          .from('private_users')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserName(data.full_name);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/private/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-border shadow-sm" dir="rtl">
      <div className="container max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side (RTL: start) - User Name with Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium text-white hover:bg-gray-800">
                <span>{userName || 'טוען...'}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-gray-900 border-gray-700">
              <DropdownMenuItem
                onClick={() => navigate('/private/profile')}
                className="cursor-pointer gap-2 text-white hover:bg-gray-800 focus:bg-gray-800"
              >
                <User className="w-4 h-4" />
                פרופיל
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/private/contact')}
                className="cursor-pointer gap-2 text-white hover:bg-gray-800 focus:bg-gray-800"
              >
                <MessageSquare className="w-4 h-4" />
                צור קשר
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-red-400 gap-2 hover:bg-gray-800 focus:bg-gray-800"
              >
                <LogOut className="w-4 h-4" />
                התנתק
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Center - Logo */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => navigate('/private/dashboard')}
        >
          <Logo size="sm" />
        </div>

        {/* Right side (RTL: end) - Empty spacer for balance */}
        <div className="w-16" />
      </div>
    </header>
  );
};
