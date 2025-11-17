import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useAdminVehicles } from "@/hooks/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminVehicleFilterBar } from "@/components/admin";
import { AdminVehicleFilters, applyAdminVehicleFilters } from "@/utils/admin/vehicleFilters";
import { useNavigate } from "react-router-dom";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { AdminVehiclesTable } from "@/components/admin/AdminVehiclesTable";

const AdminVehiclesList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AdminVehicleFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { vehicles, isLoading, deleteVehicle } = useAdminVehicles();

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
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee] hebrew-text" 
            onClick={() => navigate('/admin/vehicles/create')}
          >
            <Plus className="h-4 w-4 ml-2" />
            הוסף רכב חדש
          </Button>
        </div>

        {/* Filters and Search */}
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardContent className="p-8">
              <div className="flex gap-6">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="חפש לפי יצרן, דגם או מוכר..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 h-12 text-base hebrew-text bg-muted text-white"
                  />
                </div>
                <Button variant="outline" size="lg" className="hebrew-text btn-hover-cyan">
                  סינון מתקדם
                </Button>
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        {/* Vehicles Table */}
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-2xl hebrew-text text-white">רשימת רכבים ({filteredVehicles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-12 text-muted-foreground hebrew-text">
                  טוען רכבים...
                </div>
              ) : (
                <AdminVehiclesTable 
                  vehicles={filteredVehicles} 
                  showOwner={true}
                  onDelete={(id) => {
                    if (window.confirm('האם אתה בטוח שברצונך למחוק את הרכב?')) {
                      deleteVehicle(id);
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </GradientBorderContainer>
    </div>
  );
};

export default AdminVehiclesList;
