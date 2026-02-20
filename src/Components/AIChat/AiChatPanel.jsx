import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
  Phone,
  MessageSquare,
  FileText,
  AlertTriangle,
  CreditCard,
  Plus,
  Minimize2,
  Maximize2,
  TrendingUp,
  DollarSign,
  Package,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const suggestedPrompts = [
  { icon: TrendingUp, text: "Summarize this customer" },
  { icon: AlertTriangle, text: "Why is this blocked?" },
  { icon: DollarSign, text: "Suggest collection strategy" },
  { icon: Lightbulb, text: "Recommend next action" },
];

const initialMessage = {
  id: "1",
  role: "assistant",
  content: "I'm your AI Copilot. I can analyze data, suggest actions, and help you work faster.\n\n**I can help with:**\n• Customer analysis & risk assessment\n• Payment collection strategies\n• Product recommendations\n• Draft communications\n• Create tasks & tickets\n\nWhat would you like to know?",
  timestamp: new Date(),
};

export const AiChatPanel = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef(null);
//  console.log("messages------------------------", messages);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamText = (fullText, messageId) => {
  let index = 0;

  const interval = setInterval(() => {
    index++;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: fullText.slice(0, index) }
          : msg
      )
    );

    if (index >= fullText.length) {
      clearInterval(interval);
      setIsLoading(false);
    }
  }, 20); // speed control
};


 const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    role: "user",
    content: input,
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  // 🔥 API call simulate
  const response = generateAIResponse(input);

  const assistantId = (Date.now() + 1).toString();

  setMessages(prev => [
    ...prev,
    {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      actions: response.actions || []
    }
  ]);

  streamText(response.content, assistantId);
};


  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("customer") || lowerQuery.includes("summarize")) {
      return {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "**Customer Summary: Apollo Pharmacy Mumbai**\n\n📊 **Key Metrics:**\n• Annual Revenue: ₹45L\n• Outstanding: ₹4.5L (32 days avg)\n• Payment Score: 78/100 (Good)\n• Order Frequency: 12/month\n\n⚠️ **Attention Items:**\n• 2 invoices overdue (₹85K, 45 days)\n• Credit utilization: 89%\n• Open dispute: Rate mismatch on INV-4521\n\n✅ **Positive Signals:**\n• Order value growing +15% MoM\n• No bounced payments in 6 months\n• Responsive to collection calls",
        timestamp: new Date(),
        actions: [
          { label: "Call Now", icon: Phone, action: "call" },
          { label: "Send Reminder", icon: MessageSquare, action: "whatsapp" },
          { label: "Create PTP", icon: CreditCard, action: "ptp" },
        ],
      };
    }

    if (lowerQuery.includes("block") || lowerQuery.includes("hold")) {
      return {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "**Analysis: Why is this customer blocked?**\n\n🔴 **Block Reason:** Credit Limit Exceeded\n\n**Details:**\n• Credit Limit: ₹5L\n• Current Outstanding: ₹5.8L (116%)\n• Overdue Amount: ₹2.1L\n• Oldest Overdue: 67 days\n\n**Related Issues:**\n• Open Dispute: ₹35K (Rate mismatch)\n• Pending CN: ₹12K (Batch expiry claim)\n\n**Recommendation:**\nCollect ₹1.5L to bring within limit, or raise credit review request with finance.",
        timestamp: new Date(),
        actions: [
          { label: "Record Payment", icon: DollarSign, action: "payment" },
          { label: "View Disputes", icon: AlertTriangle, action: "disputes" },
          { label: "Request Credit Review", icon: FileText, action: "credit_review" },
        ],
      };
    }

    if (lowerQuery.includes("collection") || lowerQuery.includes("strategy")) {
      return {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: '**Collection Strategy Recommendation**\n\n📞 **Immediate Actions:**\n1. Priority call to Finance Head (contact: Mr. Sharma)\n2. Send ledger statement highlighting 67-day overdue\n3. Propose structured payment plan\n\n💰 **Payment Plan Suggestion:**\n• Week 1: ₹50K (clear oldest invoice)\n• Week 2: ₹50K\n• Week 3: ₹50K + resume normal cycle\n\n📝 **Draft Message:**\n*"Dear Mr. Sharma, This is regarding your outstanding of ₹2.1L with Jeplus Healthcare. To continue uninterrupted supply, please arrange ₹50K by [date]. Call us to discuss a convenient payment schedule."*\n\n**Escalation Path:**\nIf no response in 48hrs → Manager call → Legal notice',
        timestamp: new Date(),
        actions: [
          { label: "Send WhatsApp", icon: MessageSquare, action: "whatsapp" },
          { label: "Create PTP", icon: CreditCard, action: "ptp" },
          { label: "Create Task", icon: Plus, action: "task" },
        ],
      };
    }

    if (lowerQuery.includes("action") || lowerQuery.includes("next") || lowerQuery.includes("recommend")) {
      return {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "**Recommended Next Actions**\n\n🎯 **High Priority (Today):**\n1. **Resolve open dispute** - Rate mismatch on INV-4521 (₹35K) - This is blocking payment\n2. **Call collection** - Mr. Sharma available 10-11 AM\n\n📦 **Sales Opportunity:**\n• Customer hasn't ordered Metformin 500mg this month (usually ₹80K/month)\n• Scheme available: Buy 100 + Get 10\n\n📋 **Pending Tasks:**\n• Credit note pending approval (₃12K)\n• Delivery confirmation for ORD-1234\n\n**Win Probability:** 85% if dispute resolved this week",
        timestamp: new Date(),
        actions: [
          { label: "Resolve Dispute", icon: AlertTriangle, action: "dispute" },
          { label: "Place Order", icon: Package, action: "order" },
          { label: "Call Customer", icon: Phone, action: "call" },
        ],
      };
    }

    return {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I understand you're asking about: **"${query}"**\n\nI can help you with:\n• Customer insights and analysis\n• Collection strategies\n• Risk assessment\n• Action recommendations\n• Communication drafts\n\nCould you be more specific about what you'd like to know?`,
      timestamp: new Date(),
    };
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };

  const handleActionClick = (action) => {
    // In a real app, these would trigger actual actions
    console.log("Action clicked:", action);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    
  };

  const renderMessageContent = (content) => {
    return content.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} className="font-semibold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed right-0 top-14 bottom-0 w-96 bg-card border-l border-border flex flex-col z-40 shadow-xl transition-all duration-300",
        isMinimized && "h-50 top-auto bottom-10 right-4 w-56 rounded-lg border z-50 shadow-lg"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold">AI Jeplus</span>
            {!isMinimized && (
              <p className="text-[10px] text-muted-foreground">
                Powered by your data
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleMinimize}
          >
            {isMinimized ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="h-6 w-6 rounded-md bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] space-y-2",
                      message.role === "user" && "flex flex-col items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg p-3 text-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 border border-border/50"
                      )}
                    >
                      <div className="whitespace-pre-wrap text-[13px] leading-relaxed">
                        {renderMessageContent(message.content)}
                      </div>
                    </div>
                    {message.actions && (
                      <div className="flex flex-wrap gap-1.5">
                        {message.actions.map((action, idx) => {
                          const Icon = action.icon;
                          return (
                            <Button
                              key={idx}
                              variant={action.variant || "outline"}
                              size="sm"
                              className="h-7 text-xs gap-1.5"
                              onClick={() => handleActionClick(action.action)}
                            >
                              <Icon className="h-3 w-3" />
                              {action.label}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted/50 border border-border/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 animate-spin" />
                      Analyzing...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Prompts */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border/50 bg-muted/30 hover:bg-muted transition-colors text-xs"
                    >
                      <Icon className="h-3 w-3 text-primary" />
                      <span>{prompt.text}</span>
                  
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border bg-muted/30">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask anything..."
                className="bg-background border-border/50 focus:border-primary h-9 text-sm"
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-9 w-9 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AiChatPanel;