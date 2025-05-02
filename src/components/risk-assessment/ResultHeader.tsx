
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface ResultHeaderProps {
  profile: string;
  summary: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ profile, summary }) => {
  return (
    <>
      <CardTitle className="flex items-center gap-2 text-2xl">
        <CheckCircle2 className="text-primary h-5 w-5" />
        Your Risk Profile: {profile}
      </CardTitle>
      <CardDescription className="text-base pt-1">
        {summary}
      </CardDescription>
    </>
  );
};

export default ResultHeader;
