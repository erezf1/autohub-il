import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Phone, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { privateClient } from '@/integrations/supabase/privateClient';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import { formatPhoneDisplay } from '@/utils/phoneValidation';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export const PrivateProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePrivateAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await privateClient
        .from('private_users')
        .select(`
          *,
          location:locations(name_hebrew)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-20" dir="rtl">
        <div className="container max-w-md mx-auto p-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">לא נמצא פרופיל</p>
          </Card>
        </div>
      </div>
    );
  }

  const statusMap = {
    pending: { label: 'ממתין לאישור', color: 'text-yellow-600' },
    active: { label: 'פעיל', color: 'text-green-600' },
    suspended: { label: 'מושעה', color: 'text-red-600' },
    rejected: { label: 'נדחה', color: 'text-red-600' },
  };

  const statusInfo = statusMap[profile.status as keyof typeof statusMap] || statusMap.pending;

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <div className="container max-w-md mx-auto p-4 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/private/dashboard')}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">הפרופיל שלי</h1>
              <p className="text-sm text-muted-foreground">פרטים אישיים</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/private/profile/edit')}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            ערוך
          </Button>
        </div>

        <div className="space-y-4">
        {/* Status Card */}
        {profile.status !== 'active' && (
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 סטטוס החשבון: <strong>{statusInfo.label}</strong>
              {profile.status === 'pending' && ' - החשבון שלך ממתין לאישור המערכת'}
            </p>
          </Card>
        )}

        {/* Profile Info Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">פרטים אישיים</h3>
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">שם מלא</p>
            <p className="text-base font-medium">{profile.full_name}</p>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">מספר טלפון</p>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <p className="text-base font-medium" dir="ltr">
                {formatPhoneDisplay(profile.phone_number)}
              </p>
            </div>
          </div>

          {/* Location */}
          {profile.location && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">מיקום</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <p className="text-base font-medium">{profile.location.name_hebrew}</p>
              </div>
            </div>
          )}

          {/* Created At */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">תאריך הצטרפות</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-base font-medium">
                {format(new Date(profile.created_at), 'dd MMMM yyyy', { locale: he })}
              </p>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 משתמשים פרטיים יכולים להעלות עד 3 רכבים למכירה בו זמנית
          </p>
        </Card>
        </div>
      </div>
    </div>
  );
};
