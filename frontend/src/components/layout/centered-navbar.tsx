
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { GlassPanel } from "@/components/dashboard/glass-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const CenteredNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const isActiveRoute = (path: string) => {
    // Match exact path or sub-paths (for dashboard/X routes)
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "People", path: "/dashboard/people" },
    { name: "Employees", path: "/dashboard/employees" },
    { name: "Leaves", path: "/dashboard/leaves" },
    { name: "Payroll", path: "/dashboard/payroll" },
    { name: "Insights", path: "/dashboard/insights" },
    { name: "Certificates", path: "/dashboard/certificates" },
    { name: "Impact", path: "/dashboard/impact" },
  ];
  
  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };
  
  const handleSettingsClick = () => {
    navigate('/dashboard/settings');
  };
  
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-2 bg-white/5 backdrop-blur-md border-b border-gray-100/20"
    >
      {/* Left side - Logo and title */}
      <div className="flex items-center mr-8">
        <div className="bg-staffi-purple rounded-md w-8 h-8 flex items-center justify-center text-white font-bold shadow-md">
          S
        </div>
        <span className="text-xl font-bold text-staffi-purple ml-2 tracking-tight">STAFFI</span>
      </div>
      
      {/* Center nav items - fixed border radius regardless of scroll state */}
      <div className="flex-1 flex justify-center">
        <GlassPanel 
          className="flex items-center justify-center transition-all duration-300 w-auto rounded-full px-4"
          variant="light"
          animate={false}
        >
          <div className="hidden md:flex items-center justify-center space-x-1 backdrop-blur-sm rounded-full px-1.5 py-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ }) => cn(
                  "text-sm font-medium px-3 py-1.5 rounded-full transition-all whitespace-nowrap relative",
                  isActiveRoute(item.path)
                    ? "bg-white text-staffi-purple font-semibold shadow-sm" 
                    : "text-gray-700 hover:bg-white/50"
                )}
                end={item.path === "/dashboard"} // Only exact match for dashboard home
              >
                {item.name}
                {/* Remove the purple dot indicator */}
              </NavLink>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Right side controls - moved outside navbar */}
      <div className="flex items-center space-x-3 ml-8">
        <button className="p-2 rounded-full hover:bg-white/70 transition-colors hidden sm:flex">
          <Search className="h-5 w-5 text-gray-700" />
        </button>

        <button className="p-2 rounded-full hover:bg-white/70 transition-colors relative">
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-staffi-purple transition-all">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
              <AvatarFallback className="bg-staffi-purple text-white">SW</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer flex items-center"
              onClick={handleProfileClick}
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer flex items-center"
              onClick={handleSettingsClick}
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-500 focus:text-red-500"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile navigation - Apple-style dropdown */}
      <div className="md:hidden fixed top-[72px] left-0 right-0 flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 backdrop-blur-sm py-2 px-4 rounded-full shadow-lg border border-gray-100 text-gray-700 font-medium"
            >
              {navItems.find(item => isActiveRoute(item.path))?.name || "Menu"}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-1 bg-white/90 backdrop-blur-sm">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link 
                  to={item.path}
                  className={cn(
                    "cursor-pointer",
                    isActiveRoute(item.path) && "text-staffi-purple font-medium"
                  )}
                >
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default CenteredNavbar;
