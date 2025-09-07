import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LottieLoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

export const LottieLoader: React.FC<LottieLoaderProps> = ({ 
  size = 120, 
  className = "",
  text = "Loading your wellness journey..."
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <DotLottieReact
        src="https://lottie.host/d45fc01e-9216-4624-8ca2-37292fcf0ab7/A30DjBZUoW.lottie"
        loop
        autoplay
        style={{ width: size, height: size }}
      />
      {text && (
        <p className="text-muted-foreground mt-4 text-center">{text}</p>
      )}
    </div>
  );
};
