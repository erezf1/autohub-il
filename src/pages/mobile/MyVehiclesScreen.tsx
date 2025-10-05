import { ArrowRight, Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "@/hooks/mobile/useVehicles";
import darkCarImage from "@/assets/dark_car.png";
import { Badge } from "@/components/ui/badge";

const MyVehiclesScreen = () => {
  const navigate = useNavigate();
  const { myVehicles, isLoading } = useVehicles();

  const handleBackClick = () => {
    navigate('/mobile/search');
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackClick}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground hebrew-text">הרכבים שלי</h1>
        </div>
        <Button onClick={() => navigate('/mobile/add-vehicle')}>
          <Plus className="h-4 w-4 ml-2" />
          הוסף רכב
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : myVehicles && myVehicles.length > 0 ? (
        <div className="space-y-3">
          {myVehicles.map((vehicle) => {
            const transmissionLabel = vehicle.transmission === 'automatic' ? 'אוטומט' : 
                                     vehicle.transmission === 'manual' ? 'ידנית' : 'טיפטרוניק';
            const fuelLabel = vehicle.fuel_type === 'gasoline' ? 'בנזין' :
                             vehicle.fuel_type === 'diesel' ? 'דיזל' :
                             vehicle.fuel_type === 'hybrid' ? 'היברידי' : 'חשמלי';
            const statusLabel = vehicle.status === 'available' ? 'זמין' : 
                               vehicle.status === 'sold' ? 'נמכר' : 'לא פעיל';
            
            return (
              <Card 
                key={vehicle.id}
                className="card-interactive cursor-pointer"
                onClick={() => navigate(`/mobile/vehicle/${vehicle.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex h-32">
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-r-lg">
                      <img
                        src={vehicle.images?.[0] || darkCarImage}
                        alt={`${vehicle.make?.name_hebrew} ${vehicle.model?.name_hebrew}`}
                        className="w-full h-full object-cover"
                      />
                      {vehicle.is_boosted && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          מבוסט
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-foreground hebrew-text">
                            {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} {vehicle.year}
                          </h3>
                          <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                            {statusLabel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground hebrew-text">
                          {vehicle.kilometers?.toLocaleString()} ק״מ • {transmissionLabel} • {fuelLabel}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary hebrew-text">
                          {parseFloat(vehicle.price.toString()).toLocaleString()} ₪
                        </p>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/mobile/vehicle/${vehicle.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold hebrew-text mb-2">אין לך רכבים עדיין</h3>
              <p className="text-muted-foreground hebrew-text mb-4">
                התחל למכור רכבים על ידי הוספת הרכב הראשון שלך
              </p>
              <Button onClick={() => navigate('/mobile/add-vehicle')}>
                <Plus className="h-4 w-4 ml-2" />
                הוסף רכב ראשון
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyVehiclesScreen;
