import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';

const EmployeeDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleTabChange = (value: string) => {
    navigate(`/employee-dashboard/${value}`);
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/leave')) return 'leave';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/certificates')) return 'certificates';
    if (path.includes('/settings')) return 'settings';
    return '';
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50/80">
      {/* Header with Logo on Left */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-3 bg-white/5 backdrop-blur-md border-b border-gray-100/20">
        <div className="flex items-center">
          <div className="bg-staffi-purple rounded-md w-8 h-8 flex items-center justify-center text-white font-bold shadow-md">
            S
          </div>
          <span className="text-xl font-bold text-staffi-purple ml-2 tracking-tight">STAFFI</span>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 pt-20 pb-6 px-4 md:px-6 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
            <p className="text-gray-600">Welcome back! Manage your work activities</p>
          </motion.div>
          
          <div className="mb-6">
            <Tabs defaultValue={getCurrentTab() || "leave"} className="w-full" onValueChange={handleTabChange}>
              <TabsList className="w-full justify-start gap-2 mb-6 overflow-x-auto">
                <TabsTrigger value="leave" className="px-4">Leave Requests</TabsTrigger>
                <TabsTrigger value="projects" className="px-4">My Projects</TabsTrigger>
                <TabsTrigger value="certificates" className="px-4">Certificates</TabsTrigger>
                <TabsTrigger value="profile" className="px-4">Profile</TabsTrigger>
                <TabsTrigger value="settings" className="px-4">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboardLayout;