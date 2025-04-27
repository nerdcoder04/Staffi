
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import StaffiButton from "@/components/ui/staffi-button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleWalletConnect = () => {
    setIsWalletConnected(true);
    toast.success("Wallet Connected Successfully!", {
      description: "Redirecting to dashboard...",
      duration: 2000,
    });
    
    // Navigate to dashboard after a slight delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      // Smooth scroll to section
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 glass-effect"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center group"
        >
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-staffi-purple to-staffi-blue">
            STAFFI
          </span>
          <span className="text-sm font-bold ml-1 text-staffi-gray">Portal</span>
        </Link>

        {/* Desktop Navigation */}
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
            variant={isWalletConnected ? "outline" : "primary"} 
            size="sm"
            onClick={handleWalletConnect}
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {isWalletConnected ? "Connected" : "Connect Wallet"}
          </StaffiButton>
        </div>

        {/* Mobile Menu Button */}
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

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-full h-full bg-white z-50"
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
                <StaffiButton variant="primary" onClick={handleWalletConnect}>
                  Connect Wallet
                </StaffiButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
