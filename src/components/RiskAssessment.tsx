
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  PieChart as PieChartIcon, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

type Question = {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
};

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

const riskProfiles: Record<RiskProfile, RiskProfileData> = {
  Conservative: {
    profile: "Conservative",
    description: "You prefer stability and lower risk. Your portfolio is designed to preserve capital while generating modest growth and income.",
    summary: "This portfolio emphasizes stability and income with lower volatility, suitable for short-term goals.",
    allocation: [
      { name: "Bonds", value: 50, color: "#9EA1FF" },
      { name: "Large Cap Stocks", value: 25, color: "#98E4FF" },
      { name: "Cash", value: 15, color: "#FFEF82" },
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
      { name: "Cash", value: 5, color: "#FFEF82" },
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

interface RiskAssessmentProps {
  className?: string;
  onCompleted?: (profile: RiskProfileData) => void;
}

const RiskAssessment = ({ className, onCompleted }: RiskAssessmentProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskProfileData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      let totalScore = 0;
      questions.forEach((question) => {
        const answer = answers[question.id];
        const option = question.options.find((opt) => opt.value === answer);
        if (option) {
          totalScore += option.score;
        }
      });

      let profile: RiskProfile;
      if (totalScore <= 8) {
        profile = "Conservative";
      } else if (totalScore <= 12) {
        profile = "Moderate";
      } else {
        profile = "Aggressive";
      }

      setRiskProfile(riskProfiles[profile]);
      setCompleted(true);
      
      if (onCompleted) {
        onCompleted(riskProfiles[profile]);
      }
      
      setIsAnimating(false);
    }
  };

  const handlePrevious = () => {
    if (isAnimating || currentStep === 0) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
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
    console.log("Starting chat with risk profile:", riskProfile?.profile);
  };

  const handleExploreStrategy = () => {
    console.log("Exploring investment strategy for:", riskProfile?.profile);
  };

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const customizedTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 rounded-lg shadow-lg border border-border text-sm">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-primary font-bold">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm border border-background/20 shadow-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium text-sm">{entry.value}: {entry.payload.value}%</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className={cn("w-full max-w-xl overflow-hidden shadow-lg", className)}>
      {!completed ? (
        <>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" />
              <CardTitle>Risk Tolerance Assessment</CardTitle>
            </div>
            <CardDescription>
              Answer these questions to determine your investment risk profile.
            </CardDescription>
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% completed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent className="min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-medium">{question.question}</h3>
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                  className="space-y-3"
                >
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center rounded-lg border p-4 transition-all duration-200",
                        answers[question.id] === option.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-input hover:border-primary/50 hover:bg-muted"
                      )}
                      onClick={() => handleAnswer(question.id, option.value)}
                    >
                      <RadioGroupItem
                        id={option.value}
                        value={option.value}
                        className="mr-3"
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-muted/40 p-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isAnimating}
              className="gap-1"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[question.id] || isAnimating}
              className="gap-1"
            >
              {currentStep < questions.length - 1 ? (
                <>
                  Next
                  <ArrowRight size={16} />
                </>
              ) : (
                "View Results"
              )}
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <CardTitle>Your Investment Profile</CardTitle>
            </div>
            <CardDescription>
              Based on your answers, we've determined your investor profile.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {riskProfile?.profile} Investor
                </h3>
                <p className="text-muted-foreground">
                  {riskProfile?.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium text-center">Recommended Asset Allocation</h4>
                <div className="h-[300px] w-full px-4 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskProfile?.allocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={3}
                        stroke="#ffffff"
                        animationDuration={1200}
                        animationBegin={400}
                      >
                        {riskProfile?.allocation.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            className="drop-shadow-md"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={customizedTooltip} />
                      <Legend 
                        content={renderLegend}
                        layout="horizontal" 
                        verticalAlign="bottom"
                        align="center"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="text-center mt-2 px-6">
                  <p className="text-foreground font-medium">{riskProfile?.summary}</p>
                </div>
              </div>

              <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
                <h4 className="text-base font-medium">Key Investment Characteristics</h4>
                <ul className="space-y-2">
                  {riskProfile?.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      <ChevronRight size={16} className="mt-0.5 text-primary flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-1">Best suited for:</h4>
                <p className="text-sm text-muted-foreground">{riskProfile?.suitableFor}</p>
              </div>
            </motion.div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 border-t bg-muted/40 p-4">
            <Button 
              onClick={handleChatWithProfile} 
              className="w-full gap-2"
            >
              <MessageSquare size={16} />
              Get personalized stock recommendations
            </Button>
            <Button 
              onClick={handleExploreStrategy}
              variant="secondary"
              className="w-full gap-2 group hover:shadow-md transition-all"
            >
              <Sparkles size={16} className="text-primary group-hover:animate-pulse" />
              <span>Explore Strategy</span>
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="w-full"
            >
              Retake Assessment
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default RiskAssessment;
