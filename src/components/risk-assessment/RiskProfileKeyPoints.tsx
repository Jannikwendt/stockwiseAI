
import React from "react";

interface RiskProfileKeyPointsProps {
  suitableFor: string;
  keyPoints: string[];
}

const RiskProfileKeyPoints: React.FC<RiskProfileKeyPointsProps> = ({ suitableFor, keyPoints }) => {
  return (
    <div className="space-y-3 pt-4 pb-10">
      <h4 className="font-medium">Suitable for:</h4>
      <p className="text-muted-foreground">{suitableFor}</p>
      
      <h4 className="font-medium pt-2">Key points:</h4>
      <ul className="list-disc pl-5 space-y-1">
        {keyPoints.map((point, index) => (
          <li key={index} className="text-muted-foreground">{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default RiskProfileKeyPoints;
