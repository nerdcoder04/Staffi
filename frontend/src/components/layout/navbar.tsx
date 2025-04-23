
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StaffiButton from "@/components/ui/staffi-button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
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
          <Link to="/" className="text-sm font-medium hover:text-staffi-purple transition-colors">
            Home
          </Link>
          <Link to="/features" className="text-sm font-medium hover:text-staffi-purple transition-colors">
            Features
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-staffi-purple transition-colors">
            About
          </Link>
          <StaffiButton variant="primary" size="sm">
            Connect Wallet
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
        <div
          className={`fixed top-0 left-0 w-full h-full bg-white transform transition-transform ease-in-out duration-300 md:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
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
            <Link to="/" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/features" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link to="/about" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <StaffiButton variant="primary" onClick={() => setIsMenuOpen(false)}>
              Connect Wallet
            </StaffiButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
