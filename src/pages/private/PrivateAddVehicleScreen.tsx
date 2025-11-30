import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Car, Plus, X } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientSeparator } from "@/components/ui/gradient-separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { privateClient } from "@/integrations/supabase/privateClient";
import { useToast } from "@/hooks/use-toast";
import { VEHICLE_TYPES } from "@/constants/vehicleTypes";

const fuelTypes = [
  { value: "gasoline", label: "בנזין" },
  { value: "diesel", label: "דיזל" },
  { value: "hybrid", label: "היברידי" },
  { value: "electric", label: "חשמלי" }
];

const transmissions = [
  { value: "manual", label: "ידנית" },
  { value: "automatic", label: "אוטומט" },
  { value: "semi_automatic", label: "טיפטרוניק" }
];

const colors = ["לבן", "שחור", "כסוף", "אפור", "כחול", "אדום", "ירוק", "חום"];

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
  vehicleType: string;
}

export default function PrivateAddVehicleScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMakeId, setSelectedMakeId] = useState<number | undefined>();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<VehicleForm>({
    brand: "",
    model: "",
    year: "",
    kilometers: "",
    price: "",
    fuelType: "",
    transmission: "",
    engineSize: "1600",
    color: "",
    previousOwners: "1",
    description: "",
    vehicleType: "",
  });

  // Fetch makes on mount
  useEffect(() => {
    const fetchMakes = async () => {
      const { data } = await privateClient
        .from('vehicle_makes')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');
      if (data) setMakes(data);
    };
    fetchMakes();
  }, []);

  // Fetch models when make is selected
  const handleMakeChange = async (makeId: string) => {
    setSelectedMakeId(parseInt(makeId));
    updateFormData("brand", makeId);
    updateFormData("model", "");
    
    const { data } = await privateClient
      .from('vehicle_models')
      .select('*')
      .eq('make_id', parseInt(makeId))
      .eq('is_active', true)
      .order('name_hebrew');
    if (data) setModels(data);
    
    if (fieldErrors.brand) {
      setFieldErrors({ ...fieldErrors, brand: "" });
    }
  };

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/private/dashboard");
    }
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.brand) errors.brand = "יצרן הוא שדה חובה";
        if (!formData.model) errors.model = "דגם הוא שדה חובה";
        if (!formData.year) {
          errors.year = "שנת ייצור היא שדה חובה";
        } else {
          const year = parseInt(formData.year);
          if (year < 1990 || year > 2025) {
            errors.year = "שנת ייצור חייבת להיות בין 1990 ל-2025";
          }
        }
        break;
      case 2:
        if (!formData.kilometers) errors.kilometers = "קילומטרז׳ הוא שדה חובה";
        break;
      case 3:
        if (!formData.price) errors.price = "מחיר הוא שדה חובה";
        break;
      case 4:
        // Description is optional
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast({
        title: 'שגיאה בטופס',
        description: 'אנא תקן את השגיאות לפני המעבר לשלב הבא',
        variant: 'destructive',
      });
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setFieldErrors({});
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!selectedMakeId || !formData.model) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await privateClient.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const vehicleData = {
        make_id: selectedMakeId,
        model_id: parseInt(formData.model),
        year: parseInt(formData.year),
        kilometers: parseInt(formData.kilometers),
        transmission: formData.transmission || null,
        fuel_type: formData.fuelType || null,
        engine_size: formData.engineSize ? parseFloat(formData.engineSize) : null,
        color: formData.color,
        price: parseFloat(formData.price),
        description: formData.description || null,
        previous_owners: formData.previousOwners ? parseInt(formData.previousOwners) : 1,
        images: uploadedImages.length > 0 ? uploadedImages : null,
        sub_model: formData.vehicleType || null,
        private_user_id: user.id,
        is_private_listing: true,
        status: 'available',
      };

      const { error } = await privateClient
        .from('vehicle_listings')
        .insert(vehicleData);

      if (error) throw error;

      toast({ 
        title: 'הרכב נוסף בהצלחה',
        description: 'הרכב שלך נוסף למערכת'
      });
      navigate("/private/dashboard");
    } catch (error: any) {
      toast({
        title: 'שגיאה',
        description: error?.message || 'אירעה שגיאה בהוספת הרכב',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      const { data: { user } } = await privateClient.auth.getUser();
      if (!user) {
        toast({
          title: 'שגיאה',
          description: 'נדרש להיות מחובר להעלות תמונות',
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }

      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'קובץ גדול מדי',
            description: `${file.name} גדול מ-5MB`,
            variant: 'destructive',
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await privateClient.storage
          .from('vehicle-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = privateClient.storage
          .from('vehicle-images')
          .getPublicUrl(fileName);

        newImageUrls.push(publicUrl);
      }

      setUploadedImages([...uploadedImages, ...newImageUrls]);
      toast({ title: 'התמונות הועלו בהצלחה' });
    } catch (error: any) {
      toast({
        title: 'שגיאה בהעלאת תמונות',
        description: error?.message || 'אירעה שגיאה בהעלאת התמונות',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setUploadedImages(uploadedImages.filter(img => img !== url));
  };

  const updateFormData = (field: keyof VehicleForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <div className="container max-w-md mx-auto px-4 space-y-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              onClick={handleBackClick}
              className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
            >
              <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              הוספת רכב למכירה
            </h1>
          </div>
          <Badge variant="outline">
            שלב {currentStep} מתוך 4
          </Badge>
        </div>

        {/* Progress Bar */}
        <GradientBorderContainer className="rounded-sm flex-1">
          <div className="w-full bg-black rounded-md p-1">
            <div 
              className="bg-gradient-to-r from-[#2277ee] to-[#5be1fd] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </GradientBorderContainer>

        {/* Step 1: Basic Vehicle Info */}
        {currentStep === 1 && (
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-white">
                  <Car className="h-5 w-5" />
                  <span>פרטי הרכב הבסיסיים</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">יצרן הרכב *</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Select 
                      value={formData.brand}
                      onValueChange={handleMakeChange}
                    >
                      <SelectTrigger className={`bg-black border-0 ${fieldErrors.brand ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="בחר יצרן" />
                      </SelectTrigger>
                      <SelectContent>
                        {makes?.map(make => (
                          <SelectItem key={make.id} value={make.id.toString()}>{make.name_hebrew}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GradientBorderContainer>
                  {fieldErrors.brand && (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.brand}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white">דגם *</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Select 
                      value={formData.model}
                      onValueChange={(value) => {
                        updateFormData("model", value);
                        if (fieldErrors.model) {
                          setFieldErrors({ ...fieldErrors, model: "" });
                        }
                      }}
                      disabled={!selectedMakeId}
                    >
                      <SelectTrigger className={`bg-black border-0 ${fieldErrors.model ? "border-destructive" : ""}`}>
                        <SelectValue placeholder={selectedMakeId ? "בחר דגם" : "בחר תחילה יצרן"} />
                      </SelectTrigger>
                      <SelectContent>
                        {models?.map(model => (
                          <SelectItem key={model.id} value={model.id.toString()}>{model.name_hebrew}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GradientBorderContainer>
                  {fieldErrors.model && (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.model}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white">שנת ייצור *</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="2020"
                      value={formData.year}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        updateFormData("year", value);
                        if (fieldErrors.year) {
                          setFieldErrors({ ...fieldErrors, year: "" });
                        }
                      }}
                      className={`bg-black border-0 text-right ${fieldErrors.year ? "border-destructive" : ""}`}
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                  {fieldErrors.year && (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.year}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white">סוג</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Select value={formData.vehicleType} onValueChange={(value) => updateFormData("vehicleType", value)}>
                      <SelectTrigger className="bg-black border-0">
                        <SelectValue placeholder="בחר סוג רכב" />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GradientBorderContainer>
                </div>

                <div>
                  <Label className="text-white">צבע</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Select value={formData.color} onValueChange={(value) => updateFormData("color", value)}>
                      <SelectTrigger className="bg-black border-0">
                        <SelectValue placeholder="בחר צבע" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GradientBorderContainer>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        )}

        {/* Step 2: Technical Details */}
        {currentStep === 2 && (
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-white">מפרט טכני</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">קילומטרז׳ *</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="100000"
                      value={formData.kilometers}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        updateFormData("kilometers", value);
                        if (fieldErrors.kilometers) {
                          setFieldErrors({ ...fieldErrors, kilometers: "" });
                        }
                      }}
                      className={`bg-black border-0 text-right ${fieldErrors.kilometers ? "border-destructive" : ""}`}
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                  {fieldErrors.kilometers && (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.kilometers}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white">תיבת הילוכים</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Select value={formData.transmission} onValueChange={(value) => updateFormData("transmission", value)}>
                      <SelectTrigger className="bg-black border-0">
                        <SelectValue placeholder="בחר סוג תיבה" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map(trans => (
                          <SelectItem key={trans.value} value={trans.value}>{trans.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GradientBorderContainer>
                </div>

                <div>
                  <Label className="text-white">סוג דלק</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Select value={formData.fuelType} onValueChange={(value) => updateFormData("fuelType", value)}>
                      <SelectTrigger className="bg-black border-0">
                        <SelectValue placeholder="בחר סוג דלק" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map(fuel => (
                          <SelectItem key={fuel.value} value={fuel.value}>{fuel.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GradientBorderContainer>
                </div>

                <div>
                  <Label className="text-white">נפח מנוע (סמ״ק)</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="1600"
                      value={formData.engineSize}
                      onChange={(e) => updateFormData("engineSize", e.target.value.replace(/[^0-9]/g, ''))}
                      className="bg-black border-0 text-right"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                </div>

                <div>
                  <Label className="text-white">בעלים קודמים</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="1"
                      value={formData.previousOwners}
                      onChange={(e) => updateFormData("previousOwners", e.target.value.replace(/[^0-9]/g, ''))}
                      className="bg-black border-0 text-right"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        )}

        {/* Step 3: Price */}
        {currentStep === 3 && (
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-white">מחיר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">מחיר מבוקש *</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="100000"
                      value={formData.price}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        updateFormData("price", value);
                        if (fieldErrors.price) {
                          setFieldErrors({ ...fieldErrors, price: "" });
                        }
                      }}
                      className={`bg-black border-0 text-right ${fieldErrors.price ? "border-destructive" : ""}`}
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                  {fieldErrors.price && (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.price}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        )}

        {/* Step 4: Description & Images */}
        {currentStep === 4 && (
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-white">תיאור ותמונות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">תיאור (אופציונלי)</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Textarea
                      placeholder="תאר את הרכב..."
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      className="bg-black border-0 text-right min-h-[100px]"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                </div>

                <div>
                  <Label className="text-white">תמונות</Label>
                  <GradientBorderContainer className="rounded-md">
                    <div className="bg-black border-0 rounded-md p-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center cursor-pointer py-8 border-2 border-dashed border-border rounded-md hover:border-primary transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {uploading ? "מעלה..." : "לחץ להעלאת תמונות"}
                        </p>
                      </label>

                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          {uploadedImages.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`תמונה ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md"
                              />
                              <button
                                onClick={() => removeImage(url)}
                                className="absolute top-1 left-1 bg-destructive text-destructive-foreground rounded-full p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </GradientBorderContainer>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="flex-1"
            disabled={isSubmitting}
          >
            {currentStep === 1 ? "ביטול" : "חזור"}
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={isSubmitting}
          >
            {currentStep === 4 ? (isSubmitting ? "שומר..." : "סיום") : "הבא"}
          </Button>
        </div>
      </div>
    </div>
  );
}
