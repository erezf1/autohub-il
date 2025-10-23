import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";

interface VehicleSpec {
  label: string;
  value: string | number;
  unit?: string;
}

interface VehicleSpecsCardProps {
  rows: {
    col1?: VehicleSpec;
    col2?: VehicleSpec;
  }[];
}

const VehicleSpecsCard = ({ rows }: VehicleSpecsCardProps) => {
  return (
    <GradientBorderContainer className="rounded-md">
      <Card className="bg-black border-0 rounded-md">
        <CardHeader>
          <CardTitle className="hebrew-text text-white">מפרט טכני</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex}>
              <div className="grid grid-cols-2 gap-4 py-3 relative">
                {row.col1 && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      {row.col1.unit && (
                        <p className="text-xs text-muted-foreground hebrew-text absolute -top-4 right-0">({row.col1.unit})</p>
                      )}
                      <p className="text-sm text-muted-foreground hebrew-text">{row.col1.label}</p>
                    </div>
                    <p className="font-medium text-white">{row.col1.value}</p>
                  </div>
                )}
                {row.col2 && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      {row.col2.unit && (
                        <p className="text-xs text-muted-foreground hebrew-text absolute -top-4 right-0">({row.col2.unit})</p>
                      )}
                      <p className="text-sm text-muted-foreground hebrew-text">{row.col2.label}</p>
                    </div>
                    <p className="font-medium text-white">{row.col2.value}</p>
                  </div>
                )}
              </div>
              {rowIndex < rows.length - 1 && <GradientSeparator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </GradientBorderContainer>
  );
};

export default VehicleSpecsCard;
