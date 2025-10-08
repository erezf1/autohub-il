import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Upload, X, Plus, Minus } from 'lucide-react';
import { useAdminVehicles } from '@/hooks/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { adminClient } from '@/integrations/supabase/adminClient';
import { useToast } from '@/hooks/use-toast';
import { useVehicleMakes, useVehicleModels } from '@/hooks/mobile/useVehicles';
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

const AdminAddVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedMakeId, setSelectedMakeId] = useState<number | undefined>();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    make_id: "",
    model_id: "",
    year: "2020",
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
  
  const { data: makes } = useVehicleMakes();
  const { data: models } = useVehicleModels(selectedMakeId);
  const { addVehicle, isAddingVehicle } = useAdminVehicles();

  // Fetch all users for selection
  const { data: users } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      const { data: usersData, error: usersError } = await adminClient
        .from('users')
        .select('id')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      if (!usersData) return [];

      const userIds = usersData.map(u => u.id);
      const { data: profilesData, error: profilesError } = await adminClient
        .from('user_profiles')
        .select('id, full_name, business_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const profilesById = new Map((profilesData || []).map(p => [p.id, p]));
      return usersData.map(u => ({ ...u, profile: profilesById.get(u.id) || null }));
    },
  });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedUserId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError, data } = await adminClient.storage
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      toast({
        title: 'שגיאה',
        description: 'יש לבחור בעל רכב',
        variant: 'destructive',
      });
      return;
    }

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
      owner_id: selectedUserId,
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
      status: 'available',
      images: uploadedImages.length > 0 ? uploadedImages : null,
      sub_model: formData.vehicleType || null,
    };

    addVehicle(vehicleData);
    navigate('/admin/vehicles');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/vehicles')}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת רכבים
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold hebrew-text">הוספת רכב חדש</h1>
        <p className="text-lg text-muted-foreground hebrew-text mt-1">הוסף רכב למערכת</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">בעל הרכב</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="hebrew-text">בחר בעל רכב *</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוחר" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.profile?.business_name || user.profile?.full_name || user.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">פרטי רכב בסיסיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="hebrew-text">יצרן *</Label>
                <Select
                  value={formData.make_id}
                  onValueChange={(value) => {
                    setSelectedMakeId(parseInt(value));
                    setFormData({ ...formData, make_id: value, model_id: "" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    {makes?.map(make => (
                      <SelectItem key={make.id} value={make.id.toString()}>{make.name_hebrew}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="hebrew-text">דגם *</Label>
                <Select
                  value={formData.model_id}
                  onValueChange={(value) => setFormData({ ...formData, model_id: value })}
                  disabled={!selectedMakeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedMakeId ? "בחר דגם" : "בחר תחילה יצרן"} />
                  </SelectTrigger>
                  <SelectContent>
                    {models?.map(model => (
                      <SelectItem key={model.id} value={model.id.toString()}>{model.name_hebrew}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="hebrew-text">סוג</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג רכב" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="hebrew-text">שנת ייצור *</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, year: (parseInt(formData.year) - 1).toString() })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    min="1990"
                    max="2025"
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, year: (parseInt(formData.year) + 1).toString() })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="hebrew-text">צבע</Label>
                <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
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

              <div>
                <Label className="hebrew-text">קילומטרז׳ *</Label>
                <Input
                  type="number"
                  value={formData.kilometers}
                  onChange={(e) => setFormData({ ...formData, kilometers: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label className="hebrew-text">סוג דלק</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג דלק (אופציונלי)" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel.value} value={fuel.value}>{fuel.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="hebrew-text">תיבת הילוכים</Label>
                <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תיבת הילוכים (אופציונלי)" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map(trans => (
                      <SelectItem key={trans.value} value={trans.value}>{trans.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="hebrew-text">נפח מנוע</Label>
                <Input
                  value={formData.engineSize}
                  onChange={(e) => setFormData({ ...formData, engineSize: e.target.value })}
                  placeholder="2.5"
                  type="text"
                />
                <p className="text-xs text-muted-foreground mt-1 hebrew-text">ערך מקסימלי: 99.9 ליטר</p>
              </div>

              <div>
                <Label className="hebrew-text">מספר בעלים קודמים</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, previousOwners: Math.max(1, parseInt(formData.previousOwners) - 1).toString() })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={formData.previousOwners}
                    onChange={(e) => setFormData({ ...formData, previousOwners: e.target.value })}
                    min="1"
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, previousOwners: (parseInt(formData.previousOwners) + 1).toString() })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="hebrew-text">מחיר (₪) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="hebrew-text">תיאור</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="hebrew-text min-h-[120px]"
              />
            </div>

            <div>
              <Label className="hebrew-text">תמונות רכב</Label>
              <div className="border-2 border-dashed rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading || !selectedUserId}
                  className="hidden"
                  id="vehicle-images"
                />
                <label
                  htmlFor="vehicle-images"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground hebrew-text">
                    {uploading ? 'מעלה...' : !selectedUserId ? 'בחר קודם בעל רכב' : 'לחץ להעלאת תמונות'}
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

        {/* Tags Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text text-right">תגיות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-end">
              {availableTags?.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="hebrew-text cursor-pointer"
                  style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : {}}
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
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/vehicles')}
            className="hebrew-text"
          >
            ביטול
          </Button>
          <Button 
            type="submit" 
            disabled={isAddingVehicle || uploading}
            className="hebrew-text"
          >
            {isAddingVehicle ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                מוסיף...
              </>
            ) : (
              'הוסף רכב'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddVehicle;
