import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { signUp, signIn } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const DoctorAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile?.user_type === 'doctor') {
      navigate('/doctor/dashboard');
    }
  }, [user, profile, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back, Doctor!");
        navigate('/doctor/dashboard');
      } else {
        const { error } = await signUp(email, password, fullName, 'doctor');
        if (error) throw error;
        toast.success("Doctor account created successfully!");
        navigate('/doctor/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/20 to-accent/20" />
      <div className="absolute inset-0 backdrop-blur-3xl">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      <Button
        variant="ghost"
        className="absolute top-6 left-6 z-20"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Button>

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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Doctor Login</h2>
              <p className="text-muted-foreground">Access your medical dashboard</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="doctor-login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="doctor-login-email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor-login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="doctor-login-password"
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
                className="w-full bg-gradient-to-r from-secondary to-primary text-white py-6" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Need a doctor account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-secondary font-semibold hover:underline"
                >
                  Register here
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Register as Doctor</h2>
              <p className="text-muted-foreground">Create your medical account</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="doctor-signup-name"
                    type="text"
                    placeholder="Dr. John Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor-signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="doctor-signup-email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor-signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="doctor-signup-password"
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
                className="w-full bg-gradient-to-r from-secondary to-primary text-white py-6" 
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-secondary font-semibold hover:underline"
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

export default DoctorAuth;
