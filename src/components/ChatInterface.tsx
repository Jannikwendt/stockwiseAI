
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send, Sparkles, Bot, User as UserIcon, RefreshCw } from "lucide-react";
import Tooltip from "@/components/Tooltip";

type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm StockWise AI, your personal investment assistant. How can I help you today? You can ask me about stocks, investment concepts, or get personalized recommendations.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Example responses to simulate AI behavior
      let responseText = "";
      const query = input.toLowerCase();

      if (query.includes("apple") || query.includes("aapl")) {
        responseText = "Apple Inc. (AAPL) is currently trading at $178.72. The stock has shown strong performance over the past year with a 15.3% increase. Analysts generally rate it as a 'Buy' with a price target of $195. Apple has a P/E ratio of 29.5, which is slightly higher than the technology sector average.";
      } else if (query.includes("p/e ratio") || query.includes("pe ratio")) {
        responseText = "The Price-to-Earnings (P/E) ratio is a valuation metric that compares a company's stock price to its earnings per share. A high P/E ratio may indicate that investors expect high growth rates in the future, while a low P/E ratio might suggest the company is undervalued or experiencing challenges.";
      } else if (query.includes("volatility")) {
        responseText = "Volatility measures how much a stock's price fluctuates over time. Higher volatility indicates larger price swings and is often associated with higher risk. For beginner investors, lower volatility stocks are generally recommended as they tend to be more stable.";
      } else if (query.includes("recommend") || query.includes("suggestion")) {
        responseText = "Based on your beginner investor profile, I would recommend considering Exchange-Traded Funds (ETFs) that track major indices like the S&P 500. These provide instant diversification and typically have lower fees. Some beginner-friendly ETFs include VOO, SPY, and VTI. Would you like me to explain more about any of these options?";
      } else {
        responseText = "I understand you're interested in learning more about investing. As a beginner, it's important to start with fundamentals. Would you like me to explain some basic investment concepts, or are you looking for specific stock information?";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ChatBubble = ({ message }: { message: Message }) => {
    const isUser = message.role === "user";

    return (
      <div
        className={cn(
          "mb-4 flex w-full",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "flex max-w-[80%] items-start gap-3 rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground border border-border"
          )}
        >
          <div className="mt-1 shrink-0">
            {isUser ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground text-primary">
                <UserIcon size={16} />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot size={16} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="prose prose-sm dark:prose-invert">
              {message.content.split(/\b(P\/E ratio|volatility|ETFs)\b/).map((part, i) => {
                if (part === "P/E ratio") {
                  return (
                    <Tooltip
                      key={i}
                      term="P/E ratio"
                      explanation="Price-to-Earnings ratio compares a company's share price to its earnings per share. It helps investors determine if a stock is overvalued or undervalued."
                    />
                  );
                } else if (part === "volatility") {
                  return (
                    <Tooltip
                      key={i}
                      term="volatility"
                      explanation="A measure of how much a stock's price fluctuates over time. Higher volatility generally indicates higher risk."
                    />
                  );
                } else if (part === "ETFs") {
                  return (
                    <Tooltip
                      key={i}
                      term="ETFs"
                      explanation="Exchange-Traded Funds are investment funds traded on stock exchanges that hold assets like stocks, bonds, or commodities. They typically track an index and offer diversification."
                    />
                  );
                }
                return part;
              })}
            </div>
            <div className="mt-1 text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="mb-4 space-y-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw size={14} className="animate-spin" />
              <span>StockWise AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            title="Get AI suggestions"
          >
            <Sparkles size={16} className="text-primary" />
          </Button>
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about stocks, concepts, or get recommendations..."
              className="pr-10"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send size={16} className={input.trim() ? "text-primary" : ""} />
            </Button>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Examples: </span>
          <button
            onClick={() => setInput("What is a P/E ratio?")}
            className="mx-1 rounded-full bg-secondary px-2 py-0.5 hover:bg-secondary/80"
          >
            What is a P/E ratio?
          </button>
          <button
            onClick={() => setInput("How is Apple stock performing?")}
            className="mx-1 rounded-full bg-secondary px-2 py-0.5 hover:bg-secondary/80"
          >
            How is Apple stock performing?
          </button>
          <button
            onClick={() => setInput("Recommend stocks for beginners")}
            className="mx-1 rounded-full bg-secondary px-2 py-0.5 hover:bg-secondary/80"
          >
            Recommend stocks for beginners
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
