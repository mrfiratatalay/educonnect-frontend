import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { chatBotResponses, mockChatMessages } from "@/data/mock";
import type { ChatMessage } from "@/types";

const quickQuestions = [
  "Sınav takvimi ne zaman?",
  "Kütüphane saatleri nedir?",
  "Yemekhane menüsü?",
  "Burs başvurusu nasıl yapılır?",
];

export default function ChatBubble() {
  const { isOpen, messages, isTyping, toggleChat, addMessage, setTyping } = useChatStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      mockChatMessages.forEach((m) => addMessage(m));
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const getBotResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    for (const [key, response] of Object.entries(chatBotResponses)) {
      if (key !== "default" && lowerMsg.includes(key)) {
        return response;
      }
    }
    return chatBotResponses.default;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `cm-${Date.now()}`,
      sessionId: "s1",
      senderType: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `cm-${Date.now()}-bot`,
        sessionId: "s1",
        senderType: "bot",
        content: getBotResponse(text),
        timestamp: new Date().toISOString(),
      };
      addMessage(botMsg);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer",
          isOpen
            ? "bg-muted text-muted-foreground hover:bg-muted/80 scale-90"
            : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-xl",
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <div
        className={cn(
          "fixed z-50 transition-all duration-300 ease-out",
          "bottom-36 lg:bottom-22 right-4 lg:right-6",
          "w-[calc(100vw-2rem)] sm:w-96",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <div className="flex flex-col h-[500px] rounded-2xl border bg-background shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">EduConnect Asistan</p>
              <p className="text-xs text-white/70">Her zaman burada</p>
            </div>
            <Sparkles className="w-5 h-5 text-white/60" />
          </div>

          <ScrollArea className="flex-1 p-4">
            <div ref={scrollRef} className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    msg.senderType === "user" ? "ml-auto flex-row-reverse" : "",
                  )}
                >
                  {msg.senderType === "bot" && (
                    <Avatar className="w-7 h-7 shrink-0 mt-1">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.senderType === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md",
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 max-w-[85%]">
                  <Avatar className="w-7 h-7 shrink-0 mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Hızlı sorular:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2.5 py-1.5 rounded-full border bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 border-t">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Bir soru sorun..."
              className="flex-1 border-0 bg-secondary/50 focus-visible:ring-1"
            />
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="shrink-0 rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
