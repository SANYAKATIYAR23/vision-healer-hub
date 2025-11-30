import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Calendar, Activity, TrendingUp } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/PatientSidebar";

interface EyeScan {
  id: string;
  disease_detected: string | null;
  disease_level: string | null;
  confidence_score: number | null;
  scan_date: string;
}

const PatientDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [recentScans, setRecentScans] = useState<EyeScan[]>([]);

  useEffect(() => {
    if (!loading && (!user || profile?.user_type !== 'patient')) {
      navigate('/patient/auth');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRecentScans();
    }
  }, [user]);

  const fetchRecentScans = async () => {
    const { data } = await supabase
      .from('eye_scans')
      .select('*')
      .eq('patient_id', user?.id)
      .order('scan_date', { ascending: false })
      .limit(3);
    
    if (data) setRecentScans(data);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PatientSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <SidebarTrigger />
                <h1 className="text-4xl font-bold">Welcome, {profile?.full_name}</h1>
              </div>
              <p className="text-muted-foreground">Monitor your eye health and manage appointments</p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/patient/scan')}>
                <Camera className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">New Eye Scan</h3>
                <p className="text-muted-foreground">Capture and analyze your eye health</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/patient/appointments')}>
                <Calendar className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Book Appointment</h3>
                <p className="text-muted-foreground">Schedule with a specialist</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Activity className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Health Reports</h3>
                <p className="text-muted-foreground">View your scan history</p>
              </Card>
            </div>

            {/* Recent Scans */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Scans</h2>
                <Button variant="outline" onClick={() => navigate('/patient/scan')}>
                  New Scan
                </Button>
              </div>

              {recentScans.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No scans yet. Start with your first eye scan!</p>
                  <Button className="mt-4 medical-gradient text-white" onClick={() => navigate('/patient/scan')}>
                    Start First Scan
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentScans.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-semibold">{scan.disease_detected || 'Pending Analysis'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(scan.scan_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {scan.disease_level && (
                          <span className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium",
                            scan.disease_level === 'normal' && "bg-green-100 text-green-800",
                            scan.disease_level === 'mild' && "bg-yellow-100 text-yellow-800",
                            scan.disease_level === 'moderate' && "bg-orange-100 text-orange-800",
                            (scan.disease_level === 'severe' || scan.disease_level === 'critical') && "bg-red-100 text-red-800"
                          )}>
                            {scan.disease_level}
                          </span>
                        )}
                        {scan.confidence_score && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {scan.confidence_score}% confidence
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default PatientDashboard;
