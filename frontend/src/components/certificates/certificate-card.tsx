
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  User, 
  Calendar, 
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Certificate {
  id: string;
  skillTitle: string;
  description: string;
  employee: string;
  employeeWallet: string;
  issueDate: string;
  txHash: string;
  issuer: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  delay?: number;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ 
  certificate,
  delay = 0
}) => {
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const handleViewOnBlockchain = () => {
    // For a real implementation, this would link to the actual blockchain explorer
    // For now, we'll open a mock Polygonscan URL
    window.open(`https://mumbai.polygonscan.com/tx/${certificate.txHash}`, '_blank');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={cn(
        "overflow-hidden border-0 h-full",
        "bg-gradient-to-br from-white to-gray-50",
        "hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)]",
        "transition-all duration-300 ease-out",
        "shadow-[0_5px_30px_-15px_rgba(0,0,0,0.15)]",
        // 3D effect styling
        "relative before:absolute before:inset-0",
        "before:bg-gradient-to-br before:from-white/50 before:to-transparent",
        "before:opacity-50 before:z-0",
        // Certificate border
        "certificate-border"
      )}>
        {/* Certificate Header - Purple gradient banner */}
        <div className="h-12 bg-gradient-to-r from-staffi-purple to-staffi-blue relative overflow-hidden">
          {/* Certificate pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <rect width="50" height="50" fill="url(#smallGrid)"/>
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Certificate badge/icon */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-white rounded-full p-2 shadow-md">
              <div className="bg-gradient-to-br from-staffi-purple to-staffi-blue rounded-full p-2">
                <Award className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <CardHeader className="pt-8 pb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg line-clamp-2">{certificate.skillTitle}</h3>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1 items-center">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          {certificate.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{certificate.description}</p>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">{certificate.employee}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-gray-500">{formatWalletAddress(certificate.employeeWallet)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{certificate.employeeWallet}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-gray-900">Issued on {formatDate(certificate.issueDate)}</span>
                <span className="text-xs text-gray-500">by {certificate.issuer}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-3 pb-4">
          <Button 
            variant="outline" 
            className="w-full hover:bg-staffi-purple hover:text-white flex items-center gap-2 group"
            onClick={handleViewOnBlockchain}
          >
            <ExternalLink className="h-4 w-4 group-hover:text-white" />
            View on Blockchain
          </Button>
        </CardFooter>
        
        {/* Animated glow effect */}
        <div className="certificate-glow"></div>
      </Card>
    </motion.div>
  );
};
