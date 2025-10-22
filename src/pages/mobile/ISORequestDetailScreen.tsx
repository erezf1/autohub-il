import { useState } from "react";
import { Clock, MapPin, User, CheckCircle, AlertCircle } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for ISO request detail
const mockISORequest = {
  id: 1,
  title: "טויוטה קורולה 2020",
  description: "מחפש רכב משפחתי חסכוני, עד 120,000 ק\"מ, אוטומט, בצבע כהה. רצוי עם מערכת ניווט ופתיחה ללא מפתח.",
  budgetRange: "160,000 - 180,000 ₪",
  location: "תל אביב והמרכז",
  status: "פתוח",
  dateCreated: "לפני שבוע",
  requirements: [
    "שנת ייצור: 2018-2021",
    "קילומטרז': עד 120,000 ק\"מ",
    "תיבת הילוכים: אוטומט",
    "צבע: שחור/כחול כהה/אפור",
    "בעלים קודמים: עד 2"
  ],
  offers: [
    {
      id: 1,
      dealerName: "סוכנות רון הרצוג",
      vehicle: "טויוטה קורולה 2020",
      price: "165,000 ₪",
      mileage: "95,000 ק\"מ",
      status: "ממתין לתגובה",
      submittedAt: "לפני יומיים"
    },
    {
      id: 2,
      dealerName: "אלפא רכב",
      vehicle: "טויוטה קורולה 2019",
      price: "158,000 ₪",
      mileage: "110,000 ק\"מ",
      status: "נדחה",
      submittedAt: "לפני 4 ימים"
    },
    {
      id: 3,
      dealerName: "מוטורס סיטי",
      vehicle: "טויוטה קורולה 2021",
      price: "175,000 ₪",
      mileage: "65,000 ק\"מ",
      status: "התקבל",
      submittedAt: "לפני שבוע"
    }
  ]
};

const ISORequestDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [newOffer, setNewOffer] = useState("");

  const handleBackClick = () => {
    navigate("/mobile/car-search-requests");
  };

  const handleSubmitOffer = () => {
    if (!newOffer.trim()) return;
    
    toast({
      title: "הצעה נשלחה",
      description: "ההצעה שלך נשלחה בהצלחה למבקש"
    });
    setNewOffer("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ממתין לתגובה":
        return "default";
      case "התקבל":
        return "secondary";
      case "נדחה":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center space-x-3 space-x-reverse">
        <div 
          onClick={handleBackClick}
          className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
        >
          <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
        </div>
        <h1 className="text-xl font-semibold text-white hebrew-text">פרטי בקשת חיפוש</h1>
      </div>

      {/* Request Overview */}
      <GradientBorderContainer className="rounded-lg">
        <Card className="bg-black border-0 rounded-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg text-white hebrew-text">{mockISORequest.title}</CardTitle>
                <div className="flex items-center space-x-4 space-x-reverse mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 ml-1" />
                    <span className="hebrew-text">{mockISORequest.dateCreated}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 ml-1" />
                    <span className="hebrew-text">{mockISORequest.location}</span>
                  </div>
                </div>
              </div>
              <Badge variant="default" className="hebrew-text">
                {mockISORequest.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white hebrew-text mb-2">תיאור הבקשה</h4>
                <p className="text-muted-foreground text-sm hebrew-text">{mockISORequest.description}</p>
              </div>
            
              <div>
                <h4 className="font-medium text-white hebrew-text mb-2">תקציב</h4>
                <p className="text-primary font-semibold hebrew-text">{mockISORequest.budgetRange}</p>
              </div>

              <div>
                <h4 className="font-medium text-white hebrew-text mb-2">דרישות</h4>
                <ul className="space-y-1">
                  {mockISORequest.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-muted-foreground hebrew-text flex items-center">
                      <CheckCircle className="h-3 w-3 text-primary ml-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Offers */}
      <GradientBorderContainer className="rounded-lg">
        <Card className="bg-black border-0 rounded-lg">
          <CardHeader>
            <CardTitle className="text-white hebrew-text">הצעות שהתקבלו ({mockISORequest.offers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockISORequest.offers.map((offer) => (
                <GradientBorderContainer key={offer.id} className="rounded-md">
                  <div className="bg-black border-0 rounded-md p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-white hebrew-text">{offer.dealerName}</h5>
                        <p className="text-sm text-muted-foreground hebrew-text">{offer.vehicle}</p>
                      </div>
                      <Badge variant={getStatusColor(offer.status)} className="hebrew-text">
                        {offer.status}
                      </Badge>
                    </div>
                  
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <p className="text-primary font-semibold hebrew-text">{offer.price}</p>
                        <p className="text-muted-foreground hebrew-text">{offer.mileage}</p>
                      </div>
                      <p className="text-muted-foreground hebrew-text">{offer.submittedAt}</p>
                    </div>
                  </div>
                </GradientBorderContainer>
              ))}
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Add Offer Section (if user is a dealer) */}
      <GradientBorderContainer className="rounded-lg">
        <Card className="bg-black border-0 rounded-lg">
          <CardHeader>
            <CardTitle className="text-white hebrew-text">הגש הצעה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <GradientBorderContainer className="rounded-md">
                <Textarea
                  placeholder="כתוב את הצעתך כאן - פרט על הרכב שברשותך, המחיר, הקילומטרז' ופרטים נוספים..."
                  value={newOffer}
                  onChange={(e) => setNewOffer(e.target.value)}
                  className="bg-black border-0 hebrew-text text-right"
                  rows={4}
                  dir="rtl"
                />
              </GradientBorderContainer>
              <GradientBorderContainer className="rounded-md">
                <Button 
                  onClick={handleSubmitOffer}
                  disabled={!newOffer.trim()}
                  className="bg-black border-0 w-full hebrew-text"
                >
                  שלח הצעה
                </Button>
              </GradientBorderContainer>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>
    </div>
  );
};

export default ISORequestDetailScreen;