
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaffiButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const StaffiButton = ({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  ...props
}: StaffiButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    primary: "bg-staffi-purple text-white hover:bg-staffi-purple-dark shadow-md",
    secondary: "bg-staffi-blue text-white hover:bg-opacity-90 shadow-md",
    outline: "bg-transparent border border-staffi-purple text-staffi-purple hover:bg-staffi-purple-light shadow-sm",
    ghost: "bg-transparent text-staffi-purple hover:bg-staffi-purple-light",
    link: "bg-transparent text-staffi-purple underline hover:text-staffi-purple-dark p-0"
  };

  const sizes = {
    sm: "text-sm px-3 py-1 rounded-md",
    md: "text-base px-5 py-2 rounded-lg",
    lg: "text-lg px-8 py-3 rounded-xl"
  };

  return (
    <button
      className={cn(
        "font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-staffi-purple focus:ring-offset-1",
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default StaffiButton;
