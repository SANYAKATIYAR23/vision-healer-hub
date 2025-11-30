import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import PatientAuth from "./pages/PatientAuth";
import DoctorAuth from "./pages/DoctorAuth";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import EyeScan from "./pages/EyeScan";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/patient/auth" element={<PatientAuth />} />
            <Route path="/doctor/auth" element={<DoctorAuth />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/scan" element={<EyeScan />} />
            <Route path="/patient/appointments" element={<Appointments />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
