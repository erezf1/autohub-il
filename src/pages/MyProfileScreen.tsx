import { useState } from "react";
import { User, Building, Phone, Mail, MapPin, Edit3, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// User profile data
const initialUserData = {
  businessName: "אוטו-דיל בע״מ",
  contactName: "משה כהן",
  phone: "054-1234567",
  email: "moshe@auto-deal.co.il",
  address: "רחוב הנשיא 123, תל אביב",
  licenseNumber: "123456789",
  description: "מתמחים במכירת רכבי יוקרה ורכבי ספורט. יותר מ-15 שנות ניסיון בתחום."
};

const MyProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUserData);

  const handleSave = () => {
    // Here you would typically save to a backend
    setIsEditing(false);
    // Show success toast
  };

  const handleCancel = () => {
    setUserData(initialUserData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground hebrew-text">הפרופיל שלי</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit3 className="h-4 w-4 ml-1" />
            ערוך פרופיל
          </Button>
        ) : (
          <div className="flex space-x-2 space-x-reverse">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 ml-1" />
              שמור
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              בטל
            </Button>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-sm font-medium hebrew-text">
              שם העסק
            </Label>
            {isEditing ? (
              <Input
                id="businessName"
                value={userData.businessName}
                onChange={(e) => setUserData({...userData, businessName: e.target.value})}
                className="hebrew-text"
              />
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground hebrew-text">{userData.businessName}</span>
              </div>
            )}
          </div>

          {/* Contact Name */}
          <div className="space-y-2">
            <Label htmlFor="contactName" className="text-sm font-medium hebrew-text">
              איש קשר
            </Label>
            {isEditing ? (
              <Input
                id="contactName"
                value={userData.contactName}
                onChange={(e) => setUserData({...userData, contactName: e.target.value})}
                className="hebrew-text"
              />
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground hebrew-text">{userData.contactName}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium hebrew-text">
              טלפון
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({...userData, phone: e.target.value})}
                className="hebrew-text"
              />
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground hebrew-text">{userData.phone}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium hebrew-text">
              אימייל
            </Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                className="hebrew-text"
              />
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground hebrew-text">{userData.email}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium hebrew-text">
              כתובת
            </Label>
            {isEditing ? (
              <Input
                id="address"
                value={userData.address}
                onChange={(e) => setUserData({...userData, address: e.target.value})}
                className="hebrew-text"
              />
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground hebrew-text">{userData.address}</span>
              </div>
            )}
          </div>

          {/* License Number */}
          <div className="space-y-2">
            <Label htmlFor="licenseNumber" className="text-sm font-medium hebrew-text">
              מספר רישיון עסק
            </Label>
            {isEditing ? (
              <Input
                id="licenseNumber"
                value={userData.licenseNumber}
                onChange={(e) => setUserData({...userData, licenseNumber: e.target.value})}
                className="hebrew-text"
              />
            ) : (
              <span className="text-foreground hebrew-text">{userData.licenseNumber}</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium hebrew-text">
              תיאור העסק
            </Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={userData.description}
                onChange={(e) => setUserData({...userData, description: e.target.value})}
                className="hebrew-text"
                rows={3}
              />
            ) : (
              <p className="text-muted-foreground hebrew-text">{userData.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfileScreen;