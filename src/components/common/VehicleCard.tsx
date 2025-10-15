import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import darkCarImage from "@/assets/dark_car.png";

interface VehicleCardProps {
  id: string;
  images?: string[] | null;
  makeName: string;
  modelName: string;
  year: number;
  kilometers?: number;
  transmission?: string;
  fuelType?: string;
  price: number | string;
  hotSalePrice?: number | string | null;
  isBoosted?: boolean;
  boostedUntil?: string | null;
  onClick: () => void;
}

export const VehicleCard = ({
  images,
  makeName,
  modelName,
  year,
  kilometers,
  transmission,
  fuelType,
  price,
  hotSalePrice,
  isBoosted,
  boostedUntil,
  onClick,
}: VehicleCardProps) => {
  const transmissionLabel = transmission === 'automatic' ? 'אוטומט' : 
                           transmission === 'manual' ? 'ידנית' : 'טיפטרוניק';
  const fuelLabel = fuelType === 'gasoline' ? 'בנזין' :
                   fuelType === 'diesel' ? 'דיזל' :
                   fuelType === 'hybrid' ? 'היברידי' : 'חשמלי';

  const originalPrice = typeof price === 'string' ? parseFloat(price) : price;
  const hotPrice = hotSalePrice ? (typeof hotSalePrice === 'string' ? parseFloat(hotSalePrice) : hotSalePrice) : null;
  const isHotSale = isBoosted && boostedUntil && new Date(boostedUntil) > new Date() && hotPrice;

  return (
    <Card 
      className="card-interactive cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex h-32">
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-r-lg">
            <img
              src={images?.[0] || darkCarImage}
              alt={`${makeName} ${modelName}`}
              className="w-full h-full object-cover"
            />
            {isHotSale && (
              <Badge className="absolute top-2 left-2 bg-orange-500">
                🔥 Hot Sale
              </Badge>
            )}
          </div>

          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-foreground hebrew-text mb-1">
                {makeName} {modelName} {year}
              </h3>
              <p className="text-sm text-muted-foreground hebrew-text">
                {kilometers?.toLocaleString()} ק״מ • {transmissionLabel} • {fuelLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isHotSale && hotPrice ? (
                <>
                  <p className="text-lg font-bold text-orange-600 hebrew-text">
                    {hotPrice.toLocaleString('he-IL')} ₪
                  </p>
                  <p className="text-sm text-muted-foreground line-through hebrew-text">
                    {originalPrice.toLocaleString('he-IL')} ₪
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-primary hebrew-text">
                  {originalPrice.toLocaleString('he-IL')} ₪
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
