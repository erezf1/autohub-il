import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Car, Plus, X, ChevronLeft, Minus } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientSeparator } from "@/components/ui/gradient-separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useVehicles, useVehicleMakes, useVehicleModels, useVehicleTags } from "@/hooks/mobile/useVehicles";
import { dealerClient } from "@/integrations/supabase/dealerClient";
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
  condition: string;
  vehicleType: string;
  hadSevereCrash: boolean;
  testResultFileUrl: string;
}

const AddVehicleScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMakeId, setSelectedMakeId] = useState<number | undefined>();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [uploadingTestFile, setUploadingTestFile] = useState(false);
  
  const { data: makes } = useVehicleMakes();
  const { data: models } = useVehicleModels(selectedMakeId);
  const { data: availableTags } = useVehicleTags();
  const { addVehicle, isAddingVehicle } = useVehicles();
  const { toast } = useToast();
  
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
    condition: "",
    vehicleType: "",
    hadSevereCrash: false,
    testResultFileUrl: ""
  });

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/mobile/my-vehicles");
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
        if (!formData.condition) errors.condition = "מצב הרכב הוא שדה חובה";
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
      description: formData.description,
      previous_owners: formData.previousOwners ? parseInt(formData.previousOwners) : 1,
      images: uploadedImages.length > 0 ? uploadedImages : null,
      sub_model: formData.vehicleType || null,
      had_severe_crash: formData.hadSevereCrash,
      test_result_file_url: formData.testResultFileUrl || null,
    };

    addVehicle(vehicleData, {
      onSuccess: async (newVehicle: any) => {
        // Save tags if any selected
        if (selectedTagIds.length > 0 && newVehicle?.id) {
          try {
            await dealerClient
              .from('vehicle_listing_tags')
              .insert(
                selectedTagIds.map(tagId => ({
                  vehicle_id: newVehicle.id,
                  tag_id: tagId
                }))
              );
          } catch (error) {
            console.error('Error saving tags:', error);
          }
        }
        navigate("/mobile/dashboard");
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      const { data: { user } } = await dealerClient.auth.getUser();
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

        const { error: uploadError } = await dealerClient.storage
          .from('vehicle-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = dealerClient.storage
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

  const updateFormData = (field: keyof VehicleForm, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTestFile(true);
    try {
      const { data: { user } } = await dealerClient.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'קובץ גדול מדי',
          description: 'הקובץ חייב להיות קטן מ-10MB',
          variant: 'destructive',
        });
        setUploadingTestFile(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/test-results/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await dealerClient.storage
        .from('vehicle-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = dealerClient.storage
        .from('vehicle-images')
        .getPublicUrl(fileName);

      updateFormData("testResultFileUrl", publicUrl);
      toast({ title: 'הקובץ הועלה בהצלחה' });
    } catch (error: any) {
      toast({
        title: 'שגיאה בהעלאת הקובץ',
        description: error?.message || 'אירעה שגיאה',
        variant: 'destructive',
      });
    } finally {
      setUploadingTestFile(false);
    }
  };

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
            הוספת רכב חדש
          </h1>
        </div>
        <Badge variant="outline" className="hebrew-text">
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
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-white hebrew-text">
                <Car className="h-5 w-5" />
                <span>פרטי הרכב הבסיסיים</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white hebrew-text">יצרן הרכב *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select 
                    value={formData.brand}
                    onValueChange={(value) => {
                      setSelectedMakeId(parseInt(value));
                      updateFormData("brand", value);
                      updateFormData("model", "");
                      if (fieldErrors.brand) {
                        setFieldErrors({ ...fieldErrors, brand: "" });
                      }
                    }}
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
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.brand}</p>
                )}
              </div>

              <div>
                <Label className="text-white hebrew-text">דגם *</Label>
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
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.model}</p>
                )}
              </div>

              <div>
                <Label className="text-white hebrew-text">שנת ייצור *</Label>
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
                    className={`bg-black border-0 text-right hebrew-text ${fieldErrors.year ? "border-destructive" : ""}`}
                    dir="rtl"
                  />
                </GradientBorderContainer>
                {fieldErrors.year && (
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.year}</p>
                )}
              </div>

              <div>
                <Label className="text-white hebrew-text">סוג</Label>
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
                <Label className="text-white hebrew-text">צבע</Label>
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
              <CardTitle className="text-white hebrew-text">מפרט טכני</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white hebrew-text">קילומטרז׳ *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="120000"
                    value={formData.kilometers}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateFormData("kilometers", value);
                      if (fieldErrors.kilometers) {
                        setFieldErrors({ ...fieldErrors, kilometers: "" });
                      }
                    }}
                    className={`bg-black border-0 text-right hebrew-text ${fieldErrors.kilometers ? "border-destructive" : ""}`}
                    dir="rtl"
                  />
                </GradientBorderContainer>
                {fieldErrors.kilometers && (
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.kilometers}</p>
                )}
              </div>

              <div>
                <Label className="text-white hebrew-text">סוג דלק (אופציונלי)</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select 
                    value={formData.fuelType}
                    onValueChange={(value) => updateFormData("fuelType", value)}
                  >
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
                <Label className="text-white hebrew-text">תיבת הילוכים (אופציונלי)</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select 
                    value={formData.transmission}
                    onValueChange={(value) => updateFormData("transmission", value)}
                  >
                    <SelectTrigger className="bg-black border-0">
                      <SelectValue placeholder="בחר תיבת הילוכים" />
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
                <Label className="text-white hebrew-text">נפח מנוע (סמ"ק)</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="1600 סמ״ק"
                    value={formData.engineSize}
                    onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    updateFormData("engineSize", value);
                  }}
                  className="bg-black border-0 text-right hebrew-text"
                  dir="rtl"
                  />
                </GradientBorderContainer>
              </div>

              <GradientSeparator />

              <div>
                <Label className="text-white hebrew-text">מספר בעלים קודמים</Label>
                <div className="flex items-center gap-2">
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = parseInt(formData.previousOwners) || 1;
                        updateFormData("previousOwners", Math.max(0, current - 1).toString());
                      }}
                      className="bg-black border-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                  <GradientBorderContainer className="rounded-md flex-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="1"
                      value={formData.previousOwners}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        updateFormData("previousOwners", value || "1");
                      }}
                      className="bg-black border-0 text-center hebrew-text"
                    />
                  </GradientBorderContainer>
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = parseInt(formData.previousOwners) || 1;
                        updateFormData("previousOwners", (current + 1).toString());
                      }}
                      className="bg-black border-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                </div>
              </div>
            </CardContent>
        </Card>
      </GradientBorderContainer>
      )}

      {/* Step 3: Price and Condition */}
      {currentStep === 3 && (
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">מחיר ומצב</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white hebrew-text">מחיר מבוקש (₪) *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="50000"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateFormData("price", value);
                      if (fieldErrors.price) {
                        setFieldErrors({ ...fieldErrors, price: "" });
                      }
                    }}
                    className={`bg-black border-0 text-right hebrew-text ${fieldErrors.price ? "border-destructive" : ""}`}
                    dir="rtl"
                  />
                </GradientBorderContainer>
                {fieldErrors.price && (
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.price}</p>
                )}
              </div>

              <div>
                <Label className="text-white hebrew-text">מצב הרכב *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select 
                    value={formData.condition}
                    onValueChange={(value) => {
                      updateFormData("condition", value);
                      if (fieldErrors.condition) {
                        setFieldErrors({ ...fieldErrors, condition: "" });
                      }
                    }}
                  >
                    <SelectTrigger className={`bg-black border-0 ${fieldErrors.condition ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="בחר מצב" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">מצוין</SelectItem>
                      <SelectItem value="very_good">טוב מאוד</SelectItem>
                      <SelectItem value="good">טוב</SelectItem>
                      <SelectItem value="fair">סביר</SelectItem>
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
                {fieldErrors.condition && (
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.condition}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse pt-2">
                <Checkbox 
                  id="hadSevereCrash"
                  checked={formData.hadSevereCrash}
                  onCheckedChange={(checked) => updateFormData("hadSevereCrash", checked as boolean)}
                />
                <Label htmlFor="hadSevereCrash" className="text-white hebrew-text cursor-pointer">
                  הרכב היה מעורב בתאונה חמורה
                </Label>
              </div>

              <GradientSeparator />

              <div>
                <Label className="text-white hebrew-text">קובץ תוצאות טסט (אופציונלי)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleTestFileUpload}
                    disabled={uploadingTestFile}
                    className="hidden"
                    id="test-file"
                  />
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('test-file')?.click()}
                      disabled={uploadingTestFile}
                      className="bg-black border-0 hebrew-text"
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      {uploadingTestFile ? 'מעלה...' : 'העלה קובץ'}
                    </Button>
                  </GradientBorderContainer>
                  {formData.testResultFileUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFormData("testResultFileUrl", "")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {formData.testResultFileUrl && (
                  <p className="text-sm text-muted-foreground mt-1 hebrew-text">קובץ הועלה בהצלחה</p>
                )}
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>
      )}

      {/* Step 4: Description and Images */}
      {currentStep === 4 && (
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">תיאור ותמונות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white hebrew-text">תיאור הרכב *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Textarea
                    placeholder="תאר את הרכב - מצב כללי, תיקונים שבוצעו, אביזרים נוספים וכו'"
                    value={formData.description}
                    onChange={(e) => {
                      updateFormData("description", e.target.value);
                      if (fieldErrors.description) {
                        setFieldErrors({ ...fieldErrors, description: "" });
                      }
                    }}
                    className={`bg-black border-0 text-right hebrew-text min-h-[120px] ${fieldErrors.description ? "border-destructive" : ""}`}
                    dir="rtl"
                  />
                </GradientBorderContainer>
                {fieldErrors.description && (
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.description}</p>
                )}
              </div>

              <div>
                <Label className="text-white hebrew-text">תגיות</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableTags?.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer hebrew-text"
                      style={selectedTagIds.includes(tag.id) ? { 
                        backgroundColor: tag.color || '#6B7280',
                        borderColor: tag.color || '#6B7280',
                        color: '#ffffff'
                      } : {}}
                      onClick={() => {
                        setSelectedTagIds(prev => 
                          prev.includes(tag.id)
                            ? prev.filter(id => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                    >
                      {tag.name_hebrew}
                    </Badge>
                  ))}
                </div>
              </div>

              <GradientSeparator />

              <div>
                <Label className="text-white hebrew-text">תמונות רכב</Label>
                <GradientBorderContainer className="rounded-md">
                  <div className="bg-black border-2 border-dashed border-border/50 rounded-md p-6">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="vehicle-images"
                    />
                    <label
                      htmlFor="vehicle-images"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground hebrew-text">
                        {uploading ? 'מעלה...' : 'לחץ להעלאת תמונות'}
                      </p>
                    </label>
                  </div>
                </GradientBorderContainer>
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`תמונה ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>
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
            disabled={isAddingVehicle}
            className="bg-black border-0 w-full hebrew-text"
          >
            {currentStep === 4 ? (isAddingVehicle ? 'מוסיף...' : 'פרסם רכב') : 'המשך'}
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Button>
        </GradientBorderContainer>
      </div>
    </div>
  );
};

export default AddVehicleScreen;

