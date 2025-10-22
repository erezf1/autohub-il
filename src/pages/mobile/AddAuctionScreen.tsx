import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gavel, Calendar, Clock, DollarSign, Car, ChevronLeft } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";
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
    <div className="container max-w-md mx-auto px-4 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            onClick={handleBackClick}
            className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
          >
            <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
          </div>
          <h1 className="text-2xl font-bold text-foreground hebrew-text">
            יצירת מכירה פומבית
          </h1>
        </div>
        <Badge variant="outline" className="hebrew-text">
          שלב {currentStep} מתוך 3
        </Badge>
      </div>

      {/* Progress Bar */}
      <GradientBorderContainer className="rounded-md">
        <div className="w-full bg-black rounded-md p-1">
          <div 
            className="bg-gradient-to-r from-[#2277ee] to-[#5be1fd] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </GradientBorderContainer>

      {/* Step 1: Vehicle Selection */}
      {currentStep === 1 && (
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-white hebrew-text">
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
                <GradientBorderContainer className="rounded-md">
                  <Button onClick={() => navigate("/mobile/add-vehicle")} className="bg-black border-0">
                    הוסף רכב חדש
                  </Button>
                </GradientBorderContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </GradientBorderContainer>
      )}

      {/* Step 2: Auction Settings */}
      {currentStep === 2 && (
        <>
          {/* Selected Vehicle Summary */}
          {selectedVehicle && (
            <GradientBorderContainer className="rounded-md">
              <Card className="bg-black border-0 rounded-md">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Car className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white hebrew-text">
                        {selectedVehicle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">הרכב הנבחר למכירה</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GradientBorderContainer>
          )}

          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-white hebrew-text">
                  <DollarSign className="h-5 w-5" />
                  <span>הגדרות מחיר</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white hebrew-text">מחיר פתיחה (₪) *</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      type="number"
                      placeholder="500000"
                      value={formData.startingPrice}
                      onChange={(e) => updateFormData("startingPrice", e.target.value)}
                      className="bg-black border-0 text-right hebrew-text"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                  <p className="text-xs text-muted-foreground hebrew-text mt-1">
                    המחיר הנמוך ביותר שממנו תתחיל המכירה
                  </p>
                </div>

                <GradientSeparator />

                <div>
                  <Label className="text-white hebrew-text">מחיר שמירה (₪)</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      type="number"
                      placeholder="700000"
                      value={formData.reservePrice}
                      onChange={(e) => updateFormData("reservePrice", e.target.value)}
                      className="bg-black border-0 text-right hebrew-text"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                  <p className="text-xs text-muted-foreground hebrew-text mt-1">
                    המחיר המינימלי שתקבל עבור הרכב (אופציונלי)
                  </p>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>

          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-white hebrew-text">
                  <Clock className="h-5 w-5" />
                  <span>תזמון המכירה</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white hebrew-text">תאריך התחלה *</Label>
                    <GradientBorderContainer className="rounded-md">
                      <Input
                        type="date"
                        value={formData.startDate || defaultDate}
                        onChange={(e) => updateFormData("startDate", e.target.value)}
                        min={defaultDate}
                        className="bg-black border-0 text-center hebrew-text"
                      />
                    </GradientBorderContainer>
                  </div>
                  <div>
                    <Label className="text-white hebrew-text">שעת התחלה *</Label>
                    <GradientBorderContainer className="rounded-md">
                      <Input
                        type="time"
                        value={formData.startTime || defaultTime}
                        onChange={(e) => updateFormData("startTime", e.target.value)}
                        className="bg-black border-0 text-center hebrew-text"
                      />
                    </GradientBorderContainer>
                  </div>
                </div>

                <GradientSeparator />

                <div>
                  <Label className="text-white hebrew-text">משך המכירה *</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Select onValueChange={(value) => updateFormData("duration", value)}>
                      <SelectTrigger className="bg-black border-0">
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
                  </GradientBorderContainer>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </>
      )}

      {/* Step 3: Additional Settings */}
      {currentStep === 3 && (
        <>
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-white hebrew-text">תיאור המכירה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white hebrew-text">תיאור נוסף *</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Textarea
                      placeholder="תאר את הרכב, מצבו, סיבת המכירה וכל מידע רלוונטי לרוכשים..."
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      className="bg-black border-0 text-right hebrew-text min-h-[120px]"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>

          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-white hebrew-text">הגדרות נוספות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="allowInspection"
                    checked={formData.allowInspection}
                    onCheckedChange={(checked) => updateFormData("allowInspection", !!checked)}
                  />
                  <Label htmlFor="allowInspection" className="text-white hebrew-text">
                    אפשר בדיקת רכב לפני המכירה
                  </Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => updateFormData("isPrivate", !!checked)}
                  />
                  <Label htmlFor="isPrivate" className="text-white hebrew-text">
                    מכירה פרטית (רק למוזמנים)
                  </Label>
                </div>

                <GradientSeparator />

                <div className="p-4 bg-muted/10 rounded-lg">
                  <h4 className="font-semibold text-white hebrew-text mb-2">תנאי המכירה</h4>
                  <ul className="text-sm text-muted-foreground hebrew-text space-y-1">
                    <li>• התשלום יבוצע תוך 7 ימי עסקים מסיום המכירה</li>
                    <li>• איסוף הרכב תוך 14 ימים מהתשלום</li>
                    <li>• עמלת פלטפורמה: 3% ממחיר המכירה</li>
                    <li>• המוכר אחראי לכל הטיפולים הנדרשים לפני המסירה</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        {currentStep > 1 && (
          <GradientBorderContainer className="rounded-md">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="bg-black border-0 hebrew-text"
            >
              חזור
            </Button>
          </GradientBorderContainer>
        )}
        <GradientBorderContainer className="rounded-md flex-1">
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-black border-0 w-full hebrew-text"
          >
            {currentStep < 3 ? 'המשך' : 'צור מכירה פומבית'}
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Button>
        </GradientBorderContainer>
      </div>
    </div>
  );
};

export default AddAuctionScreen;