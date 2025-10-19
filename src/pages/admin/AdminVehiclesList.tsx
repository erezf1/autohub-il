import { useState } from "react";
import { Car, Eye, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { useAdminVehicles } from "@/hooks/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminVehicleFilterBar } from "@/components/admin";
import { AdminVehicleFilters, applyAdminVehicleFilters } from "@/utils/admin/vehicleFilters";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const AdminVehiclesList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AdminVehicleFilters>({});
  const { vehicles, isLoading } = useAdminVehicles();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "זמין":
        return <Badge variant="default" className="hebrew-text">{status}</Badge>;
      case "נמכר":
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
      case "בהמתנה":
        return <Badge variant="outline" className="hebrew-text">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
    }
  };

  const filteredVehicles = applyAdminVehicleFilters(vehicles || [], filters);

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground hebrew-text">ניהול רכבים</h1>
            <p className="text-lg text-muted-foreground hebrew-text mt-2">
              ניהול כל הרכבים במערכת
            </p>
          </div>
          <Button size="lg" className="hebrew-text" onClick={() => navigate('/admin/vehicles/create')}>
            <Plus className="h-4 w-4 ml-2" />
            הוסף רכב חדש
          </Button>
        </div>

        {/* Filter Bar */}
        <AdminVehicleFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredVehicles.length}
          isLoading={isLoading}
          showTags={true}
          showVehicleType={true}
        />

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl hebrew-text">רשימת רכבים ({filteredVehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground hebrew-text">
                לא נמצאו רכבים
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right hebrew-text text-base">רכב</TableHead>
                  <TableHead className="text-right hebrew-text text-base">מוכר</TableHead>
                  <TableHead className="text-right hebrew-text text-base">מחיר</TableHead>
                  <TableHead className="text-right hebrew-text text-base">בוסט</TableHead>
                  <TableHead className="text-right hebrew-text text-base">סטטוס</TableHead>
                  <TableHead className="text-right hebrew-text text-base">צפיות</TableHead>
                  <TableHead className="text-right hebrew-text text-base">תאריך הוספה</TableHead>
                  <TableHead className="text-right hebrew-text text-base">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="h-16">
                    <TableCell>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Car className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium hebrew-text text-base">
                            {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew}
                          </div>
                          <div className="text-sm text-muted-foreground hebrew-text">
                            {vehicle.year}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hebrew-text text-base">
                      {vehicle.owner?.business_name || vehicle.owner?.full_name || 'לא ידוע'}
                    </TableCell>
                    <TableCell className="hebrew-text text-base">
                      <div>
                        <div className="font-medium">₪{vehicle.price?.toLocaleString()}</div>
                        {vehicle.hot_sale_price && (
                          <div className="text-sm text-orange-600">
                            מבצע: ₪{vehicle.hot_sale_price.toString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.is_boosted && vehicle.boosted_until && new Date(vehicle.boosted_until) > new Date() ? (
                        <Badge className="bg-orange-500">🔥 פעיל</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell className="hebrew-text text-base">-</TableCell>
                    <TableCell className="hebrew-text text-base">
                      {new Date(vehicle.created_at).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hebrew-text"
                          onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}
                        >
                          <Eye className="h-4 w-4 ml-2" />
                          צפה
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hebrew-text"
                          onClick={() => navigate(`/admin/vehicles/${vehicle.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 ml-2" />
                          ערוך
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hebrew-text"
                          onClick={() => {
                            if (confirm('האם אתה בטוח שברצונך למחוק רכב זה?')) {
                              // TODO: Implement delete functionality
                              console.log('Delete vehicle:', vehicle.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          מחק
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default AdminVehiclesList;