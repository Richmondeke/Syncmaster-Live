import React from "react";

interface BannerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Banner({ children, className = "" }: BannerProps) {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 border-l-[#daf624] border-l-2 p-4 rounded-xl flex items-center justify-between gap-4 shadow-xl ${className}`}>
      <div className="flex-1 text-white font-medium">
        {children}
      </div>
    </div>
  );
}
