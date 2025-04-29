import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StaffiButton from "@/components/ui/staffi-button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMetaMask } from "@/contexts/MetaMaskContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import RoleSelector from "@/components/auth/role-selector";
import EmployeeAuthForms from "@/components/auth/employee-auth-forms";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"hr" | "employee" | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { isConnected, openModal: openWalletModal, connect } = useMetaMask();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenAuthDialog = () => {
    setIsAuthDialogOpen(true);
    setSelectedRole(null);
    setShowLoginForm(true);
  };

  const handleRoleSelect = (role: "hr" | "employee") => {
    console.log("Role selected:", role);
    setSelectedRole(role);
    
    if (role === "hr") {
      // For HR, open MetaMask wallet connection
      openWalletModal();
      
      // If wallet connection is successful, navigate to HR dashboard
      // This check should be handled by the MetaMaskContext's onConnect callback
      // but for now we'll simulate it with a timeout
      setTimeout(() => {
        if (isConnected) {
          toast.success("HR authentication successful!", {
            description: "Redirecting to HR dashboard...",
            duration: 2000,
          });
          
          setTimeout(() => {
            navigate('/dashboard');
            setIsAuthDialogOpen(false);
          }, 2000);
        }
      }, 500);
    }
  };

  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Employee Login Successful!", {
      description: "Redirecting to employee dashboard...",
      duration: 2000,
    });
    
    setTimeout(() => {
      navigate('/employee-dashboard');
      setIsAuthDialogOpen(false);
    }, 2000);
  };

  const handleEmployeeSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Sign Up Request Submitted!", {
      description: "Your request has been sent to HR for approval.",
      duration: 3000,
    });
    
    // Reset form
    setEmail("");
    setPassword("");
    setName("");
    setDepartment("");
    setRole("");
    setShowLoginForm(true);
  };

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  console.log("Current auth state:", { 
    isAuthDialogOpen, 
    selectedRole,
    showLoginForm
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3 glass-effect" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center group">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-staffi-purple to-staffi-blue">
            STAFFI
          </span>
          <span className="text-sm font-bold ml-1 text-staffi-gray">Portal</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => handleNavigation('/')} 
            className="text-sm font-medium hover:text-staffi-purple transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigation('#features')} 
            className="text-sm font-medium hover:text-staffi-purple transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => handleNavigation('#how-it-works')} 
            className="text-sm font-medium hover:text-staffi-purple transition-colors"
          >
            How It Works
          </button>
          <StaffiButton 
            variant={isConnected ? "outline" : "primary"} 
            size="sm"
            onClick={handleOpenAuthDialog}
            className="flex items-center gap-2"
          >
            Sign In
          </StaffiButton>
        </div>

        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isMenuOpen ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 w-full h-full bg-white z-50 md:hidden"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-staffi-purple to-staffi-blue">
              STAFFI
            </span>
            <button onClick={() => setIsMenuOpen(false)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col p-6 space-y-6">
            <button 
              className="text-lg font-medium" 
              onClick={() => handleNavigation('/')}
            >
              Home
            </button>
            <button 
              className="text-lg font-medium" 
              onClick={() => handleNavigation('#features')}
            >
              Features
            </button>
            <button 
              className="text-lg font-medium" 
              onClick={() => handleNavigation('#how-it-works')}
            >
              How It Works
            </button>
            <StaffiButton variant="primary" onClick={handleOpenAuthDialog}>
              Sign In
            </StaffiButton>
          </div>
        </motion.div>

        <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            {!selectedRole ? (
              <RoleSelector 
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
              />
            ) : selectedRole === "employee" ? (
              <EmployeeAuthForms
                showLoginForm={showLoginForm}
                setShowLoginForm={setShowLoginForm}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                name={name}
                setName={setName}
                department={department}
                setDepartment={setDepartment}
                role={role}
                setRole={setRole}
                handleEmployeeLogin={handleEmployeeLogin}
                handleEmployeeSignup={handleEmployeeSignup}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </motion.nav>
  );
};

export default Navbar;