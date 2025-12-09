import { useState, useEffect } from "react";
import { usePrivateAuth } from "@/contexts/PrivateAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

/**
 * A login page for private users with a form to collect credentials.
 */
const PrivateLogin = () => {
  const { signIn, isLoading, isPrivateAuthenticated } = usePrivateAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the user is already authenticated, redirect them away from the login page.
    // This prevents a logged-in user from being stuck on the login screen.
    if (isPrivateAuthenticated) {
      navigate("/private/dashboard", { replace: true });
    }
  }, [isPrivateAuthenticated, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      // After signing in, redirect to the private dashboard, replacing the login page in history.
      navigate("/private/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Sign-in failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Private Login</h1>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PrivateLogin;