import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { VehicleCard } from '@/components/common/VehicleCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { privateClient } from '@/integrations/supabase/privateClient';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import { Card } from '@/components/ui/card';

export const PrivateMyVehiclesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePrivateAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const fetchVehicles = async () => {
    if (!user) return;

    try {
      const { data, error } = await privateClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(name_hebrew),
          model:vehicle_models(name_hebrew)
        `)
        .eq('private_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAddVehicle = vehicles.length < 3;

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title={
          <div className="space-y-1">
            <div>הרכבים שלי</div>
            <div className="text-sm font-normal text-muted-foreground">{vehicles.length} מתוך 3 רכבים</div>
          </div>
        }
        rightAction={
          canAddVehicle && (
            <Button
              onClick={() => navigate('/private/add-vehicle')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              הוסף רכב
            </Button>
          )
        }
      />

      <div className="p-4 space-y-4">
        {vehicles.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <Car className="w-10 h-10 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">עדיין אין רכבים</h3>
              <p className="text-muted-foreground">
                התחל למכור - העלה את הרכב הראשון שלך
              </p>
            </div>
            <Button
              onClick={() => navigate('/private/add-vehicle')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              הוסף רכב ראשון
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id}
                  images={vehicle.images}
                  makeName={vehicle.make?.name_hebrew || ''}
                  modelName={vehicle.model?.name_hebrew || ''}
                  year={vehicle.year}
                  kilometers={vehicle.kilometers}
                  transmission={vehicle.transmission}
                  fuelType={vehicle.fuel_type}
                  price={vehicle.price}
                  hotSalePrice={vehicle.hot_sale_price}
                  isBoosted={vehicle.is_boosted}
                  boostedUntil={vehicle.boosted_until}
                  onClick={() => navigate(`/private/vehicle/${vehicle.id}`)}
                />
              ))}
            </div>

            {!canAddVehicle && (
              <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                  💡 הגעת למקסימום של 3 רכבים. כדי להוסיף רכב נוסף, מחק רכב קיים תחילה.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
};
