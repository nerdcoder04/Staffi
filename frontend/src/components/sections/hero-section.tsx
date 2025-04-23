
import { useRef, useEffect } from "react";
import StaffiButton from "@/components/ui/staffi-button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-staffi-purple rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-staffi-blue rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 py-20">
        <div 
          ref={heroRef} 
          className="max-w-5xl mx-auto text-center transition-all duration-1000 opacity-0 translate-y-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">STAFFI</span> - A Web3-enabled HR Management System
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Empowering companies with blockchain security, AI insights, and automated HR processes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <StaffiButton size="lg">
              Connect Wallet
            </StaffiButton>
            <StaffiButton variant="outline" size="lg">
              Learn More
            </StaffiButton>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 w-fit mx-auto">
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
          </div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Link to="#features" className="text-gray-400 hover:text-staffi-purple">
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
