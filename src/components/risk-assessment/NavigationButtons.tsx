
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  currentStep, 
  totalSteps, 
  isDisabled, 
  onPrevious, 
  onNext 
}) => {
  return (
    <>
      <Button 
        onClick={onPrevious} 
        disabled={currentStep === 0}
        variant="ghost"
        className="gap-2"
      >
        <ArrowLeft size={16} /> Back
      </Button>
      <Button 
        onClick={onNext} 
        disabled={isDisabled}
        className="gap-2"
      >
        {currentStep === totalSteps - 1 ? "View Results" : "Next"} 
        <ArrowRight size={16} />
      </Button>
    </>
  );
};

export default NavigationButtons;
