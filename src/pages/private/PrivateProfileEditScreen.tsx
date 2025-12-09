import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowRight, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { privateClient } from '@/integrations/supabase/privateClient';
import { supabase } from '@/integrations/supabase/client';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const PrivateProfileEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePrivateAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [locationId, setLocationId] = useState<string>('');
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profile } = await privateClient
        .from('private_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name);
        setLocationId(profile.location_id?.toString() || '');
      }

      // Fetch locations
      const { data: locs } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');

      if (locs) {
        setLocations(locs);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast({
        title: 'שגיאה',
        description: 'נא למלא את השם המלא',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await privateClient
        .from('private_users')
        .update({
          full_name: fullName,
          location_id: locationId ? parseInt(locationId) : null,
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast({
        title: 'הפרופיל עודכן',
        description: 'הפרטים שלך נשמרו בהצלחה',
      });

      navigate('/private/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'שגיאה',
        description: error.message || 'אירעה שגיאה בעדכון הפרופיל',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

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
            <div>עריכת פרופיל</div>
            <div className="text-sm font-normal text-muted-foreground">עדכן את הפרטים האישיים שלך</div>
          </div>
        }
        onBack={() => navigate('/private/profile')}
      />

      <div className="p-4">
        <Card className="p-6 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">שם מלא</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="יוסי כהן"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">מיקום</label>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger className="pr-10">
                  <SelectValue placeholder="בחר מיקום" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name_hebrew}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'שומר...' : 'שמור שינויים'}
            </Button>
            <Button
              onClick={() => navigate('/private/profile')}
              variant="outline"
            >
              ביטול
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
