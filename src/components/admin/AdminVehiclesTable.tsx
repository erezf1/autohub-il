import { Eye, Edit, Trash2 } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

interface Vehicle {
  id: string;
  year: number;
  price: number;
  status: string;
  created_at: string;
  owner_id: string | null;
  private_user_id?: string | null;
  is_private_listing?: boolean | null;
  is_boosted: boolean | null;
  boosted_until: string | null;
  make: { name_hebrew: string } | null;
  model: { name_hebrew: string } | null;
  owner?: { business_name: string } | null;
  private_user?: { full_name: string } | null;
  auction?: {
    id: string;
    status: string;
  } | null;
}

interface AdminVehiclesTableProps {
  vehicles: Vehicle[];
  showOwner?: boolean;
  onDelete?: (id: string) => void;
}

export const AdminVehiclesTable = ({ vehicles, showOwner = true, onDelete }: AdminVehiclesTableProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (vehicle: Vehicle) => {
    // Check if vehicle is boosted and boost is still active
    const isBoosted = vehicle.is_boosted && 
                      vehicle.boosted_until && 
                      new Date(vehicle.boosted_until) > new Date();
    
    // Check if vehicle is in an active auction
    const isInAuction = vehicle.auction && 
                       (vehicle.auction.status === 'active' || 
                        vehicle.auction.status === 'scheduled');

    // Priority: Auction > Boost > Regular Status
    if (isInAuction) {
      return (
        <Badge variant="default" className="bg-purple-500 text-white hebrew-text">
          במכרז
        </Badge>
      );
    }
    
    if (isBoosted) {
      return (
        <Badge variant="default" className="bg-amber-500 text-black hebrew-text">
          בוסט
        </Badge>
      );
    }

    // Regular status handling
    const statusMap: Record<string, string> = {
      'available': 'זמין',
      'sold': 'נמכר',
      'removed': 'הוסר',
      'pending': 'בהמתנה',
    };
    
    const hebrewStatus = statusMap[vehicle.status] || vehicle.status;
    
    switch (vehicle.status) {
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
                {vehicle.is_private_listing 
                  ? (vehicle.private_user?.full_name || 'מפרטי') 
                  : (vehicle.owner?.business_name || 'לא ידוע')}
              </TableCell>
            )}
            <TableCell className="text-right hebrew-text text-white">
              ₪{vehicle.price.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {getStatusBadge(vehicle)}
            </TableCell>
            <TableCell className="text-right hebrew-text text-white">
              {formatDate(vehicle.created_at)}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-2" dir="ltr">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}
                  className="h-8 w-8 hover:bg-muted"
                  title="צפייה"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/admin/vehicles/${vehicle.id}/edit`)}
                  className="h-8 w-8 hover:bg-muted"
                  title="עריכה"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (window.confirm('האם אתה בטוח שברצונך למחוק את הרכב?')) {
                        onDelete(vehicle.id);
                      }
                    }}
                    className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                    title="מחיקה"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
