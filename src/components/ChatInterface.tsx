import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send, Sparkles, Bot, User as UserIcon, RefreshCw, MessageSquare } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

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
      content: "Hello! I'm StockWise AI, your personal investment assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    if (isTyping && typingText) {
      const responseText = typingText;
      if (currentTypeIndex < responseText.length) {
        typingTimer = setTimeout(() => {
          setCurrentTypeIndex(prev => prev + 1);
        }, 15);
      } else {
        setIsTyping(false);
        setIsLoading(false);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: responseText,
            timestamp: new Date(),
          },
        ]);
        setTypingText("");
        setCurrentTypeIndex(0);
      }
    }
    return () => clearTimeout(typingTimer);
  }, [isTyping, currentTypeIndex, typingText]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You're a helpful financial assistant. The user's risk profile is Aggressive. Give them advice tailored to that profile.",
            },
            {
              role: "user",
              content: input,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setTypingText(reply);
      setIsTyping(true);
      setCurrentTypeIndex(0);
    } catch (error) {
      console.error("OpenAI API error:", error);
      setTypingText("Sorry, there was an error reaching the AI service.");
      setIsTyping(true);
      setCurrentTypeIndex(0);
    }
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
      <div className={cn("mb-4 flex w-full", isUser ? "justify-end" : "justify-start")}>
        <div className={cn("flex max-w-[80%] items-start gap-3 rounded-2xl px-4 py-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground border border-border")}>
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
          <div className="flex-1 break-words">
            <div className="prose prose-sm dark:prose-invert">
              {message.content.split(/\b(P\/E ratio|volatility|ETFs)\b/).map((part, i) => {
                if (part === "P/E ratio") {
                  return <Tooltip key={i} term="P/E ratio" explanation="Price-to-Earnings ratio compares a company's share price to its earnings per share." />;
                } else if (part === "volatility") {
                  return <Tooltip key={i} term="volatility" explanation="Volatility means how much a stock's price swings over time." />;
                } else if (part === "ETFs") {
                  return <Tooltip key={i} term="ETFs" explanation="Exchange-Traded Funds hold assets and trade like a stock, offering diversification." />;
                }
                return part;
              })}
            </div>
            <div className="mt-1 text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="mb-4 flex w-full justify-start">
      <div className="flex max-w-[80%] items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-card-foreground">
        <div className="mt-1 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot size={16} />
          </div>
        </div>
        <div className="flex-1 break-words">
          <div className="prose prose-sm dark:prose-invert">
            {typingText.substring(0, currentTypeIndex)}
            <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-full bg-primary"></span>
          </div>
        </div>
      </div>
    </div>
  );

  const MessagePlaceholder = () => (
    <div className="mb-4 flex w-full justify-start">
      <div className="flex max-w-[80%] items-start gap-3 rounded-2xl border border-border/50 bg-card/50 px-4 py-3 text-card-foreground/50">
        <div className="mt-1 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary/50">
            <MessageSquare size={16} />
          </div>
        </div>
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-[250px]" />
          <Skeleton className="mb-2 h-4 w-[180px]" />
          <Skeleton className="h-4 w-[120px]" />
          <div className="mt-2 text-xs opacity-50">Waiting for response...</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="mb-4 space-y-4">
          {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
          {isTyping && <TypingIndicator />}
          {isLoading && !isTyping && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw size={14} className="animate-spin" />
              <span>StockWise AI is thinking...</span>
            </div>
          )}
          {!isLoading && !isTyping && <MessagePlaceholder />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" title="Get AI suggestions">
            <Sparkles size={16} className="text-primary" />
          </Button>
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about stocks, concepts, or get recommendations..."
              className="pr-10"
              disabled={isLoading || isTyping}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || isTyping}
            >
              <Send size={16} className={input.trim() ? "text-primary" : ""} />
            </Button>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Examples: </span>
          <button onClick={() => setInput("What is a P/E ratio?")} className="mx-1 rounded-full bg-secondary px-2 py-0.5 hover:bg-secondary/80">
            What is a P/E ratio?
          </button>
          <button onClick={() => setInput("How is Apple stock performing?")} className="mx-1 rounded-full bg-secondary px-2 py-0.5 hover:bg-secondary/80">
            How is Apple stock performing?
          </button>
          <button onClick={() => setInput("Recommend stocks for beginners")} className="mx-1 rounded-full bg-secondary px-2 py-0.5 hover:bg-secondary/80">
            Recommend stocks for beginners
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
