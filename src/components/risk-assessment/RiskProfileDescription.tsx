
import React from "react";

interface RiskProfileDescriptionProps {
  description: string;
}

const RiskProfileDescription: React.FC<RiskProfileDescriptionProps> = ({ description }) => {
  return (
    <p className="text-base">{description}</p>
  );
};

export default RiskProfileDescription;
