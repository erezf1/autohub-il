import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { MessageCircle, Phone } from 'lucide-react';
import { dealerClient } from '@/integrations/supabase/dealerClient';

interface DealerCardProps {
  dealerId: string;
  isRevealed: boolean;
  showChatButton?: boolean;
  showPhoneButton?: boolean;
  onChatClick?: () => void;
  onPhoneClick?: () => void;
  className?: string;
}

export const DealerCard: React.FC<DealerCardProps> = ({
  dealerId,
  isRevealed,
  showChatButton = true,
  showPhoneButton = true,
  onChatClick,
  onPhoneClick,
  className = ''
}) => {
  const { data: dealer, isLoading } = useQuery({
    queryKey: ['dealer-profile', dealerId, isRevealed],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from('user_profiles')
        .select(`
          *,
          location:locations(name_hebrew),
          user:users!inner(phone_number)
        `)
        .eq('id', dealerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!dealerId && isRevealed,
  });

  // Generate anonymous data if not revealed
  const displayData = isRevealed && dealer ? {
    name: dealer.full_name,
    businessName: dealer.business_name,
    businessDescription: dealer.business_description,
    profilePicture: dealer.profile_picture_url,
    phone: dealer.user?.phone_number,
    tenure: dealer.tenure,
    ratingTier: dealer.rating_tier,
    location: dealer.location?.name_hebrew,
  } : {
    name: `סוחר ${dealerId.substring(0, 6)}`,
    businessName: 'עסק פרטי',
    businessDescription: 'פרטי הסוחר יחשפו לאחר אישור הדדי',
    profilePicture: null,
    phone: null,
    tenure: null,
    ratingTier: 'bronze',
    location: null,
  };

  if (isLoading && isRevealed) {
    return (
      <GradientBorderContainer className="rounded-lg">
        <Card className="bg-black border-0 rounded-lg">
          <CardContent className="p-4">
            <div className="flex gap-4 animate-pulse">
              <div className="h-16 w-16 bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>
    );
  }

  const getRatingColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-500 text-white';
      case 'silver': return 'bg-gray-400 text-white';
      case 'bronze': return 'bg-orange-600 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <GradientBorderContainer className={`rounded-lg ${className}`}>
      <Card className="bg-black border-0 rounded-lg" dir="rtl">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Profile Picture */}
            <Avatar className="h-16 w-16 shrink-0">
              {displayData.profilePicture ? (
                <AvatarImage src={displayData.profilePicture} alt={displayData.name || ''} />
              ) : (
                <AvatarFallback className="text-lg bg-gray-700 text-white">
                  {isRevealed ? displayData.name?.charAt(0) : '?'}
                </AvatarFallback>
              )}
            </Avatar>

          {/* Dealer Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate text-white">{displayData.businessName}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {displayData.name}
            </p>
            {displayData.location && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {displayData.location}
              </p>
            )}
            {displayData.businessDescription && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {displayData.businessDescription}
              </p>
            )}
            
            {/* Rating & Tenure */}
            {isRevealed && displayData.ratingTier && (
              <div className="flex gap-2 mt-2 items-center">
                <Badge className={getRatingColor(displayData.ratingTier)}>
                  {displayData.ratingTier}
                </Badge>
                {displayData.tenure !== null && displayData.tenure > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {displayData.tenure} שנות ותק
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {showChatButton && (
            <GradientBorderContainer className="rounded-md flex-1">
              <Button
                variant="default"
                size="sm"
                onClick={onChatClick}
                className="bg-black border-0 w-full gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                שלח הודעה
              </Button>
            </GradientBorderContainer>
          )}
          
          {showPhoneButton && isRevealed && displayData.phone && (
            <GradientBorderContainer className="rounded-md">
              <Button
                variant="outline"
                size="sm"
                onClick={onPhoneClick}
                className="bg-black border-0 gap-2"
                asChild
              >
                <a href={`tel:${displayData.phone}`}>
                  <Phone className="h-4 w-4" />
                  התקשר
                </a>
              </Button>
            </GradientBorderContainer>
          )}
        </div>

        {/* Anonymous Notice */}
        {!isRevealed && (
          <p className="text-xs text-center text-muted-foreground mt-3">
            פרטי הסוחר יחשפו לאחר אישור הדדי בצ'אט
          </p>
        )}
      </CardContent>
    </Card>
    </GradientBorderContainer>
  );
};
