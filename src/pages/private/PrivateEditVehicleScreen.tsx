import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { privateClient } from "@/integrations/supabase/privateClient";
import { usePrivateAuth } from "@/contexts/PrivateAuthContext";
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
  makeId: string;
  modelId: string;
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

export const PrivateEditVehicleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = usePrivateAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<VehicleForm>({
    makeId: "",
    modelId: "",
    year: "",
    kilometers: "",
    price: "",
    fuelType: "",
    transmission: "",
    engineSize: "",
    color: "",
    previousOwners: "",
    description: "",
    vehicleType: "",
  });

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    if (!id || !user) return;

    try {
      // Fetch makes
      const { data: makesData } = await privateClient
        .from('vehicle_makes')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');
      if (makesData) setMakes(makesData);

      // Fetch vehicle
      const { data: vehicle, error } = await privateClient
        .from('vehicle_listings')
        .select('*')
        .eq('id', id)
        .eq('private_user_id', user.id)
        .single();

      if (error) throw error;

      // Fetch models for the vehicle's make
      if (vehicle.make_id) {
        const { data: modelsData } = await privateClient
          .from('vehicle_models')
          .select('*')
          .eq('make_id', vehicle.make_id)
          .eq('is_active', true)
          .order('name_hebrew');
        if (modelsData) setModels(modelsData);
      }

      setFormData({
        makeId: vehicle.make_id?.toString() || "",
        modelId: vehicle.model_id?.toString() || "",
        year: vehicle.year?.toString() || "",
        kilometers: vehicle.kilometers?.toString() || "",
        price: vehicle.price?.toString() || "",
        fuelType: vehicle.fuel_type || "",
        transmission: vehicle.transmission || "",
        engineSize: vehicle.engine_size?.toString() || "",
        color: vehicle.color || "",
        previousOwners: vehicle.previous_owners?.toString() || "",
        description: vehicle.description || "",
        vehicleType: vehicle.sub_model || "",
      });
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לטעון את פרטי הרכב',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakeChange = async (makeId: string) => {
    setFormData(prev => ({ ...prev, makeId, modelId: "" }));
    
    const { data } = await privateClient
      .from('vehicle_models')
      .select('*')
      .eq('make_id', parseInt(makeId))
      .eq('is_active', true)
      .order('name_hebrew');
    if (data) setModels(data);
  };

  const updateFormData = (field: keyof VehicleForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id || !formData.makeId || !formData.modelId || !formData.year || !formData.price) {
      toast({
        title: 'שגיאה',
        description: 'אנא מלא את כל השדות הנדרשים',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await privateClient
        .from('vehicle_listings')
        .update({
          make_id: parseInt(formData.makeId),
          model_id: parseInt(formData.modelId),
          year: parseInt(formData.year),
          kilometers: formData.kilometers ? parseInt(formData.kilometers) : null,
          price: parseFloat(formData.price),
          fuel_type: formData.fuelType || null,
          transmission: formData.transmission || null,
          engine_size: formData.engineSize ? parseFloat(formData.engineSize) : null,
          color: formData.color || null,
          previous_owners: formData.previousOwners ? parseInt(formData.previousOwners) : null,
          description: formData.description || null,
          sub_model: formData.vehicleType || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'הרכב עודכן',
        description: 'פרטי הרכב עודכנו בהצלחה',
      });
      navigate(`/private/vehicle/${id}`);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לעדכן את הרכב',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20" dir="rtl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <div className="container max-w-md mx-auto px-4 space-y-6 py-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/private/vehicle/${id}`)}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">עריכת רכב</h1>
        </div>

        {/* Form */}
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Car className="h-5 w-5" />
                פרטי הרכב
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Make */}
              <div>
                <Label className="text-white">יצרן *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.makeId} onValueChange={handleMakeChange}>
                    <SelectTrigger className="bg-black border-0">
                      <SelectValue placeholder="בחר יצרן" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map(make => (
                        <SelectItem key={make.id} value={make.id.toString()}>
                          {make.name_hebrew}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>

              {/* Model */}
              <div>
                <Label className="text-white">דגם *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select 
                    value={formData.modelId} 
                    onValueChange={(v) => updateFormData("modelId", v)}
                    disabled={!formData.makeId}
                  >
                    <SelectTrigger className="bg-black border-0">
                      <SelectValue placeholder="בחר דגם" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(model => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.name_hebrew}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>

              {/* Year */}
              <div>
                <Label className="text-white">שנת ייצור *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.year}
                    onChange={(e) => updateFormData("year", e.target.value.replace(/[^0-9]/g, ''))}
                    className="bg-black border-0 text-right"
                    dir="rtl"
                  />
                </GradientBorderContainer>
              </div>

              {/* Kilometers */}
              <div>
                <Label className="text-white">קילומטרז׳</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.kilometers}
                    onChange={(e) => updateFormData("kilometers", e.target.value.replace(/[^0-9]/g, ''))}
                    className="bg-black border-0 text-right"
                    dir="rtl"
                  />
                </GradientBorderContainer>
              </div>

              {/* Price */}
              <div>
                <Label className="text-white">מחיר *</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.price}
                    onChange={(e) => updateFormData("price", e.target.value.replace(/[^0-9]/g, ''))}
                    className="bg-black border-0 text-right"
                    dir="rtl"
                  />
                </GradientBorderContainer>
              </div>

              {/* Fuel Type */}
              <div>
                <Label className="text-white">סוג דלק</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.fuelType} onValueChange={(v) => updateFormData("fuelType", v)}>
                    <SelectTrigger className="bg-black border-0">
                      <SelectValue placeholder="בחר סוג דלק" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map(fuel => (
                        <SelectItem key={fuel.value} value={fuel.value}>
                          {fuel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>

              {/* Transmission */}
              <div>
                <Label className="text-white">תיבת הילוכים</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.transmission} onValueChange={(v) => updateFormData("transmission", v)}>
                    <SelectTrigger className="bg-black border-0">
                      <SelectValue placeholder="בחר תיבת הילוכים" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissions.map(trans => (
                        <SelectItem key={trans.value} value={trans.value}>
                          {trans.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>

              {/* Color */}
              <div>
                <Label className="text-white">צבע</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.color} onValueChange={(v) => updateFormData("color", v)}>
                    <SelectTrigger className="bg-black border-0">
                      <SelectValue placeholder="בחר צבע" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map(color => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>

              {/* Vehicle Type */}
              <div>
                <Label className="text-white">סוג רכב</Label>
                <GradientBorderContainer className="rounded-md">
                  <Select value={formData.vehicleType} onValueChange={(v) => updateFormData("vehicleType", v)}>
                    <SelectTrigger className="bg-black border-0">
                      <SelectValue placeholder="בחר סוג רכב" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GradientBorderContainer>
              </div>

              {/* Previous Owners */}
              <div>
                <Label className="text-white">מספר בעלים קודמים</Label>
                <GradientBorderContainer className="rounded-md">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.previousOwners}
                    onChange={(e) => updateFormData("previousOwners", e.target.value.replace(/[^0-9]/g, ''))}
                    className="bg-black border-0 text-right"
                    dir="rtl"
                  />
                </GradientBorderContainer>
              </div>

              {/* Description */}
              <div>
                <Label className="text-white">תיאור</Label>
                <GradientBorderContainer className="rounded-md">
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    className="bg-black border-0 min-h-[100px]"
                    placeholder="תיאור נוסף על הרכב..."
                  />
                </GradientBorderContainer>
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'שומר...' : 'שמור שינויים'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/private/vehicle/${id}`)}
          >
            ביטול
          </Button>
        </div>
      </div>
    </div>
  );
};
