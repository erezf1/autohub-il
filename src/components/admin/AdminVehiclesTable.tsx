import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface Vehicle {
  id: string;
  year: number;
  price: number;
  status: string;
  created_at: string;
  owner_id: string;
  make: { name_hebrew: string } | null;
  model: { name_hebrew: string } | null;
  owner?: { business_name: string } | null;
}

interface AdminVehiclesTableProps {
  vehicles: Vehicle[];
  showOwner?: boolean;
  onDelete?: (id: string) => void;
}

export const AdminVehiclesTable = ({ vehicles, showOwner = true, onDelete }: AdminVehiclesTableProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'available': 'זמין',
      'sold': 'נמכר',
      'removed': 'הוסר',
      'pending': 'בהמתנה',
    };
    
    const hebrewStatus = statusMap[status] || status;
    
    switch (status) {
      case "available":
        return <Badge variant="default" className="hebrew-text">{hebrewStatus}</Badge>;
      case "sold":
        return <Badge variant="secondary" className="hebrew-text">{hebrewStatus}</Badge>;
      case "removed":
        return <Badge variant="destructive" className="hebrew-text">{hebrewStatus}</Badge>;
      case "pending":
        return <Badge variant="outline" className="hebrew-text">{hebrewStatus}</Badge>;
      default:
        return <Badge variant="secondary" className="hebrew-text">{hebrewStatus}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('he-IL');
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground hebrew-text">
        אין רכבים להצגה
      </div>
    );
  }

  return (
    <Table dir="rtl">
      <TableHeader>
        <TableRow>
          <TableHead className="text-right hebrew-text">רכב</TableHead>
          {showOwner && <TableHead className="text-right hebrew-text">מוכר</TableHead>}
          <TableHead className="text-right hebrew-text">מחיר</TableHead>
          <TableHead className="text-right hebrew-text">סטטוס</TableHead>
          <TableHead className="text-right hebrew-text">תאריך</TableHead>
          <TableHead className="text-center hebrew-text">פעולות</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell className="text-right">
              <div>
                <p className="font-semibold text-white hebrew-text">
                  {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew}
                </p>
                <p className="text-sm text-muted-foreground hebrew-text">{vehicle.year}</p>
              </div>
            </TableCell>
            {showOwner && (
              <TableCell className="text-right hebrew-text text-white">
                {vehicle.owner?.business_name || 'לא ידוע'}
              </TableCell>
            )}
            <TableCell className="text-right hebrew-text text-white">
              ₪{vehicle.price.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {getStatusBadge(vehicle.status)}
            </TableCell>
            <TableCell className="text-right hebrew-text text-white">
              {formatDate(vehicle.created_at)}
            </TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem 
                    onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}
                    className="cursor-pointer hebrew-text"
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    צפייה
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate(`/admin/vehicles/${vehicle.id}/edit`)}
                    className="cursor-pointer hebrew-text"
                  >
                    <Edit className="h-4 w-4 ml-2" />
                    עריכה
                  </DropdownMenuItem>
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(vehicle.id)}
                      className="cursor-pointer hebrew-text text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      מחיקה
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
