import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicleMakes, useVehicleModels } from "@/hooks/mobile/useVehicles";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  // Fetch vehicle data
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data, error } = await supabase
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
        previousOwners: vehicle.previous_owners?.toString() || "",
        description: vehicle.description || "",
      });
    }
  }, [vehicle]);

  // Update vehicle mutation
  const updateVehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData = {
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
    };

    updateVehicleMutation.mutate(vehicleData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/mobile/my-vehicles')}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground hebrew-text">עריכת רכב</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">פרטי רכב בסיסיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">מפרט טכני</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">מחיר ותיאור</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="hebrew-text">מחיר (₪) *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
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

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/mobile/my-vehicles')} className="hebrew-text">
            ביטול
          </Button>
          <Button type="submit" disabled={updateVehicleMutation.isPending} className="flex-1 hebrew-text">
            {updateVehicleMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
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

export default EditVehicleScreen;
