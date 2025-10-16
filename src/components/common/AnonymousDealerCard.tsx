import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

interface AnonymousDealerCardProps {
  dealerId: string;
  onChatClick: () => void;
  className?: string;
}

export const AnonymousDealerCard: React.FC<AnonymousDealerCardProps> = ({
  dealerId,
  onChatClick,
  className = ''
}) => {
  const anonymousName = `סוחר ${dealerId.substring(0, 6)}`;
  
  return (
    <Card className={className} dir="rtl">
      <CardContent className="p-4">
        <div className="flex gap-4 items-center">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className="text-lg">?</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate">{anonymousName}</h3>
            <p className="text-sm text-muted-foreground">
              עסק פרטי
            </p>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={onChatClick}
            className="gap-2 shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            צ'אט
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-3">
          פרטי הסוחר יחשפו לאחר אישור הדדי
        </p>
      </CardContent>
    </Card>
  );
};
