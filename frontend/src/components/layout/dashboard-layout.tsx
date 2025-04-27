
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import CenteredNavbar from './centered-navbar';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50/80">
      {/* Top Navigation */}
      <CenteredNavbar />
      
      {/* Main Content */}
      <main className="flex-1 pt-20 pb-6 px-4 md:px-6 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
