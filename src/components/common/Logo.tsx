import logo from "@/assets/auto-hub-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const Logo = ({ size = 'md', onClick, className }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <img
      src={logo}
      alt="AutoHub Logo"
      className={cn(
        sizeClasses[size],
        'w-auto',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
    />
  );
};
