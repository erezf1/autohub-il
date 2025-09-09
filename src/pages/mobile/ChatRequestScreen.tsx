import { useState } from "react";
import { ArrowRight, User, Shield, Eye, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for dealer before contact
const mockDealer = {
  id: 1,
  businessName: "סוכנות רון הרצוג",
  rating: 4.8,
  reviewsCount: 156,
  vehiclesCount: 45,
  joinedDate: "2020",
  location: "תל אביב",
  specialties: ["רכבי יוקרה", "רכבי ספורט", "רכבים היברידיים"],
  verificationLevel: "מאומת מלא",
  lastSeen: "פעיל עכשיו",
  previewInfo: {
    vehicleInquiry: "BMW X5 2021 - 320,000 ₪",
    contextMessage: "אתה מתעניין ברכב זה ורוצה ליצור קשר עם הסוכן"
  }
};

const ChatRequestScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRequestContact = async () => {
    setIsRequesting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "בקשת צפייה נשלחה",
        description: "הבקשה נשלחה לסוכן. תקבל התראה כשהוא יאשר את הבקשה"
      });
      setIsRequesting(false);
      navigate("/mobile/chats");
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 space-x-reverse">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground hebrew-text">בקשת חשיפת פרטים</h1>
      </div>

      {/* Context Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium text-foreground hebrew-text">
                {mockDealer.previewInfo.vehicleInquiry}
              </h3>
              <p className="text-sm text-muted-foreground hebrew-text mt-1">
                {mockDealer.previewInfo.contextMessage}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dealer Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4 space-x-reverse">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {mockDealer.businessName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 space-x-reverse mb-1">
                <h2 className="text-lg font-semibold text-foreground hebrew-text">
                  {mockDealer.businessName}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 ml-1" />
                  {mockDealer.verificationLevel}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                <span className="hebrew-text">⭐ {mockDealer.rating} ({mockDealer.reviewsCount} ביקורות)</span>
                <span className="hebrew-text">📍 {mockDealer.location}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Business Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-primary">{mockDealer.vehiclesCount}</div>
                <div className="text-xs text-muted-foreground hebrew-text">רכבים במלאי</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-primary">{mockDealer.joinedDate}</div>
                <div className="text-xs text-muted-foreground hebrew-text">שנת הצטרפות</div>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h4 className="font-medium text-foreground hebrew-text mb-2">התמחויות</h4>
              <div className="flex flex-wrap gap-2">
                {mockDealer.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="hebrew-text">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium hebrew-text">{mockDealer.lastSeen}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex space-x-3 space-x-reverse">
            <Eye className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 dark:text-orange-100 hebrew-text mb-1">
                חשיפת פרטים מוגבלת
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-200 hebrew-text">
                כדי לשמור על הפרטיות, פרטי הקשר של הסוכן יחשפו רק לאחר אישור הבקשה. 
                הסוכן יקבל התראה על בקשתך ויוכל לאשר או לדחות אותה.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="space-y-3">
        <Button 
          onClick={handleRequestContact}
          disabled={isRequesting}
          size="lg"
          className="w-full hebrew-text"
        >
          {isRequesting ? "שולח בקשה..." : "בקש חשיפת פרטי קשר"}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground hebrew-text">
          לחיצה על הכפתור תשלח בקשה לסוכן לחשיפת פרטי הקשר שלו
        </p>
      </div>
    </div>
  );
};

export default ChatRequestScreen;