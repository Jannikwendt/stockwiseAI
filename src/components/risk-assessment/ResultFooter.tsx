
import React from "react";
import { Button } from "@/components/ui/button";

interface ResultFooterProps {
  onChatWithProfile: () => void;
}

const ResultFooter: React.FC<ResultFooterProps> = ({ onChatWithProfile }) => {
  return (
    <Button 
      onClick={onChatWithProfile} 
      variant="outline"
      size="lg"
      className="w-full"
    >
      View My Investment Chat
    </Button>
  );
};

export default ResultFooter;
