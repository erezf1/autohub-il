import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload, Car, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data for form options
const vehicleBrands = [
  "טויוטה", "מזדה", "יונדאי", "קיה", "נישן", "הונדה", "מיצובישי", 
  "סובארו", "BMW", "מרצדס", "אאודי", "פולקסווגן", "סקודה", "פורד"
];

const fuelTypes = ["בנזין", "דיזל", "היברידי", "חשמלי", "גז"];
const transmissions = ["ידנית", "אוטומט", "טיפטרוניק"];
const colors = ["לבן", "שחור", "כסוף", "אפור", "כחול", "אדום", "ירוק", "חום"];

const availableFeatures = [
  "מערכת ניווט", "מצלמת רוורס", "חישני חניה", "בקרת שיוט",
  "מזגן אוטומטי", "חלונות חשמליים", "גג נפתח", "מושבי עור",
  "מערכת שמע מתקדמת", "מנעולי ילדים", "כרית אוויר", "ABS"
];

interface VehicleForm {
  brand: string;
  model: string;
  year: string;
  kilometers: string;
  price: string;
  fuelType: string;
  transmission: string;
  engineSize: string;
  color: string;
  previousOwners: string;
  description: string;
  features: string[];
  condition: string;
}

const AddVehicleScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VehicleForm>({
    brand: "",
    model: "",
    year: "",
    kilometers: "",
    price: "",
    fuelType: "",
    transmission: "",
    engineSize: "",
    color: "",
    previousOwners: "",
    description: "",
    features: [],
    condition: ""
  });

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/mobile");
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // In real app, submit to API
    console.log("Submitting vehicle:", formData);
    toast({
      title: "הרכב נוסף בהצלחה!",
      description: "הרכב שלך פורסם ויופיע ברשימת החיפוש.",
    });
    navigate("/mobile");
  };

  const updateFormData = (field: keyof VehicleForm, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = formData.features;
    if (currentFeatures.includes(feature)) {
      updateFormData("features", currentFeatures.filter(f => f !== feature));
    } else {
      updateFormData("features", [...currentFeatures, feature]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.brand && formData.model && formData.year;
      case 2:
        return formData.kilometers && formData.fuelType && formData.transmission;
      case 3:
        return formData.price && formData.condition;
      case 4:
        return formData.description;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground hebrew-text">
            הוספת רכב חדש
          </h1>
        </div>
        <Badge variant="outline" className="hebrew-text">
          שלב {currentStep} מתוך 4
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Step 1: Basic Vehicle Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse hebrew-text">
              <Car className="h-5 w-5" />
              <span>פרטי הרכב הבסיסיים</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="hebrew-text">יצרן הרכב *</Label>
              <Select onValueChange={(value) => updateFormData("brand", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר יצרן" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="hebrew-text">דגם *</Label>
              <Input
                placeholder="לדוגמה: קמרי, אקורד, גולף"
                value={formData.model}
                onChange={(e) => updateFormData("model", e.target.value)}
                className="hebrew-text"
              />
            </div>

            <div>
              <Label className="hebrew-text">שנת ייצור *</Label>
              <Input
                type="number"
                placeholder="2020"
                value={formData.year}
                onChange={(e) => updateFormData("year", e.target.value)}
                min="1990"
                max="2024"
              />
            </div>

            <div>
              <Label className="hebrew-text">צבע</Label>
              <Select onValueChange={(value) => updateFormData("color", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר צבע" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map(color => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Technical Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">מפרט טכני</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="hebrew-text">קילומטרז׳ *</Label>
              <Input
                type="number"
                placeholder="120000"
                value={formData.kilometers}
                onChange={(e) => updateFormData("kilometers", e.target.value)}
              />
            </div>

            <div>
              <Label className="hebrew-text">סוג דלק *</Label>
              <Select onValueChange={(value) => updateFormData("fuelType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג דלק" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map(fuel => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="hebrew-text">תיבת הילוכים *</Label>
              <Select onValueChange={(value) => updateFormData("transmission", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תיבת הילוכים" />
                </SelectTrigger>
                <SelectContent>
                  {transmissions.map(trans => (
                    <SelectItem key={trans} value={trans}>{trans}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="hebrew-text">נפח מנוע</Label>
              <Input
                placeholder="2.5L"
                value={formData.engineSize}
                onChange={(e) => updateFormData("engineSize", e.target.value)}
              />
            </div>

            <div>
              <Label className="hebrew-text">מספר בעלים קודמים</Label>
              <Input
                type="number"
                placeholder="1"
                value={formData.previousOwners}
                onChange={(e) => updateFormData("previousOwners", e.target.value)}
                min="0"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Price and Condition */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">מחיר ומצב</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="hebrew-text">מחיר מבוקש (₪) *</Label>
              <Input
                type="number"
                placeholder="285000"
                value={formData.price}
                onChange={(e) => updateFormData("price", e.target.value)}
              />
            </div>

            <div>
              <Label className="hebrew-text">מצב הרכב *</Label>
              <Select onValueChange={(value) => updateFormData("condition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מצב הרכב" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">מעולה</SelectItem>
                  <SelectItem value="very-good">טוב מאוד</SelectItem>
                  <SelectItem value="good">טוב</SelectItem>
                  <SelectItem value="fair">סביר</SelectItem>
                  <SelectItem value="needs-work">דורש עבודה</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="hebrew-text">אביזרים ותוספות</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableFeatures.map(feature => (
                  <div key={feature} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm hebrew-text">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
              
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.features.map(feature => (
                    <Badge key={feature} variant="secondary" className="text-xs hebrew-text">
                      {feature}
                      <X 
                        className="h-3 w-3 mr-1 cursor-pointer"
                        onClick={() => toggleFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Description and Images */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">תיאור ותמונות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="hebrew-text">תיאור הרכב *</Label>
              <Textarea
                placeholder="תאר את הרכב, מצבו, היסטוריית הטיפולים וכל מידע רלוונטי..."
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="hebrew-text min-h-[120px]"
              />
            </div>

            <div>
              <Label className="hebrew-text">תמונות הרכב</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground hebrew-text mb-2">
                  גרור תמונות לכאן או לחץ לבחירת קבצים
                </p>
                <p className="text-sm text-muted-foreground hebrew-text">
                  מקסימום 10 תמונות, עד 5MB כל תמונה
                </p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hebrew-text">בחר תמונות</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
          {currentStep < 4 ? "המשך" : "פרסם רכב"}
        </Button>
      </div>
    </div>
  );
};

export default AddVehicleScreen;