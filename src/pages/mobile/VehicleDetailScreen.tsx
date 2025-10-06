import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Phone, Star, MapPin, Calendar, Gauge, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import darkCarImage from "@/assets/dark_car.png";
import { useState } from "react";

const VehicleDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch vehicle data
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .eq('id', id)
        .single();
      
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
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, business_name')
        .eq('id', vehicle.owner_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!vehicle?.owner_id,
  });

  const handleBackClick = () => {
    navigate("/mobile/search");
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
            <Badge variant="secondary" className="absolute top-2 right-2 hebrew-text">
              {statusLabel}
            </Badge>
            
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
            <h2 className="text-2xl font-bold text-foreground hebrew-text">
              {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} {vehicle.year}
            </h2>
            <div className="text-left">
              <p className="text-2xl font-bold text-primary hebrew-text">
                {parseFloat(vehicle.price.toString()).toLocaleString()} ₪
              </p>
              <p className="text-sm text-muted-foreground hebrew-text">
                ניתן למשא ומתן
              </p>
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
                <p className="font-medium text-foreground">{vehicle.engine_size}</p>
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

      {/* Seller Information */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">פרטי המוכר</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 space-x-reverse mb-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(ownerProfile?.business_name || ownerProfile?.full_name || 'M').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground hebrew-text">
                {ownerProfile?.business_name || ownerProfile?.full_name || 'סוחר'}
              </h3>
            </div>
          </div>
          
          <div className="flex space-x-2 space-x-reverse">
            <Button 
              className="flex-1"
              onClick={handleContactSeller}
            >
              <MessageCircle className="h-4 w-4 ml-2" />
              <span className="hebrew-text">שלח הודעה</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetailScreen;