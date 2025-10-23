import { useState } from "react";
import { Gavel, Eye, Edit, Trash2, Plus, Clock, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminVehicleFilterBar } from "@/components/admin";
import { AdminVehicleFilters, applyAdminAuctionFilters } from "@/utils/admin/vehicleFilters";
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
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

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
  const [filters, setFilters] = useState<AdminVehicleFilters>({});
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

  const filteredAuctions = applyAdminAuctionFilters(mockAuctions, filters, activeTab);

  return (
    <div className="space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white hebrew-text">מכירות פומביות</h1>
          <p className="text-muted-foreground hebrew-text">
            ניהול כל המכירות הפומביות במערכת
          </p>
        </div>
        <Button className="hebrew-text bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee]">
          <Plus className="h-4 w-4 ml-2" />
          צור מכירה חדשה
        </Button>
      </div>

      {/* Filters and Search */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader>
            <CardTitle className="hebrew-text text-white">סינון וחיפוש</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Gavel className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <GradientBorderContainer className="rounded-md">
                  <Input
                    placeholder="חפש לפי כותרת או מוכר..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 hebrew-text border-0 bg-black rounded-md text-white"
                  />
                </GradientBorderContainer>
              </div>
              <Button variant="ghost" className="hebrew-text btn-hover-cyan">
                סינון מתקדם
              </Button>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Auctions Tabs and Table */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader>
            <CardTitle className="hebrew-text text-white">מכירות פומביות ({filteredAuctions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-900">
                <TabsTrigger value="all" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">כל המכירות</TabsTrigger>
                <TabsTrigger value="active" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">פעילות</TabsTrigger>
                <TabsTrigger value="ended" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">הסתיימו</TabsTrigger>
                <TabsTrigger value="cancelled" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">מבוטלות</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right hebrew-text text-white">פעולות</TableHead>
                      <TableHead className="text-right hebrew-text text-white">הצעות</TableHead>
                      <TableHead className="text-right hebrew-text text-white">זמן נותר</TableHead>
                      <TableHead className="text-right hebrew-text text-white">סטטוס</TableHead>
                      <TableHead className="text-right hebrew-text text-white">הצעה נוכחית</TableHead>
                      <TableHead className="text-right hebrew-text text-white">מוכר</TableHead>
                      <TableHead className="text-right hebrew-text text-white">מכירה</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuctions.map((auction) => (
                      <TableRow key={auction.id}>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="hebrew-text btn-hover-cyan" onClick={() => navigate(`/admin/auctions/${auction.id}`)}>
                              <Eye className="h-4 w-4 ml-1" />
                            צפה
                          </Button>
                          <Button variant="ghost" size="sm" className="hebrew-text btn-hover-cyan">
                            <Edit className="h-4 w-4 ml-1" />
                            ערוך
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hebrew-text hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4 ml-1" />
                            בטל
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end text-white">
                          <span className="hebrew-text">{auction.bidCount}</span>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end">
                          <span className={`text-sm hebrew-text ${getTimeRemainingColor(auction.timeRemaining)}`}>
                            {auction.timeRemaining}
                          </span>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(auction.status)}</TableCell>
                      <TableCell>
                        <div className="text-right">
                          <div className="font-medium hebrew-text text-white">{auction.currentBid}</div>
                          <div className="text-sm text-muted-foreground hebrew-text">
                            התחלה: {auction.startingPrice}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hebrew-text text-right text-white">{auction.seller}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Gavel className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium hebrew-text text-white">
                              {auction.title}
                            </div>
                            <div className="text-sm text-muted-foreground hebrew-text">
                              {auction.views} צפיות • נוצר {auction.dateCreated}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </GradientBorderContainer>
    </div>
  );
};

export default AdminAuctionsList;