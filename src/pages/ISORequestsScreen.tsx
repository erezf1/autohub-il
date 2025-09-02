import { useState } from "react";
import { FileText, Plus, Filter, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

// Mock data for ISO requests from other dealers
const isoRequests = [
  {
    id: 1,
    dealerName: "סוחר #234",
    title: "מחפש: BMW X3 2020-2022",
    description: "אוטומט, בנזין או היברידי, עד 80,000 ק״מ, צבע כהה מועדף",
    budget: "עד 350,000 ₪",
    timePosted: "לפני 2 שעות",
    responses: 5,
    isNew: true
  },
  {
    id: 2,
    dealerName: "אוטו-פלוס",
    title: "דרוש בדחיפות: טויוטה קורולה",
    description: "2019-2021, אוטומט, מצב מעולה, עד 100,000 ק״מ",
    budget: "180,000 - 220,000 ₪",
    timePosted: "לפני 5 שעות",
    responses: 12,
    isNew: false
  },
  {
    id: 3,
    dealerName: "סוחר #156",
    title: "מעוניין: מרצדס GLC או BMW X3",
    description: "2020 ואילך, חשמלי או היברידי, חובה פנורמה וחישוקי סגסוגת",
    budget: "מחיר פתוח",
    timePosted: "אתמול",
    responses: 8,
    isNew: false
  },
  {
    id: 4,
    dealerName: "רכב-מקס",
    title: "מחפש רכבי יוקרה",
    description: "פורשה, מזראטי, או למבורגיני 2018-2023, מצב חדש",
    budget: "500,000 - 1,200,000 ₪",
    timePosted: "לפני 1 יום",
    responses: 3,
    isNew: false
  }
];

const ISORequestsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredRequests = isoRequests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestClick = (requestId: number) => {
    navigate(`/iso-request-details/${requestId}`);
  };

  const handleCreateISO = () => {
    navigate("/create-iso");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground hebrew-text">חיפוש רכבים</h1>
        <Button onClick={handleCreateISO} size="sm">
          <Plus className="h-4 w-4 ml-1" />
          בקשה חדשה
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="relative flex-1">
          <Input
            placeholder="חפש בקשות לפי יצרן או דגם..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hebrew-text"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* ISO Requests List */}
      <div className="space-y-3">
        {filteredRequests.map((request) => (
          <Card 
            key={request.id}
            className="card-interactive cursor-pointer"
            onClick={() => handleRequestClick(request.id)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header with dealer name and time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm font-medium text-muted-foreground hebrew-text">
                      {request.dealerName}
                    </span>
                    {request.isNew && (
                      <Badge variant="destructive" className="text-xs">
                        חדש
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {request.timePosted}
                  </span>
                </div>

                {/* Request Title */}
                <h3 className="font-semibold text-foreground hebrew-text">
                  {request.title}
                </h3>

                {/* Request Description */}
                <p className="text-sm text-muted-foreground hebrew-text line-clamp-2">
                  {request.description}
                </p>

                {/* Budget */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-muted-foreground hebrew-text">תקציב:</span>
                  <span className="text-sm font-semibold text-primary hebrew-text">
                    {request.budget}
                  </span>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground hebrew-text">
                      {request.responses} הצעות
                    </span>
                  </div>

                  <Button variant="ghost" size="sm" className="h-8">
                    <Eye className="h-4 w-4 ml-1" />
                    <span className="hebrew-text">הגב</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground hebrew-text mb-2">
              לא נמצאו בקשות
            </h3>
            <p className="text-muted-foreground hebrew-text">
              נסה לשנות את החיפוש או בדוק שוב מאוחר יותר
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ISORequestsScreen;