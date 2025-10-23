import { useState } from "react";
import { Car, Calendar, DollarSign, Clock } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for selected vehicle
const mockVehicle = {
  id: 1,
  title: "BMW X5 2021",
  details: "85,000 ק״ם • אוטומט • היברידי",
  estimatedValue: "320,000 ₪",
  image: "/placeholder.svg"
};

const CreateBidDetailsScreen = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    startingPrice: "",
    reservePrice: "",
    auctionDuration: "",
    description: "",
    auctionType: ""
  });

  const handleBackClick = () => {
    navigate("/mobile/create-bid");
  };

  const handleSubmit = () => {
    if (!formData.startingPrice || !formData.auctionDuration || !formData.auctionType) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות החובה",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "הצעה נשלחה לאישור",
      description: "הצעת המכירה הפומבית נשלחה לבדיקה ואישור המנהל"
    });
    
    navigate("/mobile/auctions");
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <h1 className="text-xl font-semibold text-foreground hebrew-text">פרטי מכירה פומבית</h1>
      </div>

      {/* Selected Vehicle Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base hebrew-text">הרכב שנבחר</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground hebrew-text mb-1">
                {mockVehicle.title}
              </h3>
              <p className="text-sm text-muted-foreground hebrew-text mb-2">
                {mockVehicle.details}
              </p>
              <p className="text-lg font-bold text-primary hebrew-text">
                שווי משוער: {mockVehicle.estimatedValue}
              </p>
            </div>
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <Car className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auction Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">פרטי המכירה הפומבית</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auction Type */}
          <div className="space-y-2">
            <Label className="hebrew-text">סוג מכירה *</Label>
            <Select onValueChange={(value) => updateFormData("auctionType", value)}>
              <SelectTrigger className="hebrew-text">
                <SelectValue placeholder="בחר סוג מכירה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard" className="hebrew-text">מכירה פומבית רגילה</SelectItem>
                <SelectItem value="reserve" className="hebrew-text">מכירה עם מחיר מינימלי</SelectItem>
                <SelectItem value="buy-now" className="hebrew-text">מכירה עם אפשרות קנייה מיידית</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Starting Price */}
          <div className="space-y-2">
            <Label className="hebrew-text">מחיר פתיחה (₪) *</Label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0"
                value={formData.startingPrice}
                onChange={(e) => updateFormData("startingPrice", e.target.value)}
                className="pr-10 hebrew-text"
              />
            </div>
          </div>

          {/* Reserve Price (optional) */}
          {formData.auctionType === "reserve" && (
            <div className="space-y-2">
              <Label className="hebrew-text">מחיר מינימלי (₪)</Label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.reservePrice}
                  onChange={(e) => updateFormData("reservePrice", e.target.value)}
                  className="pr-10 hebrew-text"
                />
              </div>
              <p className="text-xs text-muted-foreground hebrew-text">
                הרכב יימכר רק אם המחיר יעלה על הסכום הזה
              </p>
            </div>
          )}

          {/* Auction Duration */}
          <div className="space-y-2">
            <Label className="hebrew-text">משך המכירה *</Label>
            <Select onValueChange={(value) => updateFormData("auctionDuration", value)}>
              <SelectTrigger className="hebrew-text">
                <SelectValue placeholder="בחר משך זמן" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3" className="hebrew-text">3 ימים</SelectItem>
                <SelectItem value="5" className="hebrew-text">5 ימים</SelectItem>
                <SelectItem value="7" className="hebrew-text">שבוע</SelectItem>
                <SelectItem value="10" className="hebrew-text">10 ימים</SelectItem>
                <SelectItem value="14" className="hebrew-text">שבועיים</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="hebrew-text">תיאור נוסף</Label>
            <Textarea
              placeholder="תאר את מצב הרכב, תוספות מיוחדות, היסטוריה וכל מידע שעשוי לעניין קונים..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              className="hebrew-text"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex space-x-3 space-x-reverse">
            <Clock className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 dark:text-orange-100 hebrew-text mb-2">
                חשוב לדעת
              </h4>
              <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-200 hebrew-text">
                <li>• המכירה הפומבית תתחיל רק לאחר אישור המנהל</li>
                <li>• לא ניתן לבטל מכירה פומבית לאחר תחילתה</li>
                <li>• עמלת הפלטפורמה: 5% ממחיר המכירה הסופי</li>
                <li>• תקבל התראות על הצעות חדשות במהלך המכירה</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="space-y-3">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="w-full hebrew-text"
        >
          שלח לאישור המנהל
        </Button>
        
        <p className="text-xs text-center text-muted-foreground hebrew-text">
          לחיצה על הכפתור תשלח את בקשת המכירה הפומבית לבדיקה ואישור
        </p>
      </div>
    </div>
  );
};

export default CreateBidDetailsScreen;