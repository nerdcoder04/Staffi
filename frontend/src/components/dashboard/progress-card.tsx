
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressCardProps {
  title: string
  value: number
  maxValue?: number
  className?: string
  children?: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info"
  animate?: boolean
  delay?: number
}

export function ProgressCard({ 
  title, 
  value, 
  maxValue = 100, 
  className, 
  children, 
  variant = "default",
  animate = false,
  delay = 0
}: ProgressCardProps) {
  const percentage = (value / maxValue) * 100;

  const progressVariants = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };

  const renderCard = () => (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:to-transparent before:opacity-50",
      className
    )}>
      <div className="relative z-10 p-6">
        <h3 className="font-medium text-base">{title}</h3>
        <div className="mt-4">
          <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
            {animate ? (
              <motion.div 
                className={cn("h-full rounded-full transition-all", progressVariants[variant])}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ 
                  duration: 1.2,
                  delay: delay,
                  ease: "easeOut"
                }}
              />
            ) : (
              <div 
                className={cn("h-full rounded-full transition-all", progressVariants[variant])} 
                style={{ width: `${percentage}%` }}
              />
            )}
          </div>
          {children}
        </div>
      </div>
    </Card>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.2 }}
      >
        {renderCard()}
      </motion.div>
    );
  }

  return renderCard();
}
