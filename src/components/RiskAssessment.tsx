import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PieChart as PieChartIcon, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

type Question = {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
};

type RiskProfile = "Conservative" | "Moderate" | "Aggressive";

interface RiskProfileData {
  profile: RiskProfile;
  description: string;
  allocation: {
    name: string;
    value: number;
    color: string;
  }[];
  summary: string;
  keyPoints: string[];
  suitableFor: string;
}

interface RiskAssessmentProps {
  className?: string;
  onCompleted?: (profile: RiskProfileData) => void;
}

const questions: Question[] = [
  {
    id: "experience",
    question: "How familiar are you with investing?",
    options: [
      { value: "beginner", label: "Beginner", score: 1 },
      { value: "some", label: "Some Experience", score: 2 },
      { value: "experienced", label: "Very Experienced", score: 3 },
    ],
  },
  {
    id: "risk",
    question: "How would you react if your portfolio lost 20% in a short time?",
    options: [
      { value: "sell", label: "Sell everything", score: 1 },
      { value: "wait", label: "Wait it out", score: 2 },
      { value: "buy", label: "Buy more while it's low", score: 3 },
    ],
  },
  {
    id: "goal",
    question: "What is your primary goal for investing?",
    options: [
      { value: "preserve", label: "Capital preservation", score: 1 },
      { value: "balanced", label: "Balanced growth", score: 2 },
      { value: "aggressive", label: "Aggressive growth", score: 3 },
    ],
  },
  {
    id: "timeHorizon",
    question: "When do you plan to use this money?",
    options: [
      { value: "short", label: "Within 3 years", score: 1 },
      { value: "medium", label: "3 to 10 years", score: 2 },
      { value: "long", label: "More than 10 years", score: 3 },
    ],
  },
  {
    id: "volatility",
    question: "Would you accept more short-term ups and downs for the chance of higher returns?",
    options: [
      { value: "no", label: "No", score: 1 },
      { value: "maybe", label: "Maybe", score: 2 },
      { value: "yes", label: "Yes", score: 3 },
    ],
  },
];

