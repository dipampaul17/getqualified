import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  // Size mapping
  const sizeMap = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 }
  };
  
  const { width, height } = sizeMap[size];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="flex-shrink-0"
      >
        <rect width="32" height="32" rx="6" fill="black" />
        <path 
          d="M9 10.5C9 9.67157 9.67157 9 10.5 9H21.5C22.3284 9 23 9.67157 23 10.5C23 11.3284 22.3284 12 21.5 12H10.5C9.67157 12 9 11.3284 9 10.5Z" 
          fill="white"
        />
        <path 
          d="M9 16C9 15.1716 9.67157 14.5 10.5 14.5H21.5C22.3284 14.5 23 15.1716 23 16C23 16.8284 22.3284 17.5 21.5 17.5H10.5C9.67157 17.5 9 16.8284 9 16Z" 
          fill="white"
          fillOpacity="0.8"
        />
        <path 
          d="M10.5 20C9.67157 20 9 20.6716 9 21.5C9 22.3284 9.67157 23 10.5 23H21.5C22.3284 23 23 22.3284 23 21.5C23 20.6716 22.3284 20 21.5 20H10.5Z" 
          fill="white"
          fillOpacity="0.6"
        />
        <circle cx="24" cy="10.5" r="2" fill="white" />
      </svg>
      <span className="font-medium text-black tracking-tight">Qualified</span>
    </div>
  );
}

export function LogoSymbol({ className = "", size = "md" }: LogoProps) {
  // Size mapping
  const sizeMap = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 }
  };
  
  const { width, height } = sizeMap[size];
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <rect width="32" height="32" rx="6" fill="black" />
      <path 
        d="M9 10.5C9 9.67157 9.67157 9 10.5 9H21.5C22.3284 9 23 9.67157 23 10.5C23 11.3284 22.3284 12 21.5 12H10.5C9.67157 12 9 11.3284 9 10.5Z" 
        fill="white"
      />
      <path 
        d="M9 16C9 15.1716 9.67157 14.5 10.5 14.5H21.5C22.3284 14.5 23 15.1716 23 16C23 16.8284 22.3284 17.5 21.5 17.5H10.5C9.67157 17.5 9 16.8284 9 16Z" 
        fill="white"
        fillOpacity="0.8"
      />
      <path 
        d="M10.5 20C9.67157 20 9 20.6716 9 21.5C9 22.3284 9.67157 23 10.5 23H21.5C22.3284 23 23 22.3284 23 21.5C23 20.6716 22.3284 20 21.5 20H10.5Z" 
        fill="white"
        fillOpacity="0.6"
      />
      <circle cx="24" cy="10.5" r="2" fill="white" />
    </svg>
  );
}
