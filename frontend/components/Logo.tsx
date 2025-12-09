import React from 'react';
import { motion } from 'motion/react';
import { safeAnimate, safeTransition } from './utils/animationUtils';
import { cn } from './ui/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Logo({ size = 'md', showText = true, className = '', onClick }: LogoProps) {
  const sizeClasses = {
    sm: { container: 'h-6 w-6', text: 'text-[10px]' },
    md: { container: 'h-10 w-10', text: 'text-xs' },
    lg: { container: 'h-16 w-16', text: 'text-base' }
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div 
      className={`flex items-center cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={safeAnimate({ scale: 1.05 })}
      whileTap={safeAnimate({ scale: 0.95 })}
    >
      <div 
        className={cn(
          "relative bg-primary rounded-full flex items-center justify-center",
          currentSize.container
        )}
        style={{
          backgroundColor: 'hsl(220 100% 40%)', // Brand blue from CSS variables
        }}
      >
        <span 
          className={cn(
            "text-white font-bold font-mona text-center leading-none",
            currentSize.text
          )}
          style={{
            fontFamily: 'Mona Sans, Inter, system-ui, -apple-system, sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap'
          }}
        >
          iSpora
        </span>
      </div>
      {showText && (
        <div className="hidden sm:block ml-3">
          <span className="text-sm text-muted-foreground font-mona">
            The Impact Engine
          </span>
        </div>
      )}
    </motion.div>
  );
}
