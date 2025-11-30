import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DoctorSidebar } from "@/components/DoctorSidebar";

const DoctorDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingReviews: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || profile?.user_type !== 'doctor')) {
      navigate('/doctor/auth');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user && profile?.user_type === 'doctor') {
      fetchStats();
      fetchRecentAppointments();
    }
  }, [user, profile]);

  const fetchStats = async () => {
    // Fetch total patients
    const { count: patientCount } = await supabase
      .from('appointments')
      .select('patient_id', { count: 'exact', head: true })
      .eq('doctor_id', user?.id);

    // Fetch today's appointments
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', user?.id)
      .gte('appointment_date', today);

    // Fetch pending scans to review
    const { count: pendingCount } = await supabase
      .from('eye_scans')
      .select('*', { count: 'exact', head: true })
      .is('disease_detected', null);

    setStats({
      totalPatients: patientCount || 0,
      todayAppointments: todayCount || 0,
      pendingReviews: pendingCount || 0,
    });
  };

  const fetchRecentAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id(full_name, email)
      `)
      .eq('doctor_id', user?.id)
      .order('appointment_date', { ascending: true })
      .limit(5);

    if (data) setRecentAppointments(data);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DoctorSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <SidebarTrigger />
                <h1 className="text-4xl font-bold">Welcome, Dr. {profile?.full_name}</h1>
              </div>
              <p className="text-muted-foreground">Manage your patients and appointments</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 border-l-4 border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                    <p className="text-3xl font-bold">{stats.totalPatients}</p>
                  </div>
                  <Users className="w-12 h-12 text-primary opacity-20" />
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-secondary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Today's Appointments</p>
                    <p className="text-3xl font-bold">{stats.todayAppointments}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-secondary opacity-20" />
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-accent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Reviews</p>
                    <p className="text-3xl font-bold">{stats.pendingReviews}</p>
                  </div>
                  <Activity className="w-12 h-12 text-accent opacity-20" />
                </div>
              </Card>
            </div>

            {/* Recent Appointments */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Upcoming Appointments</h2>
              {recentAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {apt.patient?.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{apt.patient?.full_name}</p>
                          <p className="text-sm text-muted-foreground">{apt.patient?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(apt.appointment_date).toLocaleString()}
                        </p>
                        <span
                          className={cn(
                            "inline-block px-3 py-1 rounded-full text-xs font-medium mt-1",
                            apt.status === 'pending' && "bg-yellow-100 text-yellow-800",
                            apt.status === 'confirmed' && "bg-green-100 text-green-800"
                          )}
                        >
                          {apt.status}
                        </span>
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

export default DoctorDashboard;
