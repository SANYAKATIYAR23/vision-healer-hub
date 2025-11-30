import { Eye, Shield, Users, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 medical-gradient opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-8 animate-fade-in">
              <Eye className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Eye Care</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Advanced Eye Disease Detection
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-fade-in max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Cutting-edge AI technology for early detection and diagnosis of eye diseases. 
              Connect with specialized doctors for personalized care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                className="medical-gradient text-white px-8 py-6 text-lg rounded-full hover:scale-105 transition-transform shadow-lg"
                onClick={() => navigate('/patient/auth')}
              >
                Get Started as Patient
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg rounded-full hover:scale-105 transition-transform border-2 border-primary"
                onClick={() => navigate('/doctor/auth')}
              >
                Login as Doctor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose EyeCare AI?</h2>
            <p className="text-xl text-muted-foreground">Advanced technology meets personalized care</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Eye,
                title: "AI Detection",
                description: "State-of-the-art AI models for accurate disease detection",
                color: "text-primary"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your health data is encrypted and completely secure",
                color: "text-secondary"
              },
              {
                icon: Users,
                title: "Expert Doctors",
                description: "Connect with specialized ophthalmologists instantly",
                color: "text-accent"
              },
              {
                icon: Activity,
                title: "Real-time Results",
                description: "Get instant analysis and detailed disease reports",
                color: "text-primary"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-card hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary cursor-pointer hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                  "bg-gradient-to-br from-primary/10 to-secondary/10"
                )}>
                  <feature.icon className={cn("w-8 h-8", feature.color)} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 medical-gradient opacity-5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center glass-effect rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Your Eye Health Journey Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Early detection saves vision. Let AI help protect your eyes.
            </p>
            <Button 
              size="lg" 
              className="medical-gradient text-white px-12 py-6 text-lg rounded-full hover:scale-105 transition-transform shadow-lg"
              onClick={() => navigate('/patient/auth')}
            >
              Begin Free Scan
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
