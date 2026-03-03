import { useState, useEffect } from 'react';
import {
  X, Phone, MessageSquare, Calendar, Sparkles, Check, Loader2,
  AlertCircle, DollarSign, Clock, Users
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import { ScrollArea } from '@/Components/ui/scroll-area';
import ShowDateModal from '../SalesUi/ShowDateModal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const callOutcomes = [
  { id: 'payment_promised', label: 'Payment Promised', color: 'bg-success/20 text-success border-success/30' },
  { id: 'not_reachable', label: 'Not Reachable', color: 'bg-muted text-muted-foreground border-muted' },
  { id: 'will_call_back', label: 'Will Call Back', color: 'bg-info/20 text-info border-info/30' },
  { id: 'disputed', label: 'Disputed', color: 'bg-destructive/20 text-destructive border-destructive/30' },
  { id: 'order_placed', label: 'Order Placed', color: 'bg-primary/20 text-primary border-primary/30' },
  { id: 'follow_up', label: 'Follow-up Required', color: 'bg-warning/20 text-warning border-warning/30' },
];





const SalesSmartDialer = ({ isOpen, onClose, onSaveAndClose }) => {
  const customer = useSelector((state) => state.sales.selectedCustomer);
  const [callNotes, setCallNotes] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiScriptLines, setAiScriptLines] = useState([]); // All complete lines received

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Reset state when dialer closes
  useEffect(() => {
    if (!isOpen) {
      setCallNotes('');
      setSelectedOutcome(null);
      setFollowUpDate(undefined);
      setAiScriptLines([]);
      
    }
  }, [isOpen]);

  // Start streaming when customer changes and dialer opens
  // useEffect(() => {
  //   if (customer && isOpen) {
  //     streamSalesScript(customer.Acno);
  //   }
  // }, [customer, isOpen]);


  // API call for streaming AI response – line by line, immediate display
  // const streamSalesScript = async (customerId) => {
  //   setAiScriptLines([]);
   
  //   setIsGenerating(true);

  //   try {
  //     const response = await fetch('/__sales_api/sales/script/stream', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ customer_id: customerId }),
  //     });

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder('utf-8');
  //     let buffer = '';

  //     while (true) {
  //       const { value, done } = await reader.read();
  //       if (done) break;

  //       buffer += decoder.decode(value, { stream: true });

  //       // Split buffer by newline, keep the last partial line in buffer
  //       const lines = buffer.split('\n');
  //       buffer = lines.pop() || ''; // last element may be incomplete

  //       // Add complete lines to state immediately
  //       if (lines.length > 0) {
  //         setAiScriptLines((prev) => [...prev, ...lines]);
  //       }
  //     }

  //     // After stream ends, add any remaining partial line
  //     if (buffer) {
  //       setAiScriptLines((prev) => [...prev, buffer]);
  //     }
  //   } catch (error) {
  //     console.error('Streaming error:', error);
  //     toast.error('Failed to load AI script');
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const handleStartCall = () => {
    if (customer) {
      toast.success(`Calling ${customer.Name}...`, {
        description: customer.Phone,
      });
    }
  };

  const handleSendWhatsApp = () => {
    if (customer) {
      toast.success('WhatsApp message prepared', {
        description: `Opening WhatsApp for ${customer.Name}`,
      });
    }
  };

  const handleSaveAndClose = () => {
    if (!selectedOutcome) {
      toast.error('Please select a call outcome');
      return;
    }
    const selectedOutcomeLabel = callOutcomes.find((o) => o.id === selectedOutcome)?.label;
    toast.success('Call logged successfully', {
      description: `Outcome: ${selectedOutcomeLabel}`,
    });
    onSaveAndClose();
  };

  if (!isOpen) return null;

 
  const severityStyles = {
    high: 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500',
    medium: 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500',
    low: 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500',
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] bg-card border-l border-border shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Smart Dialer</h3>
            {customer && <p className="text-xs text-muted-foreground">{customer.Name}</p>}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* AI Suggested Script – line by line (no typing delay) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI Suggested Script</span>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 min-h-[100px]">
              {isGenerating && aiScriptLines.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating personalized script...
                </div>
              ) : (
                <div className="space-y-1">
                  {aiScriptLines.map((line, index) => (
                    <p key={index} className="text-sm text-foreground leading-relaxed">
                      {/* Remove unwanted markdown bold markers */}
                      {line.replace(/\*\*/g, '')}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

         
          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleStartCall}>
              <Phone className="h-4 w-4 mr-2" />
              Start Call
            </Button>
            <Button variant="outline" className="w-full" onClick={handleSendWhatsApp}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send WhatsApp
            </Button>
          </div>

          {/* Call Outcome */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Call Outcome</span>
            <div className="grid grid-cols-2 gap-2">
              {callOutcomes.map((outcome) => (
                <button
                  key={outcome.id}
                  onClick={() => setSelectedOutcome(outcome.id)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                    selectedOutcome === outcome.id
                      ? outcome.color + ' ring-2 ring-offset-2 ring-offset-background'
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  )}
                >
                  {selectedOutcome === outcome.id && <Check className="h-3 w-3 inline mr-1" />}
                  {outcome.label}
                </button>
              ))}
            </div>
          </div>

          {/* Call Notes */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Call Notes</span>
            <Textarea
              placeholder="Add call notes here..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              className="min-h-[100px] resize-none text-sm"
            />
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Follow-up Date</span>
            <Button
              variant="outline"
              onClick={() => setIsCalendarOpen(true)}
              className={cn(
                'w-full justify-start text-left font-normal',
                !followUpDate && 'text-muted-foreground'
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {followUpDate ? format(followUpDate, 'PPP') : 'Select a date'}
            </Button>
            <ShowDateModal
              open={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              onSelectDate={(selected) => {
                setFollowUpDate(selected);
                setIsCalendarOpen(false);
              }}
            />
          </div>

          {/* Customer Quick Info */}
          {customer && (
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
              <span className="text-xs font-medium text-muted-foreground">Customer Summary</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Outstanding:</span>
                  <span className="ml-1 font-medium">₹{customer.TotalOutstanding?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Overdue:</span>
                  <span
                    className={cn(
                      'ml-1 font-medium',
                      customer.OverdueAmount > 0 ? 'text-destructive' : 'text-success'
                    )}
                  >
                    ₹{customer.OverdueAmount?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Segment:</span>
                  <Badge variant="outline" className="ml-1 text-[10px]">
                    {customer.Grade}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          className="w-full bg-success hover:bg-success/90 text-success-foreground"
          onClick={handleSaveAndClose}
        >
          <Check className="h-4 w-4 mr-2" />
          Save & Close
        </Button>
      </div>
    </div>
  );
};

export default SalesSmartDialer;
