import { useRef, useEffect, useState } from "react";
import StaffiButton from "@/components/ui/staffi-button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMetaMask } from "@/contexts/MetaMaskContext";
import { useUser } from "@/contexts/UserContext";
import { loginHR } from "@/lib/api";

// Setup logger function for debugging
const logEvent = (event: string, data?: any) => {
  console.log(`[STAFFI Auth] ${event}`, data || '');
};

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isConnected, account, connect, disconnect, openModal } = useMetaMask();
  const { setUser } = useUser();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasFailedAuth, setHasFailedAuth] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    const heroElement = heroRef.current;
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => {
      if (heroElement) {
        observer.unobserve(heroElement);
      }
    };
  }, []);

  // Effect to authenticate when account changes and hasn't just failed auth
  useEffect(() => {
    const handleAccountChange = async () => {
      if (isConnected && account && !isAuthenticating) {
        if (hasFailedAuth) {
          // Reset the failed auth state but don't automatically authenticate
          setHasFailedAuth(false);
          logEvent('Account changed after failed auth, awaiting manual login attempt');
        } else {
          logEvent('Account connected, attempting authentication', account);
          await authenticateHR(account);
        }
      }
    };

    handleAccountChange();
  }, [account, isConnected]);

  const disconnectWallet = async () => {
    logEvent('Disconnecting wallet');
    try {
      await disconnect();
      setHasFailedAuth(true);
      logEvent('Wallet disconnected successfully');
    } catch (error) {
      logEvent('Error disconnecting wallet', error);
    }
  };

  const authenticateHR = async (walletAddress: string) => {
    if (!walletAddress) {
      logEvent('Authentication failed - No wallet address provided');
      return false;
    }
    
    setIsAuthenticating(true);
    logEvent('Starting authentication', { walletAddress });
    
    try {
      const result = await loginHR(walletAddress);
      logEvent('Authentication response received', result);

      if (result.success && result.data) {
        // User authenticated successfully
        setUser(result.data.user);
        setHasFailedAuth(false);
        logEvent('Authentication successful', result.data.user);
        
        toast.success("Login successful", {
          description: `Welcome back, ${result.data.user.name}`,
          duration: 3000,
          position: "bottom-center",
          className: "bg-white text-gray-900"
        });
        
        navigate('/dashboard');
        return true;
      } else {
        // Authentication failed
        logEvent('Authentication failed - HR user not found', result.error);
        
        toast.error("Authentication failed", {
          description: "HR user not found for this wallet. Please use a registered wallet.",
          duration: 5000,
          position: "bottom-center",
          className: "bg-white text-gray-900"
        });
        
        await disconnectWallet();
        return false;
      }
    } catch (error) {
      logEvent('Authentication error', error);
      
      toast.error("Authentication error", {
        description: "Failed to authenticate with the server. Please try again.",
        duration: 3000,
        position: "bottom-center",
        className: "bg-white text-gray-900"
      });
      
      await disconnectWallet();
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleConnectWallet = async () => {
    if (isConnected && account && !hasFailedAuth) {
      // If already connected and hasn't failed authentication, try to authenticate
      logEvent('Already connected, attempting authentication', account);
      await authenticateHR(account);
      return;
    }
    
    // If the wallet is connected but auth failed previously, disconnect before trying again
    if (isConnected && hasFailedAuth) {
      logEvent('Disconnecting before reconnecting due to previous authentication failure');
      await disconnectWallet();
    }
    
    try {
      // Open MetaMask modal for connection
      logEvent('Opening MetaMask modal');
      openModal();
      
      toast.success("Select your wallet to continue", {
        description: "Connect with MetaMask to access the dashboard",
        duration: 2000,
        position: "bottom-center",
        className: "bg-white text-gray-900"
      });
      
      // The account connection will be handled by the useEffect above
      // when the account state changes
    } catch (error) {
      logEvent('Failed to open wallet selection', error);
      
      toast.error("Failed to open wallet selection", {
        description: "Please try again",
        duration: 3000,
        position: "bottom-center",
        className: "bg-white text-gray-900"
      });
    }
  };

  const handleLearnMore = () => {
    // Smooth scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background decorative elements with animation */}
      <motion.div 
        className="absolute top-20 right-10 w-32 h-32 bg-staffi-purple rounded-full opacity-10" 
        animate={{ 
          y: [0, -30, 0], 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 left-10 w-24 h-24 bg-staffi-blue rounded-full opacity-10" 
        animate={{ 
          y: [0, 20, 0], 
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      <div className="container mx-auto px-4 py-20">
        <div 
          ref={heroRef} 
          className="max-w-5xl mx-auto text-center transition-all duration-1000 opacity-0 translate-y-10"
        >
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="text-gradient">STAFFI</span> - A Web3-enabled HR Management System
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Empowering companies with blockchain security, AI insights, and automated HR processes.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <StaffiButton size="lg" onClick={handleConnectWallet} disabled={isAuthenticating}>
              {isAuthenticating ? 'Authenticating...' : isConnected && !hasFailedAuth ? 'Dashboard' : 'Connect Wallet'}
            </StaffiButton>
            <StaffiButton variant="outline" size="lg" onClick={handleLearnMore}>
              Learn More
            </StaffiButton>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col md:flex-row justify-center items-center gap-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 w-fit mx-auto"
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-staffi-purple mb-2">100%</div>
              <div className="text-gray-600">Secure & Transparent</div>
            </div>
            <div className="h-16 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-staffi-purple mb-2">AI</div>
              <div className="text-gray-600">Powered Insights</div>
            </div>
            <div className="h-16 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-staffi-purple mb-2">NFT</div>
              <div className="text-gray-600">Certifications</div>
            </div>
          </motion.div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Link to="#features" id="features" className="text-gray-400 hover:text-staffi-purple">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;