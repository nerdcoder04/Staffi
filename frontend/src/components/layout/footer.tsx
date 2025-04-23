
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-staffi-purple to-staffi-blue">
                STAFFI
              </span>
              <span className="text-sm font-bold ml-1 text-staffi-gray">Portal</span>
            </div>
            <p className="text-gray-600 mb-6">
              A Web3-enabled HR Management System that empowers companies with blockchain security and AI insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-staffi-purple transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 5.16c-.82.36-1.7.6-2.62.7.94-.56 1.66-1.45 2-2.5-.88.52-1.86.9-2.9 1.1A4.48 4.48 0 0 0 15.5 3c-2.5 0-4.5 2-4.5 4.5 0 .35.04.69.12 1.02C7.63 8.3 4.24 6.53 2 3.84c-.4.72-.65 1.55-.65 2.44 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.38.1-.78.16-1.2.16-.3 0-.58-.03-.87-.08.58 1.8 2.26 3.12 4.25 3.16A9 9 0 0 1 0 19.4 12.68 12.68 0 0 0 7.2 21c8.21 0 12.7-6.78 12.7-12.7 0-.2 0-.38-.01-.57.87-.63 1.64-1.43 2.24-2.34l-.13.02z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-staffi-purple transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm8 7h-2v-3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V17h-2V9h2v1.5c.57-.95 1.64-1.5 2.5-1.5 1.93 0 3.5 1.57 3.5 3.5V17z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-staffi-purple transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.162c3.204 0 3.584.012 4.849.07 1.308.06 2.655.358 3.608 1.311.962.962 1.251 2.296 1.311 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.06 1.308-.358 2.655-1.311 3.608-.962.962-2.296 1.251-3.608 1.311-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.308-.06-2.655-.358-3.608-1.311-.962-.962-1.251-2.296-1.311-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.06-1.308.358-2.655 1.311-3.608.962-.962 2.296-1.251 3.608-1.311 1.265-.058 1.645-.07 4.849-.07zM12 0C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.643.673 18.801.157 16.948.072 15.668.014 15.259 0 12 0z"/>
                  <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                  <circle cx="18.406" cy="5.594" r="1.44"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-staffi-purple transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.53 11.53 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.823 1.102.823 2.222v3.293c0 .32.192.694.8.576C20.568 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Features</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/features/employees" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Employee Management
                </Link>
              </li>
              <li>
                <Link to="/features/leave" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Leave Management
                </Link>
              </li>
              <li>
                <Link to="/features/payroll" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Payroll Automation
                </Link>
              </li>
              <li>
                <Link to="/features/ai" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  AI Performance Prediction
                </Link>
              </li>
              <li>
                <Link to="/features/nfts" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Skill Certification NFTs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Smart Contracts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Setup Guide
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-staffi-purple transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} STAFFI. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-gray-500 hover:text-staffi-purple text-sm">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-500 hover:text-staffi-purple text-sm">
                  Terms of Service
                </Link>
                <Link to="/contact" className="text-gray-500 hover:text-staffi-purple text-sm">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
