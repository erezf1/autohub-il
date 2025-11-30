import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { privateClient } from '@/integrations/supabase/privateClient';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';

export const PrivateDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePrivateAuth();
  const [vehicleCount, setVehicleCount] = useState(0);
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

        // Fetch vehicle count
        const { count } = await privateClient
          .from('vehicle_listings')
          .select('*', { count: 'exact', head: true })
          .eq('private_user_id', user.id)
          .eq('status', 'available');

        setVehicleCount(count || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const canAddVehicle = vehicleCount < 3;

  return (
    <PageContainer>
      <PageHeader 
        title={
          <div className="space-y-1">
            <div>לוח בקרה</div>
            {userName && <div className="text-sm font-normal text-muted-foreground">שלום, {userName}</div>}
          </div>
        }
      />

      <div className="space-y-6 p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vehicles Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">הרכבים שלי</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold">{vehicleCount}</h2>
                  <span className="text-sm text-muted-foreground">/ 3</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {canAddVehicle 
                    ? `ניתן להוסיף עוד ${3 - vehicleCount} רכבים`
                    : 'הגעת למקסימום רכבים'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">הפרופיל שלי</p>
                <h3 className="text-lg font-semibold">{userName || 'טוען...'}</h3>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => navigate('/private/profile')}
                >
                  עדכן פרטים
                </Button>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">פעולות מהירות</h3>
          
          <Card 
            className="p-4 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigate('/private/my-vehicles')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">הרכבים שלי</h4>
                  <p className="text-sm text-muted-foreground">
                    צפה וערוך את הרכבים שלך
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {canAddVehicle && (
            <Card 
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate('/private/add-vehicle')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">הוסף רכב חדש</h4>
                    <p className="text-sm text-muted-foreground">
                      העלה רכב למכירה
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Info Box */}
        {!canAddVehicle && (
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 הגעת למקסימום של 3 רכבים. כדי להוסיף רכב נוסף, מחק רכב קיים תחילה.
            </p>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
