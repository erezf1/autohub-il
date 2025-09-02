import { useState } from "react";
import { Car, Eye, Edit, Trash2, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

// Mock data for vehicles
const mockVehicles = [
  {
    id: 1,
    make: "טויוטה",
    model: "קורולה",
    year: 2022,
    seller: "אוטו גל",
    price: "125,000 ₪",
    status: "זמין",
    views: 245,
    dateAdded: "2024-01-15",
    location: "תל אביב"
  },
  {
    id: 2,
    make: "BMW",
    model: "X5",
    year: 2021,
    seller: "מוטורס ישראל",
    price: "450,000 ₪", 
    status: "נמכר",
    views: 189,
    dateAdded: "2024-01-10",
    location: "חיפה"
  },
  {
    id: 3,
    make: "מרצדס",
    model: "GLC",
    year: 2023,
    seller: "דיילי מוטורס",
    price: "380,000 ₪",
    status: "זמין",
    views: 312,
    dateAdded: "2024-01-20",
    location: "ירושלים"
  },
  {
    id: 4,
    make: "אאודי",
    model: "A4",
    year: 2020,
    seller: "אוטו סנטר",
    price: "195,000 ₪",
    status: "בהמתנה",
    views: 156,
    dateAdded: "2024-01-18",
    location: "באר שבע"
  }
];

const AdminVehiclesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredVehicles = mockVehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground hebrew-text">ניהול רכבים</h1>
          <p className="text-muted-foreground hebrew-text">
            ניהול כל הרכבים במערכת
          </p>
        </div>
        <Button className="hebrew-text">
          <Plus className="h-4 w-4 ml-2" />
          הוסף רכב חדש
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">סינון וחיפוש</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי יצרן, דגם או מוכר..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 hebrew-text"
              />
            </div>
            <Button variant="outline" className="hebrew-text">
              סינון מתקדם
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">רשימת רכבים ({filteredVehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right hebrew-text">רכב</TableHead>
                <TableHead className="text-right hebrew-text">מוכר</TableHead>
                <TableHead className="text-right hebrew-text">מחיר</TableHead>
                <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                <TableHead className="text-right hebrew-text">צפיות</TableHead>
                <TableHead className="text-right hebrew-text">תאריך הוספה</TableHead>
                <TableHead className="text-right hebrew-text">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Car className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium hebrew-text">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-sm text-muted-foreground hebrew-text">
                          {vehicle.year} • {vehicle.location}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hebrew-text">{vehicle.seller}</TableCell>
                  <TableCell className="font-medium hebrew-text">{vehicle.price}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell className="hebrew-text">{vehicle.views}</TableCell>
                  <TableCell className="hebrew-text">{vehicle.dateAdded}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">פתח תפריט</span>
                          <div className="h-4 w-4 flex flex-col justify-center space-y-1">
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="hebrew-text"
                          onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}
                        >
                          <Eye className="ml-2 h-4 w-4" />
                          צפה
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hebrew-text">
                          <Edit className="ml-2 h-4 w-4" />
                          ערוך
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hebrew-text">
                          <Trash2 className="ml-2 h-4 w-4" />
                          מחק
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVehiclesList;