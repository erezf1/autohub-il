import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Loader2, Upload, X, Plus, Minus } from 'lucide-react';
import { useAdminVehicles } from '@/hooks/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { adminClient } from '@/integrations/supabase/adminClient';
import { useToast } from '@/hooks/use-toast';
import { useVehicleMakes, useVehicleModels } from '@/hooks/mobile/useVehicles';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
// Vehicle type constants for dropdown
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

const statuses = [
  { value: "available", label: "זמין" },
  { value: "sold", label: "נמכר" },
  { value: "pending", label: "ממתין" },
  { value: "removed", label: "הוסר" }
];

const AdminEditVehicle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { useAdminVehicle, updateVehicle, isUpdatingVehicle } = useAdminVehicles();
  
  const { data: vehicle, isLoading: vehicleLoading } = useAdminVehicle(id);
  
  const [selectedMakeId, setSelectedMakeId] = useState<number | undefined>();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingTestFile, setUploadingTestFile] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    make_id: "",
    model_id: "",
    sub_model: "",
    year: "2020",
    kilometers: "",
    price: "",
    fuelType: "",
    transmission: "",
    engineSize: "1600",
    color: "",
    previousOwners: "1",
    description: "",
    status: "available",
    hadSevereCrash: false,
    testResultFileUrl: "",
  });
  
  const { data: makes } = useVehicleMakes();
  const { data: models } = useVehicleModels(selectedMakeId);

  const { data: availableTags } = useQuery({
    queryKey: ['vehicle-tags'],
    queryFn: async () => {
      const { data, error } = await adminClient
        .from('vehicle_tags')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');
      if (error) throw error;
      return data;
    },
  });

  // Pre-populate form when vehicle data loads
  useEffect(() => {
    if (vehicle && vehicle.make_id) {
      // Set make ID first to trigger model loading
      setSelectedMakeId(vehicle.make_id);
      
      // Then set all form data
      setFormData({
        make_id: vehicle.make_id?.toString() || "",
        model_id: vehicle.model_id?.toString() || "",
        sub_model: vehicle.sub_model || "",
        year: vehicle.year?.toString() || "2020",
        kilometers: vehicle.kilometers?.toString() || "",
        price: vehicle.price?.toString() || "",
        fuelType: vehicle.fuel_type || "",
        transmission: vehicle.transmission || "",
        engineSize: vehicle.engine_size?.toString() || "1600",
        color: vehicle.color || "",
        previousOwners: vehicle.previous_owners?.toString() || "1",
        description: vehicle.description || "",
        status: vehicle.status || "available",
        hadSevereCrash: vehicle.had_severe_crash || false,
        testResultFileUrl: vehicle.test_result_file_url || "",
      });
      setUploadedImages(vehicle.images || []);
      setSelectedTags(vehicle.tags?.map((t: any) => t.id) || []);
    }
  }, [vehicle]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !vehicle) return;

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${vehicle.owner_id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await adminClient.storage
          .from('vehicle-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = adminClient.storage
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
      if (!vehicle?.owner_id) throw new Error('No owner ID');

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'קובץ גדול מדי',
          description: 'הקובץ חייב להיות קטן מ-10MB',
          variant: 'destructive',
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicle.owner_id}/test-results/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await adminClient.storage
        .from('vehicle-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = adminClient.storage
        .from('vehicle-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, testResultFileUrl: publicUrl });
      toast({ title: 'הקובץ הועלה בהצלחה' });
    } catch (error: any) {
      toast({
        title: 'שגיאה בהעלאת הקובץ',
        description: error?.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingTestFile(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    // Validate engine size
    if (formData.engineSize && parseFloat(formData.engineSize) >= 100) {
      toast({
        title: 'שגיאה',
        description: 'נפח מנוע חייב להיות קטן מ-100 ליטר',
        variant: 'destructive',
      });
      return;
    }

    const vehicleData = {
      make_id: parseInt(formData.make_id),
      model_id: parseInt(formData.model_id),
      sub_model: formData.sub_model || null,
      year: parseInt(formData.year),
      kilometers: parseInt(formData.kilometers),
      transmission: formData.transmission || null,
      fuel_type: formData.fuelType || null,
      engine_size: formData.engineSize ? parseFloat(formData.engineSize) : null,
      color: formData.color || null,
      price: parseFloat(formData.price),
      description: formData.description || null,
      previous_owners: formData.previousOwners ? parseInt(formData.previousOwners) : 1,
      status: formData.status,
      had_severe_crash: formData.hadSevereCrash,
      test_result_file_url: formData.testResultFileUrl || null,
      images: uploadedImages.length > 0 ? uploadedImages : null,
    };

    updateVehicle({ vehicleId: id, vehicleData }, {
      onSuccess: () => {
        navigate(`/admin/vehicles/${id}`);
      }
    });
  };

  if (vehicleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold hebrew-text">רכב לא נמצא</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/admin/vehicles/${id}`)}
          className="hebrew-text btn-hover-cyan"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לפרטי רכב
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white hebrew-text">עריכת רכב</h1>
        <p className="text-lg text-white/70 hebrew-text mt-1">
          {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} - {vehicle.year}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Owner Info - Read Only */}
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">בעל הרכב</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground hebrew-text mb-1">שם העסק</p>
                <p className="font-medium text-white hebrew-text">{vehicle.owner?.business_name}</p>
                <p className="text-sm text-muted-foreground hebrew-text mt-2 mb-1">שם מלא</p>
                <p className="font-medium text-white hebrew-text">{vehicle.owner?.full_name}</p>
                <p className="text-xs text-muted-foreground hebrew-text mt-2">
                  לא ניתן לשנות בעל רכב
                </p>
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">פרטי רכב בסיסיים</CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white hebrew-text">יצרן *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select
                    value={formData.make_id}
                    onValueChange={(value) => {
                      setSelectedMakeId(parseInt(value));
                      setFormData({ ...formData, make_id: value, model_id: "" });
                    }}
                  >
                    <SelectTrigger className="border-0 bg-black rounded-md">
                      <SelectValue placeholder="בחר יצרן" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes?.map(make => (
                        <SelectItem key={make.id} value={make.id.toString()}>{make.name_hebrew}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>

              <div>
                <Label className="text-white hebrew-text">דגם *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select
                    key={`model-${selectedMakeId}`}
                    value={formData.model_id}
                    onValueChange={(value) => setFormData({ ...formData, model_id: value })}
                    disabled={!selectedMakeId}
                  >
                    <SelectTrigger className="border-0 bg-black rounded-md">
                      <SelectValue placeholder={selectedMakeId ? "בחר דגם" : "בחר תחילה יצרן"} />
                    </SelectTrigger>
                    <SelectContent>
                      {models?.map(model => (
                        <SelectItem key={model.id} value={model.id.toString()}>{model.name_hebrew}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>

              <div>
                <Label className="text-white hebrew-text">סוג</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select
                    value={formData.sub_model}
                    onValueChange={(value) => setFormData({ ...formData, sub_model: value })}
                  >
                    <SelectTrigger className="border-0 bg-black rounded-md">
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
                <Label className="text-white hebrew-text">שנת ייצור *</Label>
                <div className="flex items-center gap-2">
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData({ ...formData, year: (parseInt(formData.year) - 1).toString() })}
                      className="border-0 bg-black rounded-md"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                  <GradientBorderContainer className="rounded-md flex-1">
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                      min="1990"
                      max="2025"
                      className="border-0 bg-black rounded-md text-center"
                    />
                  </GradientBorderContainer>
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData({ ...formData, year: (parseInt(formData.year) + 1).toString() })}
                      className="border-0 bg-black rounded-md"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                </div>
              </div>

              <div>
                <Label className="text-white hebrew-text">צבע</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                    <SelectTrigger className="border-0 bg-black rounded-md">
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

              <div>
                <Label className="text-white hebrew-text">קילומטרז׳ *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="number"
                    value={formData.kilometers}
                    onChange={(e) => setFormData({ ...formData, kilometers: e.target.value })}
                    required
                    className="border-0 bg-black rounded-md"
                  />
                </GradientBorderContainer>
              </div>

              <div>
                <Label className="text-white hebrew-text">סוג דלק</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                    <SelectTrigger className="border-0 bg-black rounded-md">
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
                <Label className="text-white hebrew-text">תיבת הילוכים</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                    <SelectTrigger className="border-0 bg-black rounded-md">
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
                <Label className="text-white hebrew-text">נפח מנוע</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    value={formData.engineSize}
                    onChange={(e) => setFormData({ ...formData, engineSize: e.target.value })}
                    placeholder="2.5"
                    type="text"
                    className="border-0 bg-black rounded-md"
                  />
                </GradientBorderContainer>
                <p className="text-xs text-muted-foreground mt-1 hebrew-text">ערך מקסימלי: 99.9 ליטר</p>
              </div>

              <div>
                <Label className="text-white hebrew-text">מספר בעלים קודמים</Label>
                <div className="flex items-center gap-2">
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData({ ...formData, previousOwners: Math.max(1, parseInt(formData.previousOwners) - 1).toString() })}
                      className="border-0 bg-black rounded-md"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                  <GradientBorderContainer className="rounded-md flex-1">
                    <Input
                      type="number"
                      value={formData.previousOwners}
                      onChange={(e) => setFormData({ ...formData, previousOwners: e.target.value })}
                      min="1"
                      className="border-0 bg-black rounded-md text-center"
                    />
                  </GradientBorderContainer>
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData({ ...formData, previousOwners: (parseInt(formData.previousOwners) + 1).toString() })}
                      className="border-0 bg-black rounded-md"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                </div>
              </div>

              <div>
                <Label className="text-white hebrew-text">מחיר (₪) *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="border-0 bg-black rounded-md"
                  />
                </GradientBorderContainer>
              </div>

              <div>
                <Label className="text-white hebrew-text">סטטוס *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="border-0 bg-black rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="hadSevereCrash"
                checked={formData.hadSevereCrash}
                onCheckedChange={(checked) => setFormData({ ...formData, hadSevereCrash: checked as boolean })}
              />
              <Label htmlFor="hadSevereCrash" className="hebrew-text cursor-pointer">
                היה מעורב בתאונה חמורה
              </Label>
            </div>

            <div>
              <Label className="text-white hebrew-text">תיאור</Label>
              <GradientBorderContainer className="rounded-md">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-0 bg-black rounded-md hebrew-text min-h-[120px]"
                />
              </GradientBorderContainer>
            </div>

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
                      id="test-file-upload"
                    />
                    <label htmlFor="test-file-upload">
                      <GradientBorderContainer className="rounded-md">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-0 bg-black rounded-md hover:bg-gradient-to-r hover:from-[#5be1fd] hover:to-[#2277ee] hover:text-black transition-all"
                          disabled={uploadingTestFile}
                          onClick={() => document.getElementById('test-file-upload')?.click()}
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

            <div>
              <Label className="hebrew-text">תמונות רכב</Label>
              <div className="border-2 border-dashed rounded-lg p-6">
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
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
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

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-white hebrew-text text-right">תגיות</CardTitle>
            </CardHeader>
          <CardContent>
            {!availableTags || availableTags.length === 0 ? (
              <p className="text-sm text-muted-foreground hebrew-text text-right">אין תגיות זמינות</p>
            ) : (
              <div className="flex flex-wrap gap-2 justify-end">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className={`cursor-pointer hebrew-text ${selectedTags.includes(tag.id) ? 'text-black' : ''}`}
                    onClick={() => {
                      setSelectedTags(prev =>
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
            )}
          </CardContent>
        </Card>
        </GradientBorderContainer>

        <div className="flex gap-4 justify-end">
          <GradientBorderContainer className="rounded-md">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/vehicles/${id}`)}
              disabled={isUpdatingVehicle}
              className="border-0 bg-black rounded-md"
            >
              ביטול
            </Button>
          </GradientBorderContainer>
          <Button 
            type="submit" 
            disabled={isUpdatingVehicle} 
            className="bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee]"
          >
            {isUpdatingVehicle ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                שומר...
              </>
            ) : (
              'שמור שינויים'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditVehicle;
