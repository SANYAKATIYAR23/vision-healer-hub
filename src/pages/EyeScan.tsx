import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/PatientSidebar";

const EyeScan = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.user_type !== 'patient')) {
      navigate('/patient/auth');
    }
  }, [user, profile, loading, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast.error("Could not access camera");
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      setSelectedImage(canvas.toDataURL('image/png'));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const performScan = async () => {
    if (!selectedImage) return;

    setScanning(true);
    try {
      // Simulate AI analysis (in real implementation, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        disease_detected: "Mild Diabetic Retinopathy",
        disease_level: "mild" as const,
        confidence_score: 87.5,
      };

      // Save to database
      const { data, error } = await supabase
        .from('eye_scans')
        .insert([{
          patient_id: user?.id,
          image_url: selectedImage.substring(0, 100), // In production, upload to storage
          disease_detected: mockResult.disease_detected,
          disease_level: mockResult.disease_level,
          confidence_score: mockResult.confidence_score,
        }])
        .select()
        .single();

      if (error) throw error;

      setScanResult(mockResult);
      toast.success("Scan completed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Scan failed");
    } finally {
      setScanning(false);
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-2">
              <SidebarTrigger />
              <div>
                <h1 className="text-4xl font-bold">Eye Disease Detection</h1>
                <p className="text-muted-foreground">Upload or capture an image of your eye</p>
              </div>
            </div>

            {!scanResult ? (
              <Card className="p-8">
                <div className="space-y-6">
                  {/* Upload Section */}
                  {!selectedImage && !cameraActive && (
                    <div className="space-y-4">
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-semibold mb-2">Click to upload eye image</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-muted-foreground">OR</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      <Button
                        className="w-full py-6 medical-gradient text-white"
                        onClick={startCamera}
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Use Camera
                      </Button>
                    </div>
                  )}

                  {/* Camera Preview */}
                  {cameraActive && (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                      />
                      <div className="mt-4 flex gap-4">
                        <Button onClick={captureImage} className="flex-1 medical-gradient text-white">
                          Capture Image
                        </Button>
                        <Button onClick={stopCamera} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {selectedImage && !cameraActive && (
                    <div className="relative">
                      <img src={selectedImage} alt="Eye scan" className="w-full rounded-lg" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4"
                        onClick={() => setSelectedImage(null)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      <Button
                        className="w-full mt-4 py-6 medical-gradient text-white"
                        onClick={performScan}
                        disabled={scanning}
                      >
                        {scanning ? "Analyzing..." : "Start Analysis"}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Scan Results</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img src={selectedImage!} alt="Scanned eye" className="w-full rounded-lg" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Detected Condition</p>
                        <p className="text-xl font-bold">{scanResult.disease_detected}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Severity Level</p>
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          {scanResult.disease_level}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                        <p className="text-2xl font-bold text-primary">{scanResult.confidence_score}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      className="flex-1 medical-gradient text-white"
                      onClick={() => navigate('/patient/appointments')}
                    >
                      Book Doctor Appointment
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedImage(null);
                        setScanResult(null);
                      }}
                    >
                      New Scan
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EyeScan;
