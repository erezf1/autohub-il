import { useState, useEffect } from "react";
import { Clock, MapPin, CheckCircle, Loader2, Eye } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";
import { useNavigate, useParams } from "react-router-dom";
import { useISORequestById } from "@/hooks/mobile/useISORequests";
import { useOffersByRequestId, useCreateOffer, useUpdateOfferStatus, useMyVehiclesForOffer } from "@/hooks/mobile/useISOOffers";
import { dealerClient } from "@/integrations/supabase/dealerClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "default";
    case "accepted":
      return "secondary";
    case "rejected":
      return "destructive";
    default:
      return "default";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "ממתין לתגובה";
    case "accepted":
      return "התקבל";
    case "rejected":
      return "נדחה";
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'היום';
    if (diffInDays === 1) return 'אתמול';
    if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
    if (diffInDays < 30) return `לפני ${Math.floor(diffInDays / 7)} שבועות`;
    return `לפני ${Math.floor(diffInDays / 30)} חודשים`;
  } catch {
    return dateString;
  }
};

const ISORequestDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offeredPrice, setOfferedPrice] = useState("");

  const { data: request, isLoading: isLoadingRequest } = useISORequestById(id);
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await dealerClient.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const isOwner = currentUserId && request?.requester_id === currentUserId;
  
  const { data: offers = [], isLoading: isLoadingOffers } = useOffersByRequestId(id, !!isOwner);
  const { data: myVehicles = [] } = useMyVehiclesForOffer();
  const createOffer = useCreateOffer();
  const updateOfferStatus = useUpdateOfferStatus();

  const handleBackClick = () => {
    navigate("/mobile/required-cars");
  };

  const handleSubmitOffer = async () => {
    if (!selectedVehicleId || !offeredPrice) {
      return;
    }

    await createOffer.mutateAsync({
      iso_request_id: id!,
      vehicle_id: selectedVehicleId,
      offered_price: parseFloat(offeredPrice),
      message: offerMessage || undefined,
    });

    setSelectedVehicleId("");
    setOfferMessage("");
    setOfferedPrice("");
  };

  const handleAcceptOffer = async (offerId: string) => {
    await updateOfferStatus.mutateAsync({ offerId, status: "accepted" });
  };

  const handleRejectOffer = async (offerId: string) => {
    await updateOfferStatus.mutateAsync({ offerId, status: "rejected" });
  };

  const handleViewVehicle = (vehicleId: string) => {
    navigate(`/mobile/vehicle/${vehicleId}`);
  };

  if (isLoadingRequest) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground hebrew-text">בקשה לא נמצאה</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center space-x-3 space-x-reverse">
        <div 
          onClick={handleBackClick}
          className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
        >
          <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
        </div>
        <h1 className="text-xl font-semibold text-white hebrew-text">פרטי בקשת חיפוש</h1>
      </div>

      {/* Request Overview */}
      <GradientBorderContainer className="rounded-lg">
        <Card className="bg-black border-0 rounded-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg text-white hebrew-text">{request.title}</CardTitle>
                <div className="flex items-center space-x-4 space-x-reverse mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 ml-1" />
                    <span className="hebrew-text">{formatDate(request.created_at)}</span>
                  </div>
                  {request.locations?.name_hebrew && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 ml-1" />
                      <span className="hebrew-text">{request.locations.name_hebrew}</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="default" className="hebrew-text">
                {request.status === 'active' ? 'פעיל' : 'הושלם'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <GradientSeparator />

              {request.description && (
                <>
                  <div>
                    <h4 className="font-medium text-white hebrew-text mb-2">תיאור הבקשה</h4>
                    <p className="text-muted-foreground text-sm hebrew-text">{request.description}</p>
                  </div>
                  <GradientSeparator />
                </>
              )}

              <div className="flex items-center gap-2 justify-start w-full text-right">
                <h4 className="font-medium text-white hebrew-text m-0">תקציב:</h4>
                <p className="text-primary font-semibold hebrew-text m-0">
                  {request.price_from && request.price_to 
                    ? `₪${request.price_from.toLocaleString()} - ₪${request.price_to.toLocaleString()}`
                    : request.price_from 
                    ? `מ-₪${request.price_from.toLocaleString()}`
                    : request.price_to
                    ? `עד ₪${request.price_to.toLocaleString()}`
                    : 'לא צוין'}
                </p>
              </div>

              <GradientSeparator />

              <div>
                <h4 className="font-medium text-white hebrew-text mb-2">דרישות</h4>
                <ul className="space-y-1">
                  {request.year_from && request.year_to && (
                    <li className="text-sm text-muted-foreground hebrew-text flex items-center">
                      <CheckCircle className="h-3 w-3 text-primary ml-2 flex-shrink-0" />
                      שנת ייצור: {request.year_from}-{request.year_to}
                    </li>
                  )}
                  {request.max_kilometers && (
                    <li className="text-sm text-muted-foreground hebrew-text flex items-center">
                      <CheckCircle className="h-3 w-3 text-primary ml-2 flex-shrink-0" />
                      קילומטרז': עד {request.max_kilometers.toLocaleString()} ק"מ
                    </li>
                  )}
                  {request.transmission_preference && request.transmission_preference !== 'any' && (
                    <li className="text-sm text-muted-foreground hebrew-text flex items-center">
                      <CheckCircle className="h-3 w-3 text-primary ml-2 flex-shrink-0" />
                      תיבת הילוכים: {request.transmission_preference === 'automatic' ? 'אוטומט' : 'ידני'}
                    </li>
                  )}
                  {request.fuel_type_preference && request.fuel_type_preference !== 'any' && (
                    <li className="text-sm text-muted-foreground hebrew-text flex items-center">
                      <CheckCircle className="h-3 w-3 text-primary ml-2 flex-shrink-0" />
                      סוג דלק: {request.fuel_type_preference}
                    </li>
                  )}
                  {request.additional_requirements && (
                    <li className="text-sm text-muted-foreground hebrew-text flex items-center">
                      <CheckCircle className="h-3 w-3 text-primary ml-2 flex-shrink-0" />
                      {request.additional_requirements}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Offers Section - Only visible to request owner */}
      {isOwner && (
        <GradientBorderContainer className="rounded-lg">
          <Card className="bg-black border-0 rounded-lg">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">הצעות שהתקבלו ({offers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOffers ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : offers.length > 0 ? (
                <div className="space-y-3">
                  {offers.map((offer: any) => (
                    <GradientBorderContainer key={offer.id} className="rounded-md">
                      <div className="bg-black border-0 rounded-md p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-medium text-white hebrew-text">
                              {offer.user_profiles?.business_name || offer.user_profiles?.full_name}
                            </h5>
                            <div 
                              onClick={() => handleViewVehicle(offer.vehicle_listings?.id)}
                              className="text-sm text-muted-foreground hebrew-text cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              {offer.vehicle_listings?.vehicle_makes?.name_hebrew} {offer.vehicle_listings?.vehicle_models?.name_hebrew}
                            </div>
                          </div>
                          <Badge variant={getStatusColor(offer.status)} className="hebrew-text">
                            {getStatusText(offer.status)}
                          </Badge>
                        </div>
                      
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="space-y-1">
                            <p className="text-primary font-semibold hebrew-text">
                              ₪{offer.offered_price?.toLocaleString()}
                            </p>
                            <p className="text-muted-foreground hebrew-text">
                              {offer.vehicle_listings?.kilometers?.toLocaleString()} ק"מ
                            </p>
                          </div>
                          <p className="text-muted-foreground hebrew-text">{formatDate(offer.created_at)}</p>
                        </div>

                        {offer.message && (
                          <p className="text-sm text-muted-foreground hebrew-text mb-3 p-2 bg-gray-900 rounded">
                            {offer.message}
                          </p>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewVehicle(offer.vehicle_listings?.id)}
                          className="w-full mb-3 hebrew-text"
                        >
                          <Eye className="h-4 w-4 ml-2" />
                          צפה ברכב
                        </Button>

                        {offer.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptOffer(offer.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              אשר
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectOffer(offer.id)}
                              className="flex-1"
                            >
                              דחה
                            </Button>
                          </div>
                        )}
                      </div>
                    </GradientBorderContainer>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground hebrew-text py-4">
                  עדיין לא התקבלו הצעות
                </p>
              )}
            </CardContent>
          </Card>
        </GradientBorderContainer>
      )}

      {/* Submit Offer Section - Only visible to non-owners */}
      {!isOwner && (
        <GradientBorderContainer className="rounded-lg">
          <Card className="bg-black border-0 rounded-lg">
            <CardHeader>
              <CardTitle className="text-white hebrew-text">הגש הצעה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-white hebrew-text">בחר רכב *</label>
                    {selectedVehicleId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewVehicle(selectedVehicleId)}
                        className="text-xs text-primary hover:text-primary/80 h-auto p-1"
                      >
                        <Eye className="h-3 w-3 ml-1" />
                        צפה בפרטים
                      </Button>
                    )}
                  </div>
                  <GradientBorderContainer className="rounded-md">
                    <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                      <SelectTrigger className="bg-black border-0 text-white">
                        <SelectValue placeholder="בחר רכב מהמלאי שלך" />
                      </SelectTrigger>
                      <SelectContent>
                        {myVehicles.map((vehicle: any) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.vehicle_makes?.name_hebrew} {vehicle.vehicle_models?.name_hebrew} ({vehicle.year})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GradientBorderContainer>
                </div>

                <div>
                  <label className="text-sm text-white hebrew-text mb-2 block">מחיר מוצע *</label>
                  <GradientBorderContainer className="rounded-md">
                    <input
                      type="number"
                      placeholder="הכנס מחיר בשקלים"
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(e.target.value)}
                      className="w-full bg-black border-0 text-white p-2 rounded hebrew-text"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                </div>

                <div>
                  <label className="text-sm text-white hebrew-text mb-2 block">הודעה (אופציונלי)</label>
                  <GradientBorderContainer className="rounded-md">
                    <Textarea
                      placeholder="פרטים נוספים על הרכב..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      className="bg-black border-0 hebrew-text text-right"
                      rows={3}
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                </div>

                <GradientBorderContainer className="rounded-md">
                  <Button 
                    onClick={handleSubmitOffer}
                    disabled={!selectedVehicleId || !offeredPrice || createOffer.isPending}
                    className="bg-black border-0 w-full hebrew-text"
                  >
                    {createOffer.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        שולח...
                      </>
                    ) : (
                      'שלח הצעה'
                    )}
                  </Button>
                </GradientBorderContainer>
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>
      )}
    </div>
  );
};

export default ISORequestDetailScreen;