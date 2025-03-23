
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PieChart as PieChartIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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
    id: "q1",
    question: "How long do you plan to invest your money?",
    options: [
      { value: "short", label: "Less than 1 year", score: 1 },
      { value: "medium", label: "1-5 years", score: 2 },
      { value: "long", label: "More than 5 years", score: 3 },
    ],
  },
  {
    id: "q2",
    question: "If your investment dropped 20% in value, what would you do?",
    options: [
      { value: "sell", label: "Sell immediately to prevent further losses", score: 1 },
      { value: "partial", label: "Sell some and keep some", score: 2 },
      { value: "hold", label: "Hold and wait for recovery", score: 3 },
      { value: "buy", label: "Buy more at the lower price", score: 4 },
    ],
  },
  {
    id: "q3",
    question: "What's your primary investment goal?",
    options: [
      { value: "preserve", label: "Preserve capital with minimal risk", score: 1 },
      { value: "income", label: "Generate income through dividends", score: 2 },
      { value: "growth", label: "Growth with moderate risk", score: 3 },
      { value: "aggressive", label: "Maximum growth with higher risk", score: 4 },
    ],
  },
  {
    id: "q4",
    question: "How much investment experience do you have?",
    options: [
      { value: "none", label: "None or very little", score: 1 },
      { value: "some", label: "Some experience with basic investments", score: 2 },
      { value: "experienced", label: "Experienced investor", score: 3 },
    ],
  },
  {
    id: "q5",
    question: "What percentage of your total savings are you investing?",
    options: [
      { value: "small", label: "Less than 25%", score: 3 },
      { value: "moderate", label: "25% to 50%", score: 2 },
      { value: "substantial", label: "More than 50%", score: 1 },
    ],
  },
];

type RiskProfile = "Conservative" | "Moderate" | "Growth" | "Aggressive";

interface RiskProfileData {
  profile: RiskProfile;
  description: string;
  allocation: {
    name: string;
    value: number;
    color: string;
  }[];
  recommendations: string[];
}

const riskProfiles: Record<RiskProfile, RiskProfileData> = {
  Conservative: {
    profile: "Conservative",
    description: "You prefer stability and low risk, prioritizing capital preservation over high returns.",
    allocation: [
      { name: "Bonds", value: 60, color: "#8884d8" },
      { name: "Large Cap", value: 25, color: "#82ca9d" },
      { name: "Cash", value: 10, color: "#ffc658" },
      { name: "Int'l", value: 5, color: "#ff8042" },
    ],
    recommendations: [
      "Treasury bonds and high-quality corporate bonds",
      "Dividend-focused ETFs like VYM or SCHD",
      "Low-volatility ETFs like SPLV or USMV",
      "Blue-chip stocks with stable histories"
    ]
  },
  Moderate: {
    profile: "Moderate",
    description: "You seek a balance between growth and security, accepting some risk for potentially higher returns.",
    allocation: [
      { name: "Bonds", value: 40, color: "#8884d8" },
      { name: "Large Cap", value: 35, color: "#82ca9d" },
      { name: "Mid Cap", value: 10, color: "#ffc658" },
      { name: "Int'l", value: 10, color: "#ff8042" },
      { name: "Cash", value: 5, color: "#8dd1e1" },
    ],
    recommendations: [
      "Balanced ETFs like AOK or AOM",
      "S&P 500 index funds like VOO or SPY",
      "Total market ETFs like VTI",
      "Some sector-specific ETFs in stable sectors"
    ]
  },
  Growth: {
    profile: "Growth",
    description: "You aim for substantial growth and can tolerate market fluctuations for potentially higher long-term returns.",
    allocation: [
      { name: "Large Cap", value: 45, color: "#82ca9d" },
      { name: "Mid Cap", value: 20, color: "#ffc658" },
      { name: "Int'l", value: 15, color: "#ff8042" },
      { name: "Small Cap", value: 10, color: "#8dd1e1" },
      { name: "Bonds", value: 10, color: "#8884d8" },
    ],
    recommendations: [
      "Growth-oriented ETFs like VUG or QQQ",
      "Mid-cap ETFs like VO or IJH",
      "International ETFs like VXUS or EFA",
      "Targeted sector ETFs in technology or healthcare"
    ]
  },
  Aggressive: {
    profile: "Aggressive",
    description: "You seek maximum growth and can handle significant volatility, focusing on long-term appreciation.",
    allocation: [
      { name: "Large Cap", value: 35, color: "#82ca9d" },
      { name: "Mid Cap", value: 25, color: "#ffc658" },
      { name: "Small Cap", value: 15, color: "#8dd1e1" },
      { name: "Int'l", value: 20, color: "#ff8042" },
      { name: "Bonds", value: 5, color: "#8884d8" },
    ],
    recommendations: [
      "Growth ETFs like VUG or VONG",
      "Technology-focused ETFs like VGT or XLK",
      "Emerging market ETFs like VWO or IEMG",
      "Small-cap ETFs like VB or IJR"
    ]
  },
};

interface RiskAssessmentProps {
  className?: string;
  onCompleted?: (profile: RiskProfileData) => void;
}

const RiskAssessment = ({ className, onCompleted }: RiskAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskProfileData | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Calculate risk score
      let totalScore = 0;
      questions.forEach((question) => {
        const answer = answers[question.id];
        const option = question.options.find((opt) => opt.value === answer);
        if (option) {
          totalScore += option.score;
        }
      });

      // Determine risk profile based on score
      let profile: RiskProfile;
      if (totalScore <= 8) {
        profile = "Conservative";
      } else if (totalScore <= 12) {
        profile = "Moderate";
      } else if (totalScore <= 16) {
        profile = "Growth";
      } else {
        profile = "Aggressive";
      }

      setRiskProfile(riskProfiles[profile]);
      setCompleted(true);
      
      if (onCompleted) {
        onCompleted(riskProfiles[profile]);
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setCompleted(false);
    setRiskProfile(null);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className={cn("w-full max-w-xl overflow-hidden", className)}>
      {!completed ? (
        <>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" />
              <CardTitle>Risk Tolerance Assessment</CardTitle>
            </div>
            <CardDescription>
              Answer these questions to determine your investment risk profile.
            </CardDescription>
            <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{question.question}</h3>
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center rounded-md border border-border p-3 transition-colors",
                        answers[question.id] === option.value
                          ? "border-primary bg-primary/5"
                          : "hover:bg-accent"
                      )}
                      onClick={() => handleAnswer(question.id, option.value)}
                    >
                      <RadioGroupItem
                        id={option.value}
                        value={option.value}
                        className="mr-2"
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[question.id]}
              className="gap-1"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next <ArrowRight size={16} />
                </>
              ) : (
                "View Results"
              )}
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-success" />
              <CardTitle>Your Risk Profile</CardTitle>
            </div>
            <CardDescription>
              Based on your answers, we've determined your investor profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-primary">
                  {riskProfile?.profile}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {riskProfile?.description}
                </p>
              </div>

              <div className="rounded-md border border-border bg-card/50 p-4">
                <h4 className="mb-4 text-sm font-medium">
                  Recommended Asset Allocation
                </h4>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskProfile?.allocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                        }) => {
                          const radius =
                            innerRadius + (outerRadius - innerRadius) * 1.4;
                          const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              fill="currentColor"
                              fontSize={12}
                            >
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                      >
                        {riskProfile?.allocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">
                  Suggested Investments
                </h4>
                <ul className="space-y-1">
                  {riskProfile?.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                        {index + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleReset} className="w-full">
              Retake Assessment
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default RiskAssessment;
