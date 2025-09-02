import { useState } from "react";
import { Gavel, Eye, Edit, Trash2, Plus, Clock, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Mock data for auctions
const mockAuctions = [
  {
    id: 1,
    title: "פורשה 911 2022",
    seller: "אוטו גל",
    currentBid: "450,000 ₪",
    startingPrice: "400,000 ₪",
    status: "פעיל",
    timeRemaining: "2 ימים, 4 שעות",
    bidCount: 12,
    highestBidder: "מוטורס ישראל",
    dateCreated: "2024-01-10",
    endDate: "2024-01-25",
    views: 234
  },
  {
    id: 2,
    title: "BMW X5 2021",
    seller: "מוטורס ישראל",
    currentBid: "320,000 ₪",
    startingPrice: "280,000 ₪",
    status: "פעיל",
    timeRemaining: "1 יום, 12 שעות",
    bidCount: 8,
    highestBidder: "דיילי מוטורס",
    dateCreated: "2024-01-12",
    endDate: "2024-01-24",
    views: 189
  },
  {
    id: 3,
    title: "מרצדס GLC 2020",
    seller: "דיילי מוטורס",
    currentBid: "285,000 ₪",
    startingPrice: "250,000 ₪",
    status: "הסתיים",
    timeRemaining: "הסתיים",
    bidCount: 15,
    highestBidder: "אוטו סנטר",
    dateCreated: "2024-01-01",
    endDate: "2024-01-15",
    views: 312
  },
  {
    id: 4,
    title: "אאודי Q7 2023",
    seller: "אוטו סנטר",
    currentBid: "520,000 ₪",
    startingPrice: "480,000 ₪",
    status: "פעיל",
    timeRemaining: "5 שעות, 23 דקות",
    bidCount: 23,
    highestBidder: "לוי אוטו",
    dateCreated: "2024-01-18",
    endDate: "2024-01-23",
    views: 445
  }
];

const AdminAuctionsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "פעיל":
        return <Badge variant="default" className="hebrew-text">{status}</Badge>;
      case "הסתיים":
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
      case "מבוטל":
        return <Badge variant="destructive" className="hebrew-text">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
    }
  };

  const getTimeRemainingColor = (timeRemaining: string) => {
    if (timeRemaining === "הסתיים") {
      return "text-muted-foreground";
    }
    if (timeRemaining.includes("שעות") && !timeRemaining.includes("ימים")) {
      return "text-destructive"; // Less than a day
    }
    if (timeRemaining.includes("1 יום")) {
      return "text-warning"; // One day
    }
    return "text-muted-foreground"; // More than a day
  };

  const filteredAuctions = mockAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && auction.status === "פעיל") ||
                      (activeTab === "ended" && auction.status === "הסתיים") ||
                      (activeTab === "cancelled" && auction.status === "מבוטל");
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground hebrew-text">מכירות פומביות</h1>
          <p className="text-muted-foreground hebrew-text">
            ניהול כל המכירות הפומביות במערכת
          </p>
        </div>
        <Button className="hebrew-text">
          <Plus className="h-4 w-4 ml-2" />
          צור מכירה חדשה
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
              <Gavel className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי כותרת או מוכר..."
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

      {/* Auctions Tabs and Table */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">מכירות פומביות ({filteredAuctions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="hebrew-text">כל המכירות</TabsTrigger>
              <TabsTrigger value="active" className="hebrew-text">פעילות</TabsTrigger>
              <TabsTrigger value="ended" className="hebrew-text">הסתיימו</TabsTrigger>
              <TabsTrigger value="cancelled" className="hebrew-text">מבוטלות</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text">מכירה</TableHead>
                    <TableHead className="text-right hebrew-text">מוכר</TableHead>
                    <TableHead className="text-right hebrew-text">הצעה נוכחית</TableHead>
                    <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text">זמן נותר</TableHead>
                    <TableHead className="text-right hebrew-text">הצעות</TableHead>
                    <TableHead className="text-right hebrew-text">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuctions.map((auction) => (
                    <TableRow key={auction.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Gavel className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium hebrew-text">
                              {auction.title}
                            </div>
                            <div className="text-sm text-muted-foreground hebrew-text">
                              {auction.views} צפיות • נוצר {auction.dateCreated}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hebrew-text">{auction.seller}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium hebrew-text">{auction.currentBid}</div>
                          <div className="text-sm text-muted-foreground hebrew-text">
                            התחלה: {auction.startingPrice}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(auction.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className={`text-sm hebrew-text ${getTimeRemainingColor(auction.timeRemaining)}`}>
                            {auction.timeRemaining}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="hebrew-text">{auction.bidCount}</span>
                        </div>
                      </TableCell>
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
                              onClick={() => navigate(`/admin/auctions/${auction.id}`)}
                            >
                              <Eye className="ml-2 h-4 w-4" />
                              צפה בפרטים
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hebrew-text">
                              <Edit className="ml-2 h-4 w-4" />
                              ערוך מכירה
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive hebrew-text">
                              <Trash2 className="ml-2 h-4 w-4" />
                              בטל מכירה
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuctionsList;