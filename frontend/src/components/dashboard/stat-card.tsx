
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  className?: string
  variant?: "default" | "success" | "warning" | "error" | "accent" | "purple"
  animate?: boolean
  delay?: number
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  className,
  variant = "default",
  animate = false,
  delay = 0,
  ...props 
}: StatCardProps) {
  const variants = {
    default: "bg-white",
    success: "bg-green-500/10",
    warning: "bg-amber-500/10",
    error: "bg-red-500/10",
    accent: "bg-staffi-purple/10",
    purple: "bg-gradient-to-br from-staffi-purple/80 to-staffi-blue/80 text-white"
  };

  const iconBackgrounds = {
    default: "bg-primary/10",
    success: "bg-green-500/20",
    warning: "bg-amber-500/20",
    error: "bg-red-500/20",
    accent: "bg-staffi-purple/20",
    purple: "bg-white/20"
  };
  
  const renderCard = () => (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg", 
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:to-transparent before:opacity-50",
        variants[variant],
        className
      )} 
      {...props}
    >
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={cn(
              "text-sm font-medium",
              variant === "purple" ? "text-white/80" : "text-muted-foreground"
            )}>
              {title}
            </p>
            <h3 className={cn(
              "text-2xl font-bold mt-1",
              variant === "purple" ? "text-white" : ""
            )}>
              {value}
            </h3>
            {subtitle && (
              <p className={cn(
                "text-sm mt-1",
                variant === "purple" ? "text-white/70" : "text-muted-foreground"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn("p-2 rounded-full", iconBackgrounds[variant])}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: delay * 0.2,
          ease: "easeOut"
        }}
      >
        {renderCard()}
      </motion.div>
    );
  }

  return renderCard();
}
