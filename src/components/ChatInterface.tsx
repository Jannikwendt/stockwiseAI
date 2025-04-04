import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send, Sparkles, Bot, User as UserIcon } from "lucide-react";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm StockWise AI, your personal investment assistant. How can I help you today? You can ask me about stocks, investment concepts, or get personalized recommendations.",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  useEffect(() => {
    let typingTimer;

    if (isTyping && typingText) {
      if (currentTypeIndex < typingText.length) {
        typingTimer = setTimeout(() => {
          setCurrentTypeIndex((prev) => prev + 1);
        }, 15);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", content: typingText, timestamp: new Date() },
        ]);
        setTypingText("");
        setIsTyping(false);
        setIsLoading(false);
        setCurrentTypeIndex(0);
      }
    }

    return () => clearTimeout(typingTimer);
  }, [isTyping, currentTypeIndex, typingText]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You're a helpful financial assistant. The user's risk profile is Aggressive." },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await res.json();

      setTypingText(data?.content || "Sorry, no response received from the AI service.");
      setIsTyping(true);
      setCurrentTypeIndex(0);
    } catch (error) {
      console.error("Error fetching from backend:", error);
      setTypingText("Sorry, there was an error reaching the AI service.");
      setIsTyping(true);
      setCurrentTypeIndex(0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ChatBubble = ({ message }) => (
    <div className={cn("mb-4 flex w-full", message.role === "user" ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[80%] items-start gap-3 rounded-2xl px-4 py-3", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground border border-border")}>
        <div className="mt-1 shrink-0">
          {message.role === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
        </div>
        <div className="flex-1 break-words">{message.content}</div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4 py-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isTyping && <div>{typingText.substring(0, currentTypeIndex)}|</div>}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Get AI suggestions">
            <Sparkles size={16} />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stocks, concepts, or get recommendations..."
            disabled={isLoading || isTyping}
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading || isTyping}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
