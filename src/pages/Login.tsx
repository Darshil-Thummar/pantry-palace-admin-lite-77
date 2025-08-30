import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Login page: Attempting login...');
      console.log('Login page: Email:', email);
      console.log('Login page: Password length:', password.length);
      
      await login({
        email,
        password,
      });

      console.log('Login page: Login successful, navigating to products...');
      toast.success("Welcome back!");
      
      // Add debugging for navigation
      console.log('Login page: About to navigate to /products');
      console.log('Login page: Current location:', window.location.pathname);
      
      // Add a small delay to ensure toast is visible and debug timing
      setTimeout(() => {
        console.log('Login page: Executing navigation after delay');
        navigate("/products");
        console.log('Login page: Navigation completed');
        console.log('Login page: New location:', window.location.pathname);
      }, 500);
    } catch (error: any) {
      console.error('Login page: Login failed:', error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Please sign in to your account.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full pantry-gradient"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Don't have an account?{" "}
          </span>
          <Link
            to="/register"
            className="text-sm text-primary hover:underline font-medium"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
