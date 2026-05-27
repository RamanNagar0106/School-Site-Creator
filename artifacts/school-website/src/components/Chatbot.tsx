import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateOpenaiConversation, useGetOpenaiConversation, getGetOpenaiConversationQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const createConversation = useCreateOpenaiConversation();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function startConversation() {
    const conv = await createConversation.mutateAsync({
      data: { title: "School Enquiry" },
    });
    setConversationId(conv.id);
    setMessages([
      {
        role: "assistant",
        content: "Hello! I am the Convent Assistant for M. B. Convent H. S. School. How can I help you today? You can ask me about admissions, academics, timings, or anything else about our school.",
      },
    ]);
  }

  async function sendMessage() {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");

    let currentConvId = conversationId;

    if (!currentConvId) {
      try {
        const conv = await createConversation.mutateAsync({
          data: { title: userMessage.slice(0, 50) },
        });
        currentConvId = conv.id;
        setConversationId(conv.id);
      } catch {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Sorry, I could not connect right now. Please try again." },
        ]);
        return;
      }
    }

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsStreaming(true);

    const streamingIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: "assistant", content: "", streaming: true }]);

    try {
      const response = await fetch(`/api/openai/conversations/${currentConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.done) {
              setMessages(prev =>
                prev.map((m, i) =>
                  i === streamingIndex ? { ...m, streaming: false } : m
                )
              );
              void queryClient.invalidateQueries({ queryKey: getGetOpenaiConversationQueryKey(currentConvId!) });
            } else if (parsed.content) {
              setMessages(prev =>
                prev.map((m, i) =>
                  i === streamingIndex
                    ? { ...m, content: m.content + parsed.content }
                    : m
                )
              );
            }
          } catch {
          }
        }
      }
    } catch {
      setMessages(prev =>
        prev.map((m, i) =>
          i === streamingIndex
            ? { role: "assistant", content: "Sorry, something went wrong. Please try again.", streaming: false }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  function clearChat() {
    setConversationId(null);
    setMessages([]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <>
      <button
        data-testid="button-chatbot-toggle"
        onClick={() => {
          setIsOpen(o => !o);
          if (!isOpen && messages.length === 0) {
            void startConversation();
          }
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Open school assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div
          data-testid="chatbot-panel"
          className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Convent Assistant</p>
                <p className="text-xs text-primary-foreground/70">M. B. Convent H. S. School</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  data-testid="button-clear-chat"
                  onClick={clearChat}
                  className="rounded-lg p-1.5 text-primary-foreground/70 transition hover:bg-white/10 hover:text-white"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                data-testid="button-close-chatbot"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-primary-foreground/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 text-slate-400">
                <Bot className="h-10 w-10 mb-3 text-slate-300" />
                <p className="text-sm font-medium">Ask me anything about</p>
                <p className="text-sm">M. B. Convent H. S. School</p>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  data-testid={`message-${msg.role}-${i}`}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "assistant" ? "bg-primary/10" : "bg-secondary/20"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-slate-100 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    {msg.content || (msg.streaming && (
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t border-slate-100 p-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                data-testid="input-chat-message"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about admissions, academics..."
                disabled={isStreaming}
                className="flex-1 text-sm h-9 border-slate-200 focus-visible:ring-primary/30"
              />
              <Button
                data-testid="button-send-message"
                size="sm"
                onClick={() => void sendMessage()}
                disabled={!input.trim() || isStreaming}
                className="h-9 w-9 shrink-0 bg-secondary text-primary hover:bg-secondary/90 p-0"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-400">Powered by AI</p>
          </div>
        </div>
      )}
    </>
  );
}
