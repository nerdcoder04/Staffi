
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "dark" | "light" | "accent" | "purple"
  animate?: boolean
}

export function GlassPanel({ 
  children, 
  className, 
  variant = "default",
  animate = false,
  ...props 
}: GlassPanelProps) {
  const variants = {
    default: "bg-white/80 backdrop-blur-sm border-white/20 before:from-white/50",
    dark: "bg-gray-900/80 backdrop-blur-sm border-gray-800/40 before:from-gray-700/30 text-white",
    light: "bg-gray-50/80 backdrop-blur-sm border-gray-100/40 before:from-white/80",
    accent: "bg-staffi-purple/10 backdrop-blur-sm border-staffi-purple/20 before:from-staffi-purple/10",
    purple: "bg-gradient-to-br from-staffi-purple/90 to-staffi-purple/70 backdrop-blur-sm border-staffi-purple/30 text-white"
  }
  
  const renderContent = () => (
    <div 
      className={cn(
        "rounded-3xl shadow-lg border relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:to-transparent before:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderContent()}
      </motion.div>
    );
  }
  
  return renderContent();
}
