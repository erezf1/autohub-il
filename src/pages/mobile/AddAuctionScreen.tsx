import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gavel, Calendar, Clock, DollarSign, Car } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Mock user vehicles data
const userVehicles = [
  {
    id: "1",
    title: "טויוטה קמרי 2020",
    year: 2020,
    kilometers: 120000,
    image: "/placeholder.svg"
  },
  {
    id: "2", 
    title: "BMW X3 2019",
    year: 2019,
    kilometers: 85000,
    image: "/placeholder.svg"
  },
  {
    id: "3",
    title: "מרצדס E-Class 2021",
    year: 2021,
    kilometers: 45000,
    image: "/placeholder.svg"
  }
];

const auctionDurations = [
  { value: "1", label: "יום אחד" },
  { value: "3", label: "3 ימים" },
  { value: "5", label: "5 ימים" },
  { value: "7", label: "שבוע" },
  { value: "10", label: "10 ימים" },
  { value: "14", label: "שבועיים" }
];

interface AuctionForm {
  vehicleId: string;
  startingPrice: string;
  reservePrice: string;
  duration: string;
  startTime: string;
  startDate: string;
  description: string;
  terms: string[];
  isPrivate: boolean;
  allowInspection: boolean;
}

const AddAuctionScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AuctionForm>({
    vehicleId: "",
    startingPrice: "",
    reservePrice: "",
    duration: "",
    startTime: "",
    startDate: "",
    description: "",
    terms: [],
    isPrivate: false,
    allowInspection: true
  });

  const selectedVehicle = userVehicles.find(v => v.id === formData.vehicleId);

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/mobile/bids");
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // In real app, submit to API
    console.log("Creating auction:", formData);
    toast({
      title: "המכירה הפומבית נוצרה בהצלחה!",
      description: "המכירה הפומבית שלך פעילה ומוכנה לקבלת הצעות.",
    });
    navigate("/mobile/auctions");
  };

  const updateFormData = (field: keyof AuctionForm, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.vehicleId;
      case 2:
        return formData.startingPrice && formData.duration && formData.startDate && formData.startTime;
      case 3:
        return formData.description;
      default:
        return false;
    }
  };

  // Set default start time and date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];
  const defaultTime = "10:00";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div 
            onClick={handleBackClick}
            className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
          >
            <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
          </div>
          <h1 className="text-xl font-bold text-foreground hebrew-text">
            יצירת מכירה פומבית
          </h1>
        </div>
        <Badge variant="outline" className="hebrew-text">
          שלב {currentStep} מתוך 3
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      {/* Step 1: Vehicle Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse hebrew-text">
              <Car className="h-5 w-5" />
              <span>בחירת רכב למכירה</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground hebrew-text">
              בחר את הרכב שברצונך למכור במכירה פומבית
            </p>
            
            <div className="space-y-3">
              {userVehicles.map((vehicle) => (
                <div 
                  key={vehicle.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.vehicleId === vehicle.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => updateFormData("vehicleId", vehicle.id)}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Car className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground hebrew-text">
                        {vehicle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.year} • {vehicle.kilometers.toLocaleString()} ק״מ
                      </p>
                    </div>
                    {formData.vehicleId === vehicle.id && (
                      <Badge variant="default">נבחר</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {userVehicles.length === 0 && (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground hebrew-text mb-4">
                  אין לך רכבים רשומים במערכת
                </p>
                <Button onClick={() => navigate("/mobile/add-vehicle")}>
                  הוסף רכב חדש
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Auction Settings */}
      {currentStep === 2 && (
        <div className="space-y-4">
          {/* Selected Vehicle Summary */}
          {selectedVehicle && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground hebrew-text">
                      {selectedVehicle.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">הרכב הנבחר למכירה</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse hebrew-text">
                <DollarSign className="h-5 w-5" />
                <span>הגדרות מחיר</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="hebrew-text">מחיר פתיחה (₪) *</Label>
                <Input
                  type="number"
                  placeholder="500000"
                  value={formData.startingPrice}
                  onChange={(e) => updateFormData("startingPrice", e.target.value)}
                />
                <p className="text-xs text-muted-foreground hebrew-text mt-1">
                  המחיר הנמוך ביותר שממנו תתחיל המכירה
                </p>
              </div>

              <div>
                <Label className="hebrew-text">מחיר שמירה (₪)</Label>
                <Input
                  type="number"
                  placeholder="700000"
                  value={formData.reservePrice}
                  onChange={(e) => updateFormData("reservePrice", e.target.value)}
                />
                <p className="text-xs text-muted-foreground hebrew-text mt-1">
                  המחיר המינימלי שתקבל עבור הרכב (אופציונלי)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse hebrew-text">
                <Clock className="h-5 w-5" />
                <span>תזמון המכירה</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="hebrew-text">תאריך התחלה *</Label>
                  <Input
                    type="date"
                    value={formData.startDate || defaultDate}
                    onChange={(e) => updateFormData("startDate", e.target.value)}
                    min={defaultDate}
                  />
                </div>
                <div>
                  <Label className="hebrew-text">שעת התחלה *</Label>
                  <Input
                    type="time"
                    value={formData.startTime || defaultTime}
                    onChange={(e) => updateFormData("startTime", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="hebrew-text">משך המכירה *</Label>
                <Select onValueChange={(value) => updateFormData("duration", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר משך זמן" />
                  </SelectTrigger>
                  <SelectContent>
                    {auctionDurations.map(duration => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Additional Settings */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">תיאור המכירה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="hebrew-text">תיאור נוסף *</Label>
                <Textarea
                  placeholder="תאר את הרכב, מצבו, סיבת המכירה וכל מידע רלוונטי לרוכשים..."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  className="hebrew-text min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">הגדרות נוספות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="allowInspection"
                  checked={formData.allowInspection}
                  onCheckedChange={(checked) => updateFormData("allowInspection", !!checked)}
                />
                <Label htmlFor="allowInspection" className="hebrew-text">
                  אפשר בדיקת רכב לפני המכירה
                </Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => updateFormData("isPrivate", !!checked)}
                />
                <Label htmlFor="isPrivate" className="hebrew-text">
                  מכירה פרטית (רק למוזמנים)
                </Label>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground hebrew-text mb-2">תנאי המכירה</h4>
                <ul className="text-sm text-muted-foreground hebrew-text space-y-1">
                  <li>• התשלום יבוצע תוך 7 ימי עסקים מסיום המכירה</li>
                  <li>• איסוף הרכב תוך 14 ימים מהתשלום</li>
                  <li>• עמלת פלטפורמה: 3% ממחיר המכירה</li>
                  <li>• המוכר אחראי לכל הטיפולים הנדרשים לפני המסירה</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handleBackClick}
          className="hebrew-text"
        >
          {currentStep > 1 ? "חזור" : "ביטול"}
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!canProceed()}
          className="hebrew-text"
        >
          {currentStep < 3 ? "המשך" : "צור מכירה פומבית"}
        </Button>
      </div>
    </div>
  );
};

export default AddAuctionScreen;