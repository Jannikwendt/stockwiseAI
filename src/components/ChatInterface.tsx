import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send, Sparkles, Bot, User as UserIcon } from "lucide-react";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface RiskProfileEvent {
  profile: string;
  description: string;
}

const ChatInterface = () => {
  const storedRiskProfile = JSON.parse(
    localStorage.getItem("userRiskProfile") || "null"
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: storedRiskProfile
        ? `Hello! I'm StockWise AI, your personal investment assistant. Based on your risk assessment, you're an **${storedRiskProfile.profile} investor**. How can I help you today?`
        : "Hello! I'm StockWise AI, your personal investment assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return;
    if (currentTypeIndex < typingText.length) {
      const timer = setTimeout(() => {
        setCurrentTypeIndex((i) => i + 1);
      }, 15);
      return () => clearTimeout(timer);
    }
    // flush
    setMessages((m) => [
      ...m,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: typingText,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
    setIsLoading(false);
    setCurrentTypeIndex(0);
  }, [isTyping, currentTypeIndex, typingText]);

  // Listen for risk‐profile event
  useEffect(() => {
    const handleRiskProfileMessage = (ev: any) => {
      const { profile, description } = ev.detail as RiskProfileEvent;
      const personalized = `I see you've completed your risk assessment! Based on your answers, you have a **${profile}** risk profile. ${description}

What questions do you have about your investment strategy or specific recommendations for your risk profile?`;
      setTypingText(personalized);
      setIsTyping(true);
    };
    window.addEventListener(
      "triggerChatMessage",
      handleRiskProfileMessage as EventListener
    );
    return () =>
      window.removeEventListener(
        "triggerChatMessage",
        handleRiskProfileMessage as EventListener
      );
  }, []);

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // 1) Add user message locally
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    // 2) Build system prompt
    const systemContent = storedRiskProfile
      ? `You're a helpful financial assistant. User's risk profile: ${storedRiskProfile.profile}.`
      : "You're a helpful financial assistant.";

    // 3) Assemble full payload
    const payload = {
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: trimmed },
      ],
    };

    // 4) POST to backend
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      setTypingText(data.content || "No answer from the AI service.");
      setIsTyping(true);
    } catch (e) {
      console.error("Fetch error:", e);
      setTypingText("Sorry, I couldn't reach the AI service.");
      setIsTyping(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ChatBubble = ({ message }: { message: Message }) => (
    <div
      className={cn(
        "mb-4 flex w-full",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] items-start gap-3 rounded-2xl px-4 py-3",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground border border-border"
        )}
      >
        <div className="mt-1 shrink-0">
          {message.role === "user" ? (
            <UserIcon size={16} />
          ) : (
            <Bot size={16} />
          )}
        </div>
        <div className="flex-1 break-words">{message.content}</div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4 py-4">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {isTyping && (
          <div>{typingText.substring(0, currentTypeIndex)}|</div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Get AI suggestions" disabled>
            <Sparkles size={16} />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stocks, concepts, or get recommendations..."
            disabled={isLoading || isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || isTyping}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
