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
    sm: 'h-6 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-16 w-auto'
  };

  return (
    <motion.div 
      className={`flex items-center cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={safeAnimate({ scale: 1.05 })}
      whileTap={safeAnimate({ scale: 0.95 })}
    >
      <div 
        className="relative bg-white dark:bg-transparent rounded overflow-hidden"
        style={{
          backgroundColor: 'white',
          padding: '2px'
        }}
      >
        <img 
          src="/major icon.jpg" 
          alt="iSpora Logo" 
          className={cn(sizeClasses[size])}
          style={{ 
            backgroundColor: 'white',
            mixBlendMode: 'multiply',
            objectFit: 'contain',
            imageRendering: 'auto',
            display: 'block',
            filter: 'contrast(1.1) brightness(1.05)',
            WebkitFilter: 'contrast(1.1) brightness(1.05)'
          }}
        />
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
