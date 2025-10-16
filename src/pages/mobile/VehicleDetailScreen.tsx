import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Phone, Star, MapPin, Calendar, Gauge, ChevronLeft, ChevronRight, Loader2, Edit, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import darkCarImage from "@/assets/dark_car.png";
import { useState } from "react";
import { getVehicleTypeLabel } from "@/constants/vehicleTypes";
import { useAuth } from "@/contexts/AuthContext";
import { DealerCard } from "@/components/common";

const VehicleDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch vehicle data
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle-detail', id],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english),
          vehicle_listing_tags(
            tag_id,
            tag:vehicle_tags(id, name_hebrew, name_english, color, tag_type)
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch owner profile separately
  const { data: ownerProfile } = useQuery({
    queryKey: ['vehicle-owner', vehicle?.owner_id],
    queryFn: async () => {
      if (!vehicle?.owner_id) return null;
      
      const { data, error } = await dealerClient
        .from('user_profiles')
        .select('id, full_name, business_name')
        .eq('id', vehicle.owner_id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!vehicle?.owner_id,
  });

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleContactSeller = () => {
    if (vehicle?.owner_id) {
      navigate(`/mobile/chat/new?vehicle=${id}&seller=${ownerProfile?.business_name || ownerProfile?.full_name}`);
    }
  };

  const handleCallSeller = () => {
    // Phone number would need to be fetched separately or included in query
    // For now, just show toast
  };

  const nextImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground hebrew-text">רכב לא נמצא</p>
      </div>
    );
  }

  const images = vehicle.images || [darkCarImage];
  const isOwnVehicle = vehicle?.owner_id === user?.id;
  const transmissionLabel = vehicle.transmission === 'automatic' ? 'אוטומט' : 
                           vehicle.transmission === 'manual' ? 'ידנית' : 
                           vehicle.transmission === 'semi_automatic' ? 'טיפטרוניק' : '-';
  const fuelLabel = vehicle.fuel_type === 'gasoline' ? 'בנזין' :
                   vehicle.fuel_type === 'diesel' ? 'דיזל' :
                   vehicle.fuel_type === 'hybrid' ? 'היברידי' : 
                   vehicle.fuel_type === 'electric' ? 'חשמלי' : '-';
  const statusLabel = vehicle.status === 'available' ? 'זמין' : 
                     vehicle.status === 'sold' ? 'נמכר' : 'לא פעיל';

  return (
    <div className="space-y-4">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-3 space-x-reverse mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-foreground hebrew-text">
          פרטי רכב
        </h1>
      </div>

      {/* Vehicle Images with Carousel */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-64 overflow-hidden rounded-lg">
            <img
              src={images[currentImageIndex]}
              alt={`${vehicle.make?.name_hebrew} ${vehicle.model?.name_hebrew}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge variant="secondary" className="hebrew-text">
                {statusLabel}
              </Badge>
              {vehicle.is_boosted && (
                <Badge className="bg-orange-500 text-white hebrew-text">
                  מבוסט
                </Badge>
              )}
            </div>
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full ${
                        idx === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Title and Price */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground hebrew-text">
                {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} {vehicle.year}
              </h2>
              {vehicle.is_boosted && vehicle.boosted_until && (
                <p className="text-sm text-orange-500 hebrew-text mt-1">
                  מבוסט עד: {new Date(vehicle.boosted_until).toLocaleDateString('he-IL')}
                </p>
              )}
            </div>
            <div className="text-left">
              {vehicle.hot_sale_price && vehicle.is_boosted ? (
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <Badge className="bg-orange-500 text-white hebrew-text">מבצע חם!</Badge>
                  </div>
                  <p className="text-3xl font-bold text-orange-500 hebrew-text">
                    {parseFloat(vehicle.hot_sale_price.toString()).toLocaleString()} ₪
                  </p>
                  <p className="text-lg text-muted-foreground line-through hebrew-text">
                    {parseFloat(vehicle.price.toString()).toLocaleString()} ₪
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-primary hebrew-text">
                    {parseFloat(vehicle.price.toString()).toLocaleString()} ₪
                  </p>
                  <p className="text-sm text-muted-foreground hebrew-text">
                    ניתן למשא ומתן
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground flex-wrap gap-2">
            <div className="flex items-center space-x-1 space-x-reverse">
              <Calendar className="h-4 w-4" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <Gauge className="h-4 w-4" />
              <span>{vehicle.kilometers?.toLocaleString()} ק״מ</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">מפרט טכני</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">שנת ייצור</p>
              <p className="font-medium text-foreground">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">קילומטרז׳</p>
              <p className="font-medium text-foreground">{vehicle.kilometers?.toLocaleString()} ק״מ</p>
            </div>
            {vehicle.transmission && (
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">תיבת הילוכים</p>
                <p className="font-medium text-foreground hebrew-text">{transmissionLabel}</p>
              </div>
            )}
            {vehicle.fuel_type && (
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">סוג דלק</p>
                <p className="font-medium text-foreground hebrew-text">{fuelLabel}</p>
              </div>
            )}
            {vehicle.engine_size && (
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">נפח מנוע</p>
                <p className="font-medium text-foreground hebrew-text">{vehicle.engine_size.toLocaleString()} סמ״ק</p>
              </div>
            )}
            {vehicle.sub_model && (
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">סוג</p>
                <p className="font-medium text-foreground hebrew-text">{getVehicleTypeLabel(vehicle.sub_model)}</p>
              </div>
            )}
            {vehicle.color && (
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">צבע</p>
                <p className="font-medium text-foreground hebrew-text">{vehicle.color}</p>
              </div>
            )}
            {vehicle.previous_owners && (
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">בעלים קודמים</p>
                <p className="font-medium text-foreground">{vehicle.previous_owners}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {vehicle.description && (
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">תיאור</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground hebrew-text leading-relaxed">
              {vehicle.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tags Section */}
      {vehicle.vehicle_listing_tags && vehicle.vehicle_listing_tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">תגיות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {vehicle.vehicle_listing_tags.map((vlt: any) => (
                <Badge
                  key={vlt.tag.id}
                  style={{ 
                    backgroundColor: vlt.tag.color || '#6B7280',
                    borderColor: vlt.tag.color || '#6B7280'
                  }}
                  className="text-white"
                >
                  {vlt.tag.name_hebrew}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Condition & History */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">מצב ורקע הרכב</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">תאונה חמורה</p>
              <p className="font-medium text-foreground hebrew-text">
                {vehicle.had_severe_crash ? 'כן' : 'לא'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">בעלים קודמים</p>
              <p className="font-medium text-foreground">{vehicle.previous_owners || '-'}</p>
            </div>
          </div>
          
          {vehicle.test_result_file_url && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground hebrew-text mb-2">קובץ תוצאות טסט</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full hebrew-text"
                onClick={() => window.open(vehicle.test_result_file_url, '_blank')}
              >
                צפה בקובץ הטסט
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditional Actions Based on Ownership */}
      {isOwnVehicle ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => navigate(`/mobile/vehicle/${id}/edit`)}
              >
                <Edit className="h-4 w-4 ml-2" />
                ערוך רכב
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/mobile/boost-management')}
              >
                <Flame className="h-4 w-4 ml-2" />
                בוסט
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        vehicle.owner_id && (
          <DealerCard
            dealerId={vehicle.owner_id}
            isRevealed={true}
            showChatButton={true}
            showPhoneButton={true}
            onChatClick={handleContactSeller}
          />
        )
      )}
    </div>
  );
};

export default VehicleDetailScreen;