
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KeyMetricsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg?: string;
}

const KeyMetricsCard: React.FC<KeyMetricsCardProps> = ({ 
  icon, 
  label, 
  value,
  iconBg = "bg-staffi-purple-light"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1"
    >
      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-4 flex items-center gap-4">
          <div className={cn("p-3 rounded-xl", iconBg)}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-3xl font-semibold">{value}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const KeyMetricsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <KeyMetricsCard 
        icon={<Users className="h-5 w-5 text-staffi-purple" />}
        label="Total Employees"
        value="156"
      />
      <KeyMetricsCard 
        icon={<UserPlus className="h-5 w-5 text-staffi-blue" />}
        label="Total Hirings"
        value="104"
        iconBg="bg-staffi-blue-light"
      />
      <KeyMetricsCard 
        icon={<Briefcase className="h-5 w-5 text-amber-600" />}
        label="Total Projects"
        value="185"
        iconBg="bg-amber-100"
      />
    </div>
  );
};

export default KeyMetricsSection;
