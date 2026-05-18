import React from "react";

interface BannerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Banner({ children, className = "" }: BannerProps) {
  return (
    <div className={`bg-muted/30 border border-border border-l-primary border-l-2 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm ${className}`}>
      <div className="flex-1 text-foreground font-medium">
        {children}
      </div>
    </div>
  );
}
