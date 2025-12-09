import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Edit, Trash2, Phone, MapPin, Car, Calendar, Gauge, Fuel, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { privateClient } from '@/integrations/supabase/privateClient';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VehicleDetails {
  id: string;
  year: number;
  kilometers: number | null;
  price: number;
  fuel_type: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  images: string[] | null;
  status: string | null;
  previous_owners: number | null;
  engine_size: number | null;
  created_at: string | null;
  make: { name_hebrew: string } | null;
  model: { name_hebrew: string } | null;
  private_user: {
    full_name: string;
    phone_number: string;
    location: { name_hebrew: string } | null;
  } | null;
}

const fuelTypeLabels: Record<string, string> = {
  gasoline: 'בנזין',
  diesel: 'דיזל',
  hybrid: 'היברידי',
  electric: 'חשמלי',
};

const transmissionLabels: Record<string, string> = {
  manual: 'ידנית',
  automatic: 'אוטומט',
  semi_automatic: 'טיפטרוניק',
};

export const PrivateVehicleDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = usePrivateAuth();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchVehicle();
  }, [id, user]);

  const fetchVehicle = async () => {
    if (!id || !user) return;

    try {
      const { data, error } = await privateClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(name_hebrew),
          model:vehicle_models(name_hebrew),
          private_user:private_users(
            full_name,
            phone_number,
            location:locations(name_hebrew)
          )
        `)
        .eq('id', id)
        .eq('private_user_id', user.id)
        .single();

      if (error) throw error;
      setVehicle(data);
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

  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      const { error } = await privateClient
        .from('vehicle_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'הרכב נמחק',
        description: 'הרכב הוסר מהמערכת בהצלחה',
      });
      navigate('/private/dashboard');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן למחוק את הרכב',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
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

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background pb-20" dir="rtl">
        <div className="container max-w-md mx-auto p-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">הרכב לא נמצא</p>
            <Button
              onClick={() => navigate('/private/dashboard')}
              className="mt-4"
            >
              חזרה לדשבורד
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const vehicleTitle = `${vehicle.make?.name_hebrew || ''} ${vehicle.model?.name_hebrew || ''} ${vehicle.year}`;

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <div className="container max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/private/dashboard')}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold truncate">{vehicleTitle}</h1>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            מפרטי
          </Badge>
        </div>

        {/* Vehicle Images */}
        {vehicle.images && vehicle.images.length > 0 ? (
          <div className="rounded-lg overflow-hidden">
            <img
              src={vehicle.images[0]}
              alt={vehicleTitle}
              className="w-full h-48 object-cover"
            />
            {vehicle.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {vehicle.images.slice(1).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${vehicleTitle} ${index + 2}`}
                    className="h-16 w-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-muted h-48 flex items-center justify-center">
            <Car className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        {/* Price */}
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            ₪{vehicle.price.toLocaleString()}
          </div>
        </Card>

        {/* Vehicle Specs */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-lg">מפרט הרכב</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">שנה: {vehicle.year}</span>
            </div>
            
            {vehicle.kilometers && (
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vehicle.kilometers.toLocaleString()} ק"מ</span>
              </div>
            )}
            
            {vehicle.fuel_type && (
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{fuelTypeLabels[vehicle.fuel_type] || vehicle.fuel_type}</span>
              </div>
            )}
            
            {vehicle.transmission && (
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{transmissionLabels[vehicle.transmission] || vehicle.transmission}</span>
              </div>
            )}
            
            {vehicle.color && (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-muted-foreground" />
                <span className="text-sm">{vehicle.color}</span>
              </div>
            )}
            
            {vehicle.previous_owners && (
              <div className="flex items-center gap-2">
                <span className="text-sm">בעלים קודמים: {vehicle.previous_owners}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Description */}
        {vehicle.description && (
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-2">תיאור</h3>
            <p className="text-sm text-muted-foreground">{vehicle.description}</p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate(`/private/vehicle/${id}/edit`)}
            className="flex-1 gap-2"
          >
            <Edit className="h-4 w-4" />
            עריכת הרכב
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2" disabled={deleting}>
                <Trash2 className="h-4 w-4" />
                מחיקה
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                <AlertDialogDescription>
                  פעולה זו תמחק את הרכב לצמיתות ולא ניתן יהיה לשחזר אותו.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row-reverse gap-2">
                <AlertDialogCancel>ביטול</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  מחק את הרכב
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
