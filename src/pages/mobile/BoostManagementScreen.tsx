import { useState } from "react";
import { Flame, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useNavigate } from "react-router-dom";
import { useBoosts } from "@/hooks/mobile/useBoosts";
import { useProfile } from "@/hooks/mobile/useProfile";
import { PageContainer, PageHeader } from "@/components/common";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { VehicleSelectionDrawer } from "@/components/mobile/VehicleSelectionDrawer";

interface Vehicle {
  id: string;
  make?: { name_hebrew: string };
  model?: { name_hebrew: string };
  year: number;
  price: number;
  hot_sale_price?: number | null;
  boosted_until?: string | null;
  images?: string[];
}

export const BoostManagementScreen = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { 
    myActiveBoostedVehicles,
    myVehicles, 
    availableBoosts, 
    isLoadingActive,
    isLoadingMy,
    activateBoost, 
    deactivateBoost,
    isActivating,
    isDeactivating 
  } = useBoosts();

  const [vehicleSelectionDrawerOpen, setVehicleSelectionDrawerOpen] = useState(false);
  const [boostDialogOpen, setBoostDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [hotSalePrice, setHotSalePrice] = useState<string>("");

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setHotSalePrice(vehicle.price.toString());
    setBoostDialogOpen(true);
  };

  const handleActivateBoost = () => {
    if (!selectedVehicle) return;

    if (availableBoosts <= 0) {
      toast.error("אין בוסטים זמינים", {
        description: "שדרג את המנוי שלך כדי לקבל יותר בוסטים"
      });
      return;
    }

    const originalPrice = Number(selectedVehicle.price);
    const enteredPrice = hotSalePrice.trim() === '' ? null : Number(hotSalePrice);

    if (enteredPrice !== null && (isNaN(enteredPrice) || enteredPrice <= 0)) {
      toast.error("מחיר לא תקין");
      return;
    }

    const priceToUse = (enteredPrice === null || enteredPrice === originalPrice) ? null : enteredPrice;

    activateBoost(
      { vehicleId: selectedVehicle.id, hotSalePrice: priceToUse },
      {
        onSuccess: () => {
          setBoostDialogOpen(false);
          setSelectedVehicle(null);
          setHotSalePrice("");
        }
      }
    );
  };

  const getRemainingTime = (boostedUntil?: string | null) => {
    if (!boostedUntil) return "";
    
    const now = new Date();
    const end = new Date(boostedUntil);
    const diffMs = end.getTime() - now.getTime();
    
    if (diffMs <= 0) return "פג תוקף";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'יום' : 'ימים'} נותרים`;
    }
    return `${diffHours} ${diffHours === 1 ? 'שעה' : 'שעות'} נותרות`;
  };

  const totalBoosts = profile?.plan?.monthly_boosts || 0;
  const boostProgress = totalBoosts > 0 ? (availableBoosts / totalBoosts) * 100 : 0;

  return (
    <PageContainer>
      <PageHeader
        title="הבוסטים שלי"
        onBack={() => navigate('/mobile/dashboard')}
        rightAction={
          <GradientBorderContainer className="rounded-md">
            <Button
              onClick={() => setVehicleSelectionDrawerOpen(true)}
              variant="outline"
              className="border-0"
            >
              <Flame className="w-4 h-4 ml-2" />
              <Plus className="w-4 h-4 ml-1" />
              בוסט חדש
            </Button>
          </GradientBorderContainer>
        }
      />

      {/* Active Boosts Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold hebrew-text mb-4">הבוסטים הפעילים שלי</h2>
        
        {isLoadingActive ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : myActiveBoostedVehicles.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Flame className="h-16 w-16 text-orange-500/30 mx-auto" />
            <div className="space-y-2">
              <p className="text-foreground hebrew-text font-medium">אין בוסטים פעילים</p>
              <p className="text-sm text-muted-foreground hebrew-text">
                הפעל בוסט כדי להגביר את החשיפה של הרכבים שלך
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {myActiveBoostedVehicles.map((vehicle) => (
              <GradientBorderContainer key={vehicle.id} className="rounded-lg">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.make?.name_hebrew} ${vehicle.model?.name_hebrew}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Flame className="h-8 w-8 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-semibold hebrew-text">
                        {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew}
                      </h3>
                      <p className="text-sm text-muted-foreground hebrew-text">
                        שנת {vehicle.year}
                      </p>
                      <p className="text-sm text-orange-500 hebrew-text font-medium mt-1">
                        {getRemainingTime(vehicle.boosted_until)}
                      </p>
                      {vehicle.hot_sale_price && (
                        <p className="text-lg font-bold text-primary hebrew-text">
                          ₪{vehicle.hot_sale_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deactivateBoost(vehicle.id)}
                      disabled={isDeactivating}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </GradientBorderContainer>
            ))}
          </div>
        )}
      </div>

      {/* Subscription Info Card */}
      <GradientBorderContainer className="rounded-lg">
        <div className="p-4 text-center space-y-2">
          <p className="text-sm hebrew-text">
            <span className="font-semibold">סוג מנוי:</span> {profile?.plan?.name_hebrew || 'רגיל'}
          </p>
          <p className="text-sm text-muted-foreground hebrew-text">
            ({totalBoosts} בוסטים בחודש)
          </p>
          <p className="text-xs text-muted-foreground hebrew-text mt-2">
            לשדרוג מנוי, צור קשר עם המנהל
          </p>
        </div>
      </GradientBorderContainer>

      {/* Vehicle Selection Drawer */}
      <VehicleSelectionDrawer
        open={vehicleSelectionDrawerOpen}
        onOpenChange={setVehicleSelectionDrawerOpen}
        vehicles={myVehicles}
        onSelectVehicle={handleSelectVehicle}
        isLoading={isLoadingMy}
        availableBoosts={availableBoosts}
        totalBoosts={totalBoosts}
        planName={profile?.plan?.name_hebrew || 'רגיל'}
      />

      {/* Boost Configuration Dialog */}
      <Dialog open={boostDialogOpen} onOpenChange={setBoostDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="hebrew-text text-right">הפעלת בוסט</DialogTitle>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-4 py-4">
              <div className="text-right space-y-2">
                <p className="font-semibold hebrew-text">
                  {selectedVehicle.make?.name_hebrew} {selectedVehicle.model?.name_hebrew}
                </p>
                <p className="text-sm text-muted-foreground hebrew-text">
                  מחיר מקורי: ₪{selectedVehicle.price.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hot-sale-price" className="text-right hebrew-text">
                  מחיר מבצע (אופציונלי)
                </Label>
                <Input
                  id="hot-sale-price"
                  type="number"
                  value={hotSalePrice}
                  onChange={(e) => setHotSalePrice(e.target.value)}
                  placeholder="הזן מחיר מבצע"
                  className="text-right hebrew-text"
                  dir="rtl"
                />
                <p className="text-xs text-muted-foreground hebrew-text text-right">
                  השאר כמו המחיר המקורי אם אין הנחה
                </p>
              </div>

              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground hebrew-text text-right">
                  ⏱️ משך הבוסט: 5 ימים
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-row-reverse gap-2">
            <Button
              onClick={handleActivateBoost}
              disabled={isActivating}
              className="flex-1 hebrew-text"
            >
              {isActivating ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  מפעיל...
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4 ml-2" />
                  הפעל בוסט
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setBoostDialogOpen(false)}
              disabled={isActivating}
              className="flex-1 hebrew-text"
            >
              ביטול
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default BoostManagementScreen;
