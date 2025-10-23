import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Upload, X, Plus, Minus, Car } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";
import { useVehicleMakes, useVehicleModels, useVehicleTags } from "@/hooks/mobile/useVehicles";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useToast } from '@/hooks/use-toast';
import { VEHICLE_TYPES } from '@/constants/vehicleTypes';

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

const EditVehicleScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedMakeId, setSelectedMakeId] = useState<number | undefined>();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [uploadingTestFile, setUploadingTestFile] = useState(false);
  const [formData, setFormData] = useState({
    make_id: "",
    model_id: "",
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
    hadSevereCrash: false,
    testResultFileUrl: "",
  });
  
  const { data: makes } = useVehicleMakes();
  const { data: models } = useVehicleModels(selectedMakeId);
  const { data: availableTags } = useVehicleTags();

  // Fetch vehicle data
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from('vehicle_listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Load vehicle data into form
  useEffect(() => {
    if (vehicle) {
      setSelectedMakeId(vehicle.make_id);
      setUploadedImages(vehicle.images || []);
      setFormData({
        make_id: vehicle.make_id?.toString() || "",
        model_id: vehicle.model_id?.toString() || "",
        year: vehicle.year?.toString() || "",
        kilometers: vehicle.kilometers?.toString() || "",
        price: vehicle.price?.toString() || "",
        fuelType: vehicle.fuel_type || "",
        transmission: vehicle.transmission || "",
        engineSize: vehicle.engine_size?.toString() || "",
        color: vehicle.color || "",
        previousOwners: vehicle.previous_owners?.toString() || "1",
        description: vehicle.description || "",
        vehicleType: vehicle.sub_model || "",
        hadSevereCrash: vehicle.had_severe_crash || false,
        testResultFileUrl: vehicle.test_result_file_url || "",
      });
    }
  }, [vehicle]);

  // Load vehicle tags
  useEffect(() => {
    const loadTags = async () => {
      if (!id) return;
      
      const { data: vehicleTags } = await dealerClient
        .from('vehicle_listing_tags')
        .select('tag_id')
        .eq('vehicle_id', id);
      
      if (vehicleTags) {
        setSelectedTagIds(vehicleTags.map(vt => vt.tag_id));
      }
    };
    
    loadTags();
  }, [id]);

  // Update vehicle mutation
  const updateVehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await dealerClient
        .from('vehicle_listings')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      toast({
        title: 'הרכב עודכן בהצלחה!',
        description: 'השינויים שביצעת נשמרו',
      });
      navigate('/mobile/my-vehicles');
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה בעדכון הרכב',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.make_id) errors.make_id = "יצרן הוא שדה חובה";
    if (!formData.model_id) errors.model_id = "דגם הוא שדה חובה";
    if (!formData.year) {
      errors.year = "שנת ייצור היא שדה חובה";
    } else {
      const year = parseInt(formData.year);
      if (year < 1990 || year > 2025) {
        errors.year = "שנת ייצור חייבת להיות בין 1990 ל-2025";
      }
    }
    if (!formData.kilometers) errors.kilometers = "קילומטרז׳ הוא שדה חובה";
    if (!formData.price) errors.price = "מחיר הוא שדה חובה";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'שגיאה בטופס',
        description: 'אנא תקן את השגיאות לפני השמירה',
        variant: 'destructive',
      });
      return;
    }
    
    const vehicleData = {
      make_id: parseInt(formData.make_id),
      model_id: parseInt(formData.model_id),
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

    try {
      // Update vehicle
      await updateVehicleMutation.mutateAsync(vehicleData);
      
      // Update tags
      await dealerClient
        .from('vehicle_listing_tags')
        .delete()
        .eq('vehicle_id', id);
      
      if (selectedTagIds.length > 0) {
        await dealerClient
          .from('vehicle_listing_tags')
          .insert(
            selectedTagIds.map(tagId => ({
              vehicle_id: id,
              tag_id: tagId
            }))
          );
      }
    } catch (error: any) {
      toast({
        title: 'שגיאה בעדכון',
        description: error.message,
        variant: 'destructive',
      });
    }
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

      setFormData({ ...formData, testResultFileUrl: publicUrl });
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div 
          onClick={() => navigate('/mobile/my-vehicles')}
          className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
        >
          <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
        </div>
        <h1 className="text-2xl font-bold text-foreground hebrew-text">עריכת רכב</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Vehicle Info */}
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-white hebrew-text">
                <Car className="h-5 w-5" />
                <span>פרטי רכב בסיסיים</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white hebrew-text">יצרן *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select
                    value={formData.make_id}
                    onValueChange={(value) => {
                      setSelectedMakeId(parseInt(value));
                      setFormData({ ...formData, make_id: value, model_id: "" });
                      if (fieldErrors.make_id) {
                        setFieldErrors({ ...fieldErrors, make_id: "" });
                      }
                    }}
                  >
                    <SelectTrigger className={`bg-black border-0 ${fieldErrors.make_id ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="בחר יצרן" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes?.map(make => (
                        <SelectItem key={make.id} value={make.id.toString()}>{make.name_hebrew}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
                {fieldErrors.make_id && (
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.make_id}</p>
                )}
              </div>

              <div>
                <Label className="text-white hebrew-text">דגם *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select
                    key={`model-${selectedMakeId}`}
                    value={formData.model_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, model_id: value });
                      if (fieldErrors.model_id) {
                        setFieldErrors({ ...fieldErrors, model_id: "" });
                      }
                    }}
                    disabled={!selectedMakeId}
                  >
                    <SelectTrigger className={`bg-black border-0 ${fieldErrors.model_id ? "border-destructive" : ""}`}>
                      <SelectValue placeholder={selectedMakeId ? "בחר דגם" : "בחר תחילה יצרן"} />
                    </SelectTrigger>
                    <SelectContent>
                      {models?.map(model => (
                        <SelectItem key={model.id} value={model.id.toString()}>{model.name_hebrew}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
                {fieldErrors.model_id && (
                  <p className="text-sm text-destructive mt-1 hebrew-text">{fieldErrors.model_id}</p>
                )}
              </div>

              <div>
                <Label className="text-white hebrew-text">שנת ייצור *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.year}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, year: value });
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
                  <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
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
                  <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
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

        {/* Technical Details */}
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
                    value={formData.kilometers}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, kilometers: value });
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
                    onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
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
                    onValueChange={(value) => setFormData({ ...formData, transmission: value })}
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
                    value={formData.engineSize}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, engineSize: value });
                    }}
                    placeholder="1600 סמ״ק"
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
                        setFormData({ ...formData, previousOwners: Math.max(0, current - 1).toString() });
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
                      value={formData.previousOwners}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, previousOwners: value || "1" });
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
                        setFormData({ ...formData, previousOwners: (current + 1).toString() });
                      }}
                      className="bg-black border-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                </div>
              </div>

              <GradientSeparator />

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="crash-checkbox"
                  checked={formData.hadSevereCrash}
                  onCheckedChange={(checked) => setFormData({ ...formData, hadSevereCrash: checked as boolean })}
                />
                <Label htmlFor="crash-checkbox" className="text-white hebrew-text cursor-pointer">
                  הרכב היה מעורב בתאונה חמורה
                </Label>
              </div>

              <GradientSeparator />

              <div>
                <Label className="text-white hebrew-text">מסמך בדיקה / טסט (אופציונלי)</Label>
                <div className="space-y-2">
                  {formData.testResultFileUrl ? (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(formData.testResultFileUrl, '_blank')}
                        className="flex-1 hebrew-text bg-black border-0"
                      >
                        צפה במסמך
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, testResultFileUrl: "" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleTestFileUpload}
                        disabled={uploadingTestFile}
                        className="hidden"
                        id="mobile-edit-test-file-upload"
                      />
                      <label htmlFor="mobile-edit-test-file-upload">
                        <GradientBorderContainer className="rounded-md">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full hebrew-text bg-black border-0"
                            disabled={uploadingTestFile}
                            onClick={() => document.getElementById('mobile-edit-test-file-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 ml-2" />
                            {uploadingTestFile ? 'מעלה...' : 'העלה מסמך בדיקה'}
                          </Button>
                        </GradientBorderContainer>
                      </label>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground hebrew-text">
                    PDF, Word, או תמונה - עד 10MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        {/* Price and Description */}
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">מחיר ותיאור</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white hebrew-text">מחיר (₪) *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, price: value });
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
                <Label className="text-white hebrew-text">תיאור</Label>
                <GradientBorderContainer className="rounded-md">
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="hebrew-text min-h-[120px] bg-black border-0 text-right"
                    dir="rtl"
                  />
                </GradientBorderContainer>
              </div>

              <GradientSeparator />

              <div className="flex items-center space-x-2 space-x-reverse pt-2">
                <Checkbox 
                  id="hadSevereCrashPrice"
                  checked={formData.hadSevereCrash}
                  onCheckedChange={(checked) => setFormData({ ...formData, hadSevereCrash: checked as boolean })}
                />
                <Label htmlFor="hadSevereCrashPrice" className="text-white hebrew-text cursor-pointer">
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
                    id="test-file-edit"
                  />
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('test-file-edit')?.click()}
                      disabled={uploadingTestFile}
                      className="hebrew-text bg-black border-0"
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      {uploadingTestFile ? 'מעלה...' : formData.testResultFileUrl ? 'החלף קובץ' : 'העלה קובץ'}
                    </Button>
                  </GradientBorderContainer>
                  {formData.testResultFileUrl && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(formData.testResultFileUrl, '_blank')}
                        className="hebrew-text bg-black border-0"
                      >
                        צפה בקובץ
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, testResultFileUrl: "" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                {formData.testResultFileUrl && !uploadingTestFile && (
                  <p className="text-sm text-muted-foreground mt-1 hebrew-text">קובץ קיים</p>
                )}
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        {/* Tags */}
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">תגיות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
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
            </CardContent>
          </Card>
        </GradientBorderContainer>

        {/* Images */}
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">תמונות רכב</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="vehicle-images"
                />
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 bg-black">
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

        {/* Action Buttons */}
        <div className="flex gap-4 pb-6">
          <GradientBorderContainer className="rounded-md">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/mobile/my-vehicles')} 
              className="hebrew-text bg-black border-0"
            >
              ביטול
            </Button>
          </GradientBorderContainer>
          <GradientBorderContainer className="rounded-md flex-1">
            <Button 
              type="submit" 
              disabled={updateVehicleMutation.isPending} 
              className="hebrew-text w-full bg-black border-0"
            >
              {updateVehicleMutation.isPending ? 'שומר...' : 'שמור שינויים'}
            </Button>
          </GradientBorderContainer>
        </div>
      </form>
    </div>
  );
};

export default EditVehicleScreen;
