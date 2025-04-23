
import { useRef, useEffect } from "react";
import FeatureCard from "@/components/ui/feature-card";
import { Users, Calendar, DollarSign, BarChart, Award, LayoutDashboard, MessageSquare } from "lucide-react";

const FeaturesSection = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
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

    const featuresElement = featuresRef.current;
    if (featuresElement) {
      observer.observe(featuresElement);
    }

    return () => {
      if (featuresElement) {
        observer.unobserve(featuresElement);
      }
    };
  }, []);

  const features = [
    {
      title: "Employee Management",
      description: "Store employee data securely and immutably on the blockchain, ensuring data integrity and privacy.",
      icon: <Users />,
      isBlockchain: true,
      isAI: false,
    },
    {
      title: "Leave Management",
      description: "Apply and approve leaves through a transparent and automated process using smart contracts.",
      icon: <Calendar />,
      isBlockchain: true,
      isAI: false,
    },
    {
      title: "Payroll Automation",
      description: "Automate salary payouts securely with blockchain verification to ensure timely and accurate payments.",
      icon: <DollarSign />,
      isBlockchain: true,
      isAI: false,
    },
    {
      title: "Performance Prediction",
      description: "Leverage AI to predict employee engagement risks and proactively address potential issues.",
      icon: <BarChart />,
      isBlockchain: false,
      isAI: true,
    },
    {
      title: "Skill Certification NFTs",
      description: "Issue tamper-proof skill certificates as NFTs that employees can own and showcase anywhere.",
      icon: <Award />,
      isBlockchain: true,
      isAI: false,
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive oversight with AI-powered insights to make data-driven decisions.",
      icon: <LayoutDashboard />,
      isBlockchain: false,
      isAI: true,
    },
    {
      title: "Feedback System",
      description: "Optional anonymous feedback storage with end-to-end encryption for honest communication.",
      icon: <MessageSquare />,
      isBlockchain: false,
      isAI: false,
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div 
          ref={featuresRef}
          className="text-center mb-16 transition-all duration-1000 opacity-0 translate-y-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Full Features List
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive HR solution combines the power of blockchain and AI
            to revolutionize how you manage your workforce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="opacity-0 translate-y-10"
              style={{ 
                transitionProperty: 'all',
                transitionDuration: '1000ms',
                transitionDelay: `${index * 100}ms`
              }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                isBlockchain={feature.isBlockchain}
                isAI={feature.isAI}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-md text-sm font-medium">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-gray-700 mr-1">Blockchain writes</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-gray-700">Local backend only</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
