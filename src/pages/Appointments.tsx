import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/PatientSidebar";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  experience_years: number;
}

const Appointments = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.user_type !== 'patient')) {
      navigate('/patient/auth');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDoctors();
      fetchAppointments();
    }
  }, [user]);

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'doctor');
    
    if (data) setDoctors(data as Doctor[]);
  };

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctor_id(full_name, specialization)
      `)
      .eq('patient_id', user?.id)
      .order('appointment_date', { ascending: false });
    
    if (data) setAppointments(data);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user?.id,
          doctor_id: selectedDoctor,
          appointment_date: appointmentDate,
          symptoms,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Appointment booked successfully!");
      setShowBooking(false);
      setSelectedDoctor("");
      setAppointmentDate("");
      setSymptoms("");
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PatientSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div>
                  <h1 className="text-4xl font-bold">Appointments</h1>
                  <p className="text-muted-foreground">Book and manage your appointments</p>
                </div>
              </div>
              <Button 
                className="medical-gradient text-white"
                onClick={() => setShowBooking(!showBooking)}
              >
                {showBooking ? "Cancel" : "Book New Appointment"}
              </Button>
            </div>

            {showBooking && (
              <Card className="p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Doctor</Label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full p-3 rounded-lg border border-border bg-background"
                      required
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.full_name} - {doctor.specialization} ({doctor.experience_years}+ years)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointment-date">Appointment Date & Time</Label>
                    <Input
                      id="appointment-date"
                      type="datetime-local"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms / Notes</Label>
                    <Textarea
                      id="symptoms"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe your symptoms or concerns..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full medical-gradient text-white py-6"
                    disabled={booking}
                  >
                    {booking ? "Booking..." : "Confirm Booking"}
                  </Button>
                </form>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Your Appointments</h2>
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full medical-gradient flex items-center justify-center text-white font-bold">
                          {apt.doctor?.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{apt.doctor?.full_name}</p>
                          <p className="text-sm text-muted-foreground">{apt.doctor?.specialization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm mb-1">
                          <Clock className="w-4 h-4" />
                          {new Date(apt.appointment_date).toLocaleString()}
                        </div>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            apt.status === 'pending' && "bg-yellow-100 text-yellow-800",
                            apt.status === 'confirmed' && "bg-green-100 text-green-800",
                            apt.status === 'completed' && "bg-blue-100 text-blue-800",
                            apt.status === 'cancelled' && "bg-red-100 text-red-800"
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

export default Appointments;
