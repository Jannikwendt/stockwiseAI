
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

interface QuestionFormProps {
  currentStep: number;
  question: Question;
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ currentStep, question, answers, onAnswer }) => {
  return (
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
          onValueChange={(value) => onAnswer(question.id, value)}
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
  );
};

export default QuestionForm;
