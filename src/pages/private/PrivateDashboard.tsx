import { usePrivateAuth } from "@/contexts/PrivateAuthContext"; // Assuming '@' is aliased to 'src' - this might not need changing. If it fails, try "../../contexts/PrivateAuthContext"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * A sample dashboard page for authenticated private users.
 * It displays user information and provides a sign-out button.
 */
const PrivateDashboard = () => {
  // Use the auth context to get user data and the signOut function
  const { user, signOut } = usePrivateAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    // After signing out, redirect the user to the login page
    navigate("/private/login");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Private Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>
      <p>Welcome, you are successfully logged in!</p>
      {user && <p>Your user ID is: {user.id}</p>}
      {user?.email && <p>Your registered email (from phone) is: {user.email}</p>}
    </div>
  );
};

export default PrivateDashboard;