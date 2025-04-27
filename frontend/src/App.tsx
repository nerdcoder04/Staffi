
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/splash-screen/splash-screen";
import DashboardLayout from "./components/layout/dashboard-layout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import EmployeeManagement from "./pages/dashboard/EmployeeManagement";
import LeaveManagement from "./pages/dashboard/LeaveManagement";
import Payroll from "./pages/dashboard/Payroll";
import AIInsights from "./pages/dashboard/AIInsights";
import Certificates from "./pages/dashboard/Certificates";
import ImpactScore from "./pages/dashboard/ImpactScore";
import Settings from "./pages/dashboard/Settings";
import ProfilePage from "./pages/dashboard/ProfilePage";
import People from "./pages/dashboard/People";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <>
            <Toaster />
            <Sonner 
              position="bottom-center" 
              closeButton 
              richColors={false}
              theme="light"
              className="bg-white text-gray-900"
              expand 
            />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="leaves" element={<LeaveManagement />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="insights" element={<AIInsights />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="impact" element={<ImpactScore />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="people" element={<People />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
