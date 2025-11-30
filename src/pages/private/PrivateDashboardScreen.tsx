import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { privateClient } from '@/integrations/supabase/privateClient';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';

export const PrivateDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePrivateAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const { data: profile } = await privateClient
          .from('private_users')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name);
        }

        // Fetch vehicles
        const { data: vehiclesData } = await privateClient
          .from('vehicle_listings')
          .select(`
            *,
            make:vehicle_makes(name_hebrew),
            model:vehicle_models(name_hebrew)
          `)
          .eq('private_user_id', user.id)
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        setVehicles(vehiclesData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const canAddVehicle = vehicles.length < 3;

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <div className="container max-w-md mx-auto p-4 space-y-6">
        {/* User Profile Header */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{userName || 'טוען...'}</h2>
                <p className="text-sm text-muted-foreground">משתמש פרטי</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/private/profile')}
            >
              עריכה
            </Button>
          </div>
        </Card>

        {/* My Cars Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">הרכבים שלי</h1>
            <span className="text-sm text-muted-foreground">
              {vehicles.length} / 3
            </span>
          </div>

          {/* Vehicle Cards */}
          {vehicles.length > 0 ? (
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate(`/private/vehicle/${vehicle.id}`)}
                >
                  <div className="flex gap-4">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.make?.name_hebrew} ${vehicle.model?.name_hebrew}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                        <Car className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">
                        {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        שנת {vehicle.year} • {vehicle.kilometers?.toLocaleString()} ק"מ
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ₪{vehicle.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Car className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">עדיין לא הוספת רכבים</p>
            </Card>
          )}

          {/* Add Vehicle Button */}
          {canAddVehicle && (
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate('/private/add-vehicle')}
            >
              <Plus className="w-5 h-5 ml-2" />
              הוסף רכב למכירה
            </Button>
          )}

          {/* Max Vehicles Warning */}
          {!canAddVehicle && (
            <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                💡 הגעת למקסימום של 3 רכבים
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
