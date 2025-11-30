import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { signUp, signIn } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const PatientAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile?.user_type === 'patient') {
      navigate('/patient/dashboard');
    }
  }, [user, profile, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back!");
        navigate('/patient/dashboard');
      } else {
        const { error } = await signUp(email, password, fullName, 'patient');
        if (error) throw error;
        toast.success("Account created successfully!");
        navigate('/patient/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 medical-gradient opacity-20" />
      <div className="absolute inset-0 backdrop-blur-3xl">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        className="absolute top-6 left-6 z-20"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Button>

      {/* Flip Card Container */}
      <div className="relative z-10 w-full max-w-md perspective-1000">
        <div 
          className={cn(
            "relative w-full transition-all duration-700 transform-style-3d",
            !isLogin && "rotate-y-180"
          )}
        >
          {/* Login Side */}
          <Card className={cn(
            "p-8 glass-effect backface-hidden",
            !isLogin && "absolute inset-0"
          )}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full medical-gradient mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Patient Login</h2>
              <p className="text-muted-foreground">Welcome back to EyeCare AI</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full medical-gradient text-white py-6" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          </Card>

          {/* Signup Side */}
          <Card className={cn(
            "p-8 glass-effect backface-hidden rotate-y-180",
            isLogin && "absolute inset-0"
          )}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full medical-gradient mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-muted-foreground">Join EyeCare AI today</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full medical-gradient text-white py-6" 
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Add utility for flip card
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default PatientAuth;
