import { useState } from "react";
import { User, Shield, Eye, MessageCircle } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
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
        <div 
          onClick={handleBackClick}
          className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
        >
          <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
        </div>
        <h1 className="text-xl font-semibold text-foreground hebrew-text">בקשת חשיפת פרטים</h1>
      </div>

      {/* Context Card */}
      <GradientBorderContainer

        className="rounded-md"
      >
        <Card className="bg-black border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <MessageCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white hebrew-text">
                  {mockDealer.previewInfo.vehicleInquiry}
                </h3>
                <p className="text-sm text-gray-300 hebrew-text mt-1">
                  {mockDealer.previewInfo.contextMessage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Dealer Preview */}
      <GradientBorderContainer

        className="rounded-md"
      >
        <Card className="bg-black border-0">
          <CardHeader>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {mockDealer.businessName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 space-x-reverse mb-1">
                  <h2 className="text-lg font-semibold text-white hebrew-text">
                    {mockDealer.businessName}
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 ml-1" />
                    {mockDealer.verificationLevel}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-300">
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
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <div className="text-lg font-semibold text-blue-400">{mockDealer.vehiclesCount}</div>
                  <div className="text-xs text-gray-300 hebrew-text">רכבים במלאי</div>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <div className="text-lg font-semibold text-blue-400">{mockDealer.joinedDate}</div>
                  <div className="text-xs text-gray-300 hebrew-text">שנת הצטרפות</div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="font-medium text-white hebrew-text mb-2">התמחויות</h4>
                <div className="flex flex-wrap gap-2">
                  {mockDealer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="hebrew-text border-gray-600 text-gray-300">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg border border-green-700">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-white hebrew-text">{mockDealer.lastSeen}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Privacy Notice */}
      <GradientBorderContainer
   
        className="rounded-md"
      >
        <Card className="bg-black border-0">
          <CardContent className="p-4">
            <div className="flex space-x-3 space-x-reverse">
              <Eye className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white hebrew-text mb-1">
                  חשיפת פרטים מוגבלת
                </h4>
                <p className="text-sm text-gray-300 hebrew-text">
                  כדי לשמור על הפרטיות, פרטי הקשר של הסוכן יחשפו רק לאחר אישור הבקשה. 
                  הסוכן יקבל התראה על בקשתך ויוכל לאשר או לדחות אותה.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

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