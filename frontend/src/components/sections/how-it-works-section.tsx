
import { useRef, useEffect } from "react";

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const section = entry.target;
          section.classList.add("opacity-100");
          section.classList.remove("opacity-0", "translate-y-10");
          
          // Animate steps with delay
          const steps = section.querySelectorAll(".step-item");
          steps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add("opacity-100", "translate-x-0");
              step.classList.remove("opacity-0", "translate-x-10");
            }, 300 * (index + 1));
          });
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    const sectionElement = sectionRef.current;
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Simply connect your blockchain wallet to get started with our secure system."
    },
    {
      number: "02",
      title: "Set Up Organization",
      description: "Create your organization profile and define roles and permissions."
    },
    {
      number: "03",
      title: "Add Employees",
      description: "Add employee data securely to the blockchain, ensuring privacy and immutability."
    },
    {
      number: "04",
      title: "Configure Features",
      description: "Choose which features to enable: payroll, leave management, certifications, etc."
    },
    {
      number: "05",
      title: "Start Managing",
      description: "Enjoy a trustless, AI-powered, transparent HR management system."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div 
          ref={sectionRef}
          className="max-w-5xl mx-auto transition-all duration-1000 opacity-0 translate-y-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            How STAFFI Works
          </h2>
          <p className="text-xl text-gray-600 mb-16 text-center max-w-2xl mx-auto">
            Getting started with our Web3-enabled HR system is simple and straightforward
          </p>

          <div className="space-y-12 relative">
            {/* Vertical timeline line */}
            <div className="absolute top-0 bottom-0 left-12 md:left-24 w-0.5 bg-gray-200"></div>
            
            {steps.map((step, index) => (
              <div 
                key={index}
                className="step-item flex items-start opacity-0 translate-x-10 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="w-24 h-24 md:w-48 md:h-48 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-staffi-purple flex items-center justify-center z-10 text-staffi-purple font-semibold">
                      {step.number}
                    </div>
                  </div>
                </div>
                <div className="ml-4 pt-3">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
