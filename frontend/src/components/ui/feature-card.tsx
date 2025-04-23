
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  isBlockchain?: boolean;
  isAI?: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon,
  className,
  isBlockchain = false,
  isAI = false,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "apple-card group overflow-hidden relative border border-transparent",
        "hover:border-staffi-purple/20 transition-all duration-500",
        className
      )}
    >
      <div className="mb-4 text-staffi-purple text-3xl">{icon}</div>
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        {isBlockchain && (
          <span className="bg-staffi-purple-light text-staffi-purple text-xs font-medium px-2.5 py-0.5 rounded">
            Blockchain
          </span>
        )}
        {isAI && (
          <span className="bg-staffi-blue-light text-staffi-blue text-xs font-medium px-2.5 py-0.5 rounded">
            AI
          </span>
        )}
      </div>
      <p className="text-gray-600">{description}</p>
      
      {/* Apple-style gradient hover effect */}
      <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br from-staffi-purple/10 to-staffi-blue/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );
};

export default FeatureCard;
