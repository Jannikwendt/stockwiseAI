import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PieChart as PieChartIcon, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, MessageSquare, Sparkles } from "lucide-react";
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
      navigate('/chat');
    } else {
      console.error("Risk profile not set.");
    }
  };

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Card className={cn("w-full max-w-xl overflow-hidden shadow-lg", className)}>
      {!completed ? (
        <>
          <CardHeader className="pb-4">
            <CardTitle>Risk Tolerance Assessment</CardTitle>
            <CardDescription>Answer these questions to determine your investment risk profile.</CardDescription>
            <Progress value={progress} />
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3>{question.question}</h3>
                <RadioGroup value={answers[question.id]} onValueChange={(value) => handleAnswer(question.id, value)}>
                  {question.options.map((opt) => (
                    <Label key={opt.value}>
                      <RadioGroupItem value={opt.value} /> {opt.label}
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <CardFooter>
            <Button onClick={handlePrevious} disabled={currentStep === 0}>Back</Button>
            <Button onClick={handleNext} disabled={!answers[question.id]}>{currentStep === questions.length - 1 ? "View Results" : "Next"}</Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader><CardTitle>Your Profile: {riskProfile?.profile}</CardTitle></CardHeader>
          <CardContent>
            <p>{riskProfile?.description}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleChatWithProfile}>Get personalized recommendations</Button>
            <Button onClick={handleReset}>Retake Assessment</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default RiskAssessment;
