import { Car, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Vehicle {
  id: string;
  make?: { name_hebrew: string };
  model?: { name_hebrew: string };
  year: number;
  price: number;
  images?: string[];
}

interface VehicleSelectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  isLoading: boolean;
}

export const VehicleSelectionDrawer = ({
  open,
  onOpenChange,
  vehicles,
  onSelectVehicle,
  isLoading,
}: VehicleSelectionDrawerProps) => {
  const navigate = useNavigate();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="hebrew-text text-right">בחר רכב לבוסט</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Car className="h-16 w-16 text-muted-foreground/30 mx-auto" />
              <div className="space-y-2">
                <p className="text-foreground hebrew-text font-medium">אין רכבים זמינים לבוסט</p>
                <p className="text-sm text-muted-foreground hebrew-text">
                  כל הרכבים שלך כבר מבוסטים או שאין לך רכבים
                </p>
              </div>
              <GradientBorderContainer className="rounded-md inline-block">
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/mobile/add-vehicle');
                  }}
                  className="border-0"
                >
                  הוסף רכב חדש
                </Button>
              </GradientBorderContainer>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <GradientBorderContainer key={vehicle.id} className="rounded-lg">
                  <div
                    className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      onSelectVehicle(vehicle);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {vehicle.images && vehicle.images.length > 0 ? (
                          <img
                            src={vehicle.images[0]}
                            alt={`${vehicle.make?.name_hebrew} ${vehicle.model?.name_hebrew}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Car className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-semibold hebrew-text">
                          {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew}
                        </h3>
                        <p className="text-sm text-muted-foreground hebrew-text">
                          שנת {vehicle.year}
                        </p>
                        <p className="text-lg font-bold text-primary hebrew-text mt-1">
                          ₪{vehicle.price.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="hebrew-text">
                        בחר
                      </Button>
                    </div>
                  </div>
                </GradientBorderContainer>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
