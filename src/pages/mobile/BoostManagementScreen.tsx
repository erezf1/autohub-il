import { useState } from "react";
import { Flame, Plus, X, Loader2 } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useBoosts } from "@/hooks/mobile/useBoosts";
import { useProfile } from "@/hooks/mobile/useProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import darkCarImage from "@/assets/dark_car.png";
import { toast } from "@/hooks/use-toast";

export const BoostManagementScreen = () => {
  const navigate = useNavigate();
  const { 
    myVehicles, 
    isLoadingMy, 
    availableBoosts, 
    activateBoost, 
    isActivating,
    deactivateBoost,
    isDeactivating 
  } = useBoosts();
  const { profile } = useProfile();

  const [boostDialogOpen, setBoostDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [hotSalePrice, setHotSalePrice] = useState("");
  const [durationDays, setDurationDays] = useState("7");

  const activeBoosted = myVehicles?.filter(v => v.is_boosted && v.boosted_until && new Date(v.boosted_until) > new Date()) || [];
  const eligibleVehicles = myVehicles?.filter(v => !v.is_boosted || !v.boosted_until || new Date(v.boosted_until) <= new Date()) || [];

  const handleOpenBoostDialog = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setHotSalePrice(vehicle.price.toString());
    setBoostDialogOpen(true);
  };

  const handleActivateBoost = () => {
    if (availableBoosts <= 0) {
      toast({
        title: "אין בוסטים זמינים",
        description: "השתמשת בכל הבוסטים שלך החודש. צור קשר עם המנהל לשדרוג מנוי",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVehicle) return;

    const hotPrice = parseFloat(hotSalePrice);
    const originalPrice = parseFloat(selectedVehicle.price.toString());

    if (isNaN(hotPrice) || hotPrice <= 0) {
      toast({
        title: "שגיאה",
        description: "אנא הזן מחיר תקין",
        variant: "destructive",
      });
      return;
    }

    if (hotPrice >= originalPrice) {
      toast({
        title: "שגיאה",
        description: "מחיר המבצע חייב להיות נמוך ממחיר המקורי",
        variant: "destructive",
      });
      return;
    }

    activateBoost({
      vehicleId: selectedVehicle.id,
      hotSalePrice: hotPrice,
      durationDays: parseInt(durationDays),
    });

    setBoostDialogOpen(false);
  };

  const getRemainingTime = (boostedUntil: string) => {
    const now = new Date();
    const end = new Date(boostedUntil);
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "מסתיים היום";
    if (diffDays === 1) return "יום אחד נותר";
    return `${diffDays} ימים נותרים`;
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div 
          onClick={() => navigate('/mobile/hot-cars')}
          className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
        >
          <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-foreground hebrew-text">ניהול בוסטים</h1>
        </div>
      </div>

      {/* Boost Credits */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">בוסטים נותרים החודש</p>
              <p className="text-3xl font-bold text-orange-600">{availableBoosts}</p>
            </div>
            <Flame className="h-12 w-12 text-orange-500" />
          </div>
          <p className="text-sm text-muted-foreground hebrew-text mt-4">
            הבוסטים מתאפסים בתחילת כל חודש לפי המנוי שלך
          </p>
        </CardContent>
      </Card>

      {/* Subscription Info */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground hebrew-text">סוג מנוי:</span>
              <span className="font-semibold hebrew-text">
                {profile?.subscription_type === 'silver' ? 'כסף (5 בוסטים/חודש)' : 
                 profile?.subscription_type === 'unlimited' ? 'בלתי מוגבל (10 בוסטים/חודש)' :
                 'רגיל (ללא בוסטים)'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground hebrew-text">
              לשדרוג מנוי או הוספת בוסטים, צור קשר עם המנהל
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Boosts */}
      {activeBoosted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">בוסטים פעילים ({activeBoosted.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeBoosted.map((vehicle) => (
              <div key={vehicle.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <img
                  src={vehicle.images?.[0] || darkCarImage}
                  alt="vehicle"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold hebrew-text">
                    {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} {vehicle.year}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {getRemainingTime(vehicle.boosted_until)}
                    </Badge>
                    {vehicle.hot_sale_price && (
                      <span className="text-sm text-orange-600 font-semibold">
                        {parseFloat(vehicle.hot_sale_price.toString()).toLocaleString()} ₪
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deactivateBoost(vehicle.id)}
                  disabled={isDeactivating}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Eligible Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">רכבים זמינים לבוסט</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMy ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : eligibleVehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground hebrew-text mb-4">אין רכבים זמינים</p>
              <Button onClick={() => navigate('/mobile/add-vehicle')}>
                <Plus className="h-4 w-4 ml-2" />
                הוסף רכב
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {eligibleVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex gap-3 p-3 border rounded-lg">
                  <img
                    src={vehicle.images?.[0] || darkCarImage}
                    alt="vehicle"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold hebrew-text">
                      {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} {vehicle.year}
                    </h3>
                    <p className="text-sm text-muted-foreground hebrew-text mt-1">
                      {parseFloat(vehicle.price.toString()).toLocaleString()} ₪
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleOpenBoostDialog(vehicle)}
                    disabled={availableBoosts === 0}
                  >
                    <Flame className="h-4 w-4 ml-2" />
                    בוסט
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boost Dialog */}
      <Dialog open={boostDialogOpen} onOpenChange={setBoostDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="hebrew-text">הפעל בוסט</DialogTitle>
            <DialogDescription className="hebrew-text">
              הגדר מחיר מיוחד ומשך זמן למכירה החמה
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <img
                  src={selectedVehicle.images?.[0] || darkCarImage}
                  alt="vehicle"
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold hebrew-text">
                    {selectedVehicle.make?.name_hebrew} {selectedVehicle.model?.name_hebrew} {selectedVehicle.year}
                  </h3>
                  <p className="text-sm text-muted-foreground hebrew-text">
                    מחיר מקורי: {parseFloat(selectedVehicle.price.toString()).toLocaleString()} ₪
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hot-price" className="hebrew-text">מחיר למבצע החם</Label>
                <Input
                  id="hot-price"
                  type="number"
                  value={hotSalePrice}
                  onChange={(e) => setHotSalePrice(e.target.value)}
                  placeholder="הזן מחיר מופחת"
                />
                {hotSalePrice && parseFloat(hotSalePrice) < parseFloat(selectedVehicle.price.toString()) && (
                  <p className="text-sm text-success hebrew-text">
                    הנחה: {Math.round(((parseFloat(selectedVehicle.price.toString()) - parseFloat(hotSalePrice)) / parseFloat(selectedVehicle.price.toString())) * 100)}%
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="hebrew-text">משך הבוסט</Label>
                <Select value={durationDays} onValueChange={setDurationDays}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 ימים</SelectItem>
                    <SelectItem value="7">שבוע</SelectItem>
                    <SelectItem value="14">שבועיים</SelectItem>
                    <SelectItem value="30">חודש</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleActivateBoost}
                  disabled={isActivating}
                >
                  {isActivating ? <Loader2 className="h-4 w-4 animate-spin" /> : "הפעל בוסט"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBoostDialogOpen(false)}
                >
                  ביטול
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoostManagementScreen;
