import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useVehicleMakes, useVehicleModels } from '@/hooks/mobile/useVehicles';

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
  const queryClient = useQueryClient();
  
  const [selectedMakeId, setSelectedMakeId] = useState<number | undefined>();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [formData, setFormData] = useState({
    make_id: "",
    model_id: "",
    year: "",
    kilometers: "",
    price: "",
    fuelType: "",
    transmission: "",
    engineSize: "",
    color: "",
    previousOwners: "",
    description: "",
  });
  
  const { data: makes } = useVehicleMakes();
  const { data: models } = useVehicleModels(selectedMakeId);

  // Fetch all users for selection
  const { data: users } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      if (!usersData) return [];

      const userIds = usersData.map(u => u.id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name, business_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const profilesById = new Map((profilesData || []).map(p => [p.id, p]));
      return usersData.map(u => ({ ...u, profile: profilesById.get(u.id) || null }));
    },
  });

  // Add vehicle mutation
  const addVehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('vehicle_listings')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      toast({
        title: 'הרכב נוסף בהצלחה!',
        description: 'הרכב נוסף למערכת',
      });
      navigate('/admin/vehicles');
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה בהוספת רכב',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

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

    const vehicleData = {
      owner_id: selectedUserId,
      make_id: parseInt(formData.make_id),
      model_id: parseInt(formData.model_id),
      year: parseInt(formData.year),
      kilometers: parseInt(formData.kilometers),
      transmission: formData.transmission,
      fuel_type: formData.fuelType,
      engine_size: formData.engineSize ? parseFloat(formData.engineSize) : null,
      color: formData.color,
      price: parseFloat(formData.price),
      description: formData.description,
      previous_owners: formData.previousOwners ? parseInt(formData.previousOwners) : 1,
      status: 'available',
    };

    addVehicleMutation.mutate(vehicleData);
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
                <Label className="hebrew-text">שנת ייצור *</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                  min="1990"
                  max="2025"
                />
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
                <Label className="hebrew-text">סוג דלק *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג דלק" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel.value} value={fuel.value}>{fuel.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="hebrew-text">תיבת הילוכים *</Label>
                <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תיבת הילוכים" />
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
                />
              </div>

              <div>
                <Label className="hebrew-text">מספר בעלים קודמים</Label>
                <Input
                  type="number"
                  value={formData.previousOwners}
                  onChange={(e) => setFormData({ ...formData, previousOwners: e.target.value })}
                  min="0"
                />
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
            disabled={addVehicleMutation.isPending}
            className="hebrew-text"
          >
            {addVehicleMutation.isPending ? (
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
