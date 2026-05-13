import React from "react";

interface ScoreBarProps {
  score: number;
  className?: string;
}

export default function ScoreBar({ score, className = "" }: ScoreBarProps) {
  const getStatusColor = (s: number) => {
    if (s >= 85) return "bg-[#daf624]";
    if (s >= 70) return "bg-white";
    return "bg-white/40";
  };

  const getTextColor = (s: number) => {
    if (s >= 85) return "text-[#daf624]";
    return "text-white/60";
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-out ${getStatusColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-bold tracking-tight min-w-[32px] ${getTextColor(score)}`}>
        {score}%
      </span>
    </div>
  );
}