const riskProfiles: Record<RiskProfile, RiskProfileData> = {
  Conservative: {
    profile: "Conservative",
    description: "You prefer stability and lower risk. Your portfolio is designed to preserve capital while generating modest growth and income.",
    summary: "This portfolio emphasizes stability and income with lower volatility, suitable for short-term goals.",
    allocation: [
      { name: "Bonds", value: 50, color: "#9EA1FF" },
      { name: "Large Cap Stocks", value: 25, color: "#98E4FF" },
      { name: "Cash", value: 15, color: "#FDE1D3" }, // Replaced bright yellow with soft peach
      { name: "International", value: 10, color: "#FFA69E" },
    ],
    keyPoints: [
      "Focus on capital preservation and income",
      "Lower volatility and risk exposure",
      "Emphasis on high-quality bonds and dividend stocks",
      "More stable, predictable returns"
    ],
    suitableFor: "Investors nearing retirement or with short time horizons (1-3 years)"
  },
  Moderate: {
    profile: "Moderate",
    description: "You seek a balance between growth and safety. Your portfolio aims for long-term growth while managing volatility through diversification.",
    summary: "This portfolio balances growth potential with reasonable risk control through diversification.",
    allocation: [
      { name: "Large Cap Stocks", value: 40, color: "#98E4FF" },
      { name: "Bonds", value: 30, color: "#9EA1FF" },
      { name: "International", value: 15, color: "#FFA69E" },
      { name: "Mid Cap Stocks", value: 10, color: "#B8E0D2" },
      { name: "Cash", value: 5, color: "#FDE1D3" }, // Replaced bright yellow with soft peach
    ],
    keyPoints: [
      "Balance between growth and income",
      "Moderate volatility with diversification",
      "Mix of growth assets and defensive positions",
      "Reasonable returns with controlled risk"
    ],
    suitableFor: "Investors with medium time horizons (3-10 years) seeking balanced returns"
  },
  Aggressive: {
    profile: "Aggressive",
    description: "You prioritize growth potential and can tolerate higher volatility. Your portfolio is positioned for maximum long-term capital appreciation.",
    summary: "This portfolio maximizes growth potential with higher volatility, ideal for long-term investors.",
    allocation: [
      { name: "Large Cap Stocks", value: 45, color: "#98E4FF" },
      { name: "International", value: 25, color: "#FFA69E" },
      { name: "Mid Cap Stocks", value: 15, color: "#B8E0D2" },
      { name: "Small Cap Stocks", value: 10, color: "#C7F9CC" },
      { name: "Bonds", value: 5, color: "#9EA1FF" },
    ],
    keyPoints: [
      "Focus on capital appreciation and growth",
      "Higher volatility with greater return potential",
      "Emphasis on equities across market caps",
      "International diversification for growth opportunities"
    ],
    suitableFor: "Younger investors with long time horizons (10+ years) and higher risk tolerance"
  },
};

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ className, onCompleted }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskProfileData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      let totalScore = 0;
      questions.forEach((question) => {
        const option = question.options.find(opt => opt.value === answers[question.id]);
        if (option) totalScore += option.score;
      });

      const profile: RiskProfile = totalScore <= 8 ? "Conservative" : totalScore <= 12 ? "Moderate" : "Aggressive";
      const profileData = riskProfiles[profile];

      setRiskProfile(profileData);
      setCompleted(true);
      if (onCompleted) onCompleted(profileData);

      setIsAnimating(false);
    }
  };

  const handlePrevious = () => {
    if (isAnimating || currentStep === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setCompleted(false);
    setRiskProfile(null);
  };

  const handleChatWithProfile = () => {
    if (riskProfile) {
      localStorage.setItem('userRiskProfile', JSON.stringify(riskProfile));
      
      // Create and dispatch a custom event to trigger a chat message
      const event = new CustomEvent('triggerChatMessage', { 
        detail: { 
          profile: riskProfile.profile,
          description: riskProfile.description
        } 
      });
      window.dispatchEvent(event);
    } else {
      console.error("Risk profile not set.");
    }
  };

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Card className={cn(
      "w-full max-w-2xl shadow-lg", 
      "max-h-[85vh] overflow-y-auto",  // Added max height and vertical scrolling
      className
    )}>
      {!completed ? (
        <>
          <CardHeader className="pb-4 sticky top-0 bg-card z-10">
            <CardTitle className="text-2xl">Risk Tolerance Assessment</CardTitle>
            <CardDescription className="text-base">Answer these questions to determine your investment risk profile.</CardDescription>
            <Progress value={progress} className="h-2 mt-3" />
          </CardHeader>

          <CardContent className="py-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h3 className="text-xl font-medium">{question.question}</h3>
                <RadioGroup 
                  value={answers[question.id]} 
                  onValueChange={(value) => handleAnswer(question.id, value)}
                  className="space-y-4"
                >
                  {question.options.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/20 transition-colors">
                      <RadioGroupItem value={opt.value} id={`${question.id}-${opt.value}`} />
                      <Label htmlFor={`${question.id}-${opt.value}`} className="cursor-pointer text-base font-medium w-full">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <CardFooter className="pt-4 border-t flex justify-between sticky bottom-0 bg-card z-10">
            <Button 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              variant="ghost"
              className="gap-2"
            >
              <ArrowLeft size={16} /> Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!answers[question.id]}
              className="gap-2"
            >
              {currentStep === questions.length - 1 ? "View Results" : "Next"} 
              <ArrowRight size={16} />
            </Button>
          </CardFooter>
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-6" // Added bottom padding to ensure content isn't cut off
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="text-primary h-5 w-5" />
                Your Risk Profile: {riskProfile?.profile}
              </CardTitle>
              <CardDescription className="text-base pt-1">
                {riskProfile?.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-base">{riskProfile?.description}</p>
              
              {/* Donut Chart - Updated with reduced size, better spacing and legend positioning */}
              {riskProfile && (
                <div className="pt-10 pb-2"> {/* Increased top margin */}
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Recommended Portfolio Allocation
                  </h3>
                  <div className="h-[160px] w-full"> {/* Further reduced height */}
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={riskProfile.allocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={35} /* Further reduced from 40 */
                          outerRadius={60} /* Further reduced from 65 */
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          labelLine={false}
                        >
                          {riskProfile.allocation.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              stroke="var(--background)" 
                              strokeWidth={2} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-card p-2 border rounded-md shadow-sm">
                                  <p className="font-medium">{data.name}</p>
                                  <p>{`${data.value}%`}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingTop: 30, paddingBottom: 10 }} /* Increased margin between chart and legend */
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 pt-4 pb-10"> {/* Added more bottom padding */}
                <h4 className="font-medium">Suitable for:</h4>
                <p className="text-muted-foreground">{riskProfile?.suitableFor}</p>
                
                <h4 className="font-medium pt-2">Key points:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {riskProfile?.keyPoints.map((point, index) => (
                    <li key={index} className="text-muted-foreground">{point}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            
            {/* Footer with increased bottom padding */}
            <CardFooter className="pt-4 pb-8 border-t flex gap-3 flex-wrap sticky bottom-0 bg-card z-10"> 
              <Button 
                onClick={handleChatWithProfile} 
                variant="outline"
                size="lg"
                className="w-full"
              >
                View My Investment Chat
              </Button>
            </CardFooter>
          </motion.div>
        </AnimatePresence>
      )}
    </Card>
  );
};

export default RiskAssessment;
