
import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  term: string;
  explanation: string;
  className?: string;
}

const Tooltip = ({ term, explanation, className }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={cn("inline-flex items-center gap-1 rounded-md text-primary hover:underline focus:outline-none", className)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {term}
        <HelpCircle size={14} className="text-muted-foreground" />
      </button>
      
      {isVisible && (
        <div className="absolute z-50 w-64 animate-scale-in">
          <div className="mt-1 rounded-lg bg-card p-3 shadow-lg ring-1 ring-border">
            <p className="text-sm text-card-foreground">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
