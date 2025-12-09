import { Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

interface PrivateSellerCardProps {
  name: string;
  phone: string;
  className?: string;
}

export const PrivateSellerCard = ({ name, phone, className }: PrivateSellerCardProps) => {
  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  // Format phone for display (add dashes)
  const formatPhone = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phoneNumber;
  };

  return (
    <GradientBorderContainer className={`rounded-xl ${className || ''}`}>
      <Card className="bg-black border-0 rounded-xl">
        <CardContent className="p-4" dir="rtl">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">
                {name?.charAt(0) || <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white hebrew-text text-lg">{name}</h3>
                <Badge className="bg-purple-600 text-white hebrew-text text-xs">
                  מפרטי
                </Badge>
              </div>
              <p className="text-muted-foreground hebrew-text text-sm">
                {formatPhone(phone)}
              </p>
            </div>

            {/* Call Button */}
            <Button 
              onClick={handleCall}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Phone className="h-4 w-4" />
              <span className="hebrew-text">התקשר</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </GradientBorderContainer>
  );
};

export default PrivateSellerCard;
