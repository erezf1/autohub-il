import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import darkCarImage from "@/assets/dark_car.png";
import miniArrowIcon from "@/assets/miniArrow.svg";

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
  isPrivateListing?: boolean;
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
  isPrivateListing,
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
    <div 
      className="card-interactive cursor-pointer"
      onClick={onClick}
    >
      <GradientBorderContainer className="rounded-md flex-1">
        <div 
          className="bg-black overflow-hidden h-full shadow-sm relative"
          style={{ borderRadius: 'calc(var(--radius) - 1px)' }}
        >
        <div 
          className="flex h-32"
          style={{ borderRadius: 'calc(var(--radius) - 1px)' }}
        >
            <div 
              className="relative w-32 h-32 flex-shrink-0 overflow-hidden"
              style={{ borderRadius: 'calc(var(--radius) - 1px) 0 0 calc(var(--radius) - 1px)' }}
            >
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
              {isPrivateListing && (
                <Badge className="absolute top-2 right-2 bg-purple-600 text-white">
                  מפרטי
                </Badge>
              )}
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-foreground hebrew-text mb-1 flex items-center gap-2">
                  <SuperArrowsIcon className="w-4 h-4 transform scale-x-[-1]" />
                  {makeName} {modelName} {year}
                </h3>
                <p className="text-sm text-white hebrew-text">
                  {kilometers?.toLocaleString()} ק״מ • {transmissionLabel} • {fuelLabel}
                </p>
              </div>
            </div>

            {/* Price Capsule at the bottom */}
            <div className="absolute left-2 bottom-2 z-10">
              <div className="flex rounded-full overflow-hidden" style={{ backgroundColor: '#01394f' }}>
                {/* Left side with price - 80% */}
                <div className="px-4 py-0 flex items-center">
                  {isHotSale && hotPrice ? (
                    <div className="flex flex-col items-start">
                      <div className="flex items-baseline gap-0">
                        <p className="text-xl font-black text-orange-400 hebrew-text leading-none">
                          {hotPrice.toLocaleString('he-IL')}
                        </p>
                        <span className="text-sm font-black text-orange-300">₪</span>
                      </div>
                      <div className="flex items-baseline gap-0">
                        <p className="text-base text-gray-400 line-through hebrew-text leading-none">
                          {originalPrice.toLocaleString('he-IL')}
                        </p>
                        <span className="text-xs font-black text-gray-500">₪</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-0">
                      <p className="text-xl font-black text-white hebrew-text leading-none">
                        {originalPrice.toLocaleString('he-IL')}
                      </p>
                      <span className="text-sm font-black text-gray-300">₪</span>
                    </div>
                  )}
                </div>
                {/* Right side with gradient and arrow - 20% */}
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-[#2277ee] to-[#5be1fd]">
                  <img 
                    src={miniArrowIcon} 
                    alt="arrow" 
                    className="w-3 h-3"
                    style={{ filter: 'brightness(0) saturate(100%) invert(0%) sepia(83%) saturate(3594%) hue-rotate(174deg) brightness(95%) contrast(100%)' }}
                  />
                </div>
              </div>
            </div>
            </div>
        </div>
      </GradientBorderContainer>
    </div>
  );
};