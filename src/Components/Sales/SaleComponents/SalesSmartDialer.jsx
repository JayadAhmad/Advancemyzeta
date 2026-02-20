// import { useState, useEffect } from 'react';
// import {
//   X, Phone, MessageSquare, Calendar, Sparkles, Check, Loader2,
//   AlertCircle, DollarSign, Clock, Users
// } from 'lucide-react';
// import { Button } from '@/Components/ui/button';
// import { Badge } from '@/Components/ui/badge';
// import { Textarea } from '@/Components/ui/textarea';
// import { ScrollArea } from '@/Components/ui/scroll-area';
// import ShowDateModal from '../SalesUi/ShowDateModal';
// import { format } from 'date-fns';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { useSelector } from 'react-redux';

// const callOutcomes = [
//   { id: 'payment_promised', label: 'Payment Promised', color: 'bg-success/20 text-success border-success/30' },
//   { id: 'not_reachable', label: 'Not Reachable', color: 'bg-muted text-muted-foreground border-muted' },
//   { id: 'will_call_back', label: 'Will Call Back', color: 'bg-info/20 text-info border-info/30' },
//   { id: 'disputed', label: 'Disputed', color: 'bg-destructive/20 text-destructive border-destructive/30' },
//   { id: 'order_placed', label: 'Order Placed', color: 'bg-primary/20 text-primary border-primary/30' },
//   { id: 'follow_up', label: 'Follow-up Required', color: 'bg-warning/20 text-warning border-warning/30' },
// ];

// // Fallback static talking points (used if AI script doesn't contain a "Key Talking Points" section)
// const getStaticTalkingPoints = (customer) => {
//   if (!customer) return [];
//   const points = [];

//   if (customer.OverdueAmount > 0) {
//     points.push({
//       text: `Overdue amount: ₹${customer.OverdueAmount.toLocaleString()} – Request payment commitment`,
//       icon: AlertCircle,
//       severity: 'high',
//     });
//   }

//   const creditUsed = customer.creditUsed || 0;
//   const creditLimit = customer.creditLimit || 1;
//   if (creditUsed / creditLimit > 0.9) {
//     points.push({
//       text: `Credit limit near full (${Math.round((creditUsed / creditLimit) * 100)}%) – Discuss credit increase or payment`,
//       icon: DollarSign,
//       severity: 'medium',
//     });
//   }

//   if (customer.pendingClaims > 0) {
//     points.push({
//       text: `${customer.pendingClaims} pending claim(s) – Address customer concerns`,
//       icon: AlertCircle,
//       severity: 'high',
//     });
//   }

//   points.push({
//     text: `Last order: ${customer.lastOrder || 'N/A'} – Suggest reorder if needed`,
//     icon: Clock,
//     severity: 'low',
//   });

//   points.push({
//     text: `Total orders: ${customer.totalOrders || 'N/A'} – Thank for loyalty`,
//     icon: Users,
//     severity: 'low',
//   });

//   return points;
// };

// // Extract talking points from AI script (markdown style)
// const extractTalkingPointsFromScript = (script) => {
//   const lines = script.split('\n');
//   let inSection = false;
//   const points = [];

//   for (const line of lines) {
//     // Detect start of "Key Talking Points" section
//     if (line.includes('### Key Talking Points') || line.includes('Key Talking Points')) {
//       inSection = true;
//       continue;
//     }

//     if (inSection) {
//       // Stop if we hit an empty line or another heading
//       if (line.trim() === '' || line.startsWith('#')) break;

//       // Match bullet points: "1. text" or "- text" or "• text"
//       const match = line.match(/^\s*(?:\d+\.|[-•])\s+(.*)/);
//       if (match) {
//         let text = match[1].trim();
//         // Remove any markdown bold markers
//         text = text.replace(/\*\*/g, '');
//         if (text) {
//           // Assign icon and severity based on keywords
//           let icon = AlertCircle;
//           let severity = 'medium';
//           const lower = text.toLowerCase();
//           if (lower.includes('overdue') || lower.includes('outstanding')) {
//             icon = AlertCircle;
//             severity = 'high';
//           } else if (lower.includes('credit')) {
//             icon = DollarSign;
//             severity = 'medium';
//           } else if (lower.includes('order') || lower.includes('last order')) {
//             icon = Clock;
//             severity = 'low';
//           } else if (lower.includes('loyalty')) {
//             icon = Users;
//             severity = 'low';
//           }
//           points.push({ text, icon, severity });
//         }
//       }
//     }
//   }

//   return points;
// };

// const SalesSmartDialer = ({ isOpen, onClose, onSaveAndClose }) => {
//   const customer = useSelector((state) => state.sales.selectedCustomer);
//   const [callNotes, setCallNotes] = useState('');
//   const [selectedOutcome, setSelectedOutcome] = useState(null);
//   const [followUpDate, setFollowUpDate] = useState(undefined);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [aiScriptLines, setAiScriptLines] = useState([]); // All complete lines received
//   const [dynamicTalkingPoints, setDynamicTalkingPoints] = useState([]); // Extracted from AI script
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);

//   // Reset state when dialer closes
//   useEffect(() => {
//     if (!isOpen) {
//       setCallNotes('');
//       setSelectedOutcome(null);
//       setFollowUpDate(undefined);
//       setAiScriptLines([]);
//       setDynamicTalkingPoints([]);
//     }
//   }, [isOpen]);

//   // Start streaming when customer changes and dialer opens
//   useEffect(() => {
//     if (customer && isOpen) {
//       streamSalesScript(customer.Acno);
//     }
//   }, [customer, isOpen]);

//   // When streaming finishes, extract talking points from the full script
//   useEffect(() => {
//     if (!isGenerating && aiScriptLines.length > 0) {
//       const fullScript = aiScriptLines.join('\n');
//       const extracted = extractTalkingPointsFromScript(fullScript);
//       if (extracted.length > 0) {
//         setDynamicTalkingPoints(extracted);
//       } else {
//         // Fallback to static points if AI didn't provide them
//         setDynamicTalkingPoints(getStaticTalkingPoints(customer));
//       }
//     }
//   }, [isGenerating, aiScriptLines, customer]);

//   console.log("Dynamic talking points extracted from AI script:", dynamicTalkingPoints);

//   // API call for streaming AI response – line by line, immediate display
//   const streamSalesScript = async (customerId) => {
//     setAiScriptLines([]);
//     setDynamicTalkingPoints([]);
//     setIsGenerating(true);

//     try {
//       const response = await fetch('/__sales_api/sales/script/stream', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ customer_id: customerId }),
//       });

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder('utf-8');
//       let buffer = '';

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });

//         // Split buffer by newline, keep the last partial line in buffer
//         const lines = buffer.split('\n');
//         buffer = lines.pop() || ''; // last element may be incomplete

//         // Add complete lines to state immediately
//         if (lines.length > 0) {
//           setAiScriptLines((prev) => [...prev, ...lines]);
//         }
//       }

//       // After stream ends, add any remaining partial line
//       if (buffer) {
//         setAiScriptLines((prev) => [...prev, buffer]);
//       }
//     } catch (error) {
//       console.error('Streaming error:', error);
//       toast.error('Failed to load AI script');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleStartCall = () => {
//     if (customer) {
//       toast.success(`Calling ${customer.Name}...`, {
//         description: customer.Phone,
//       });
//     }
//   };

//   const handleSendWhatsApp = () => {
//     if (customer) {
//       toast.success('WhatsApp message prepared', {
//         description: `Opening WhatsApp for ${customer.Name}`,
//       });
//     }
//   };

//   const handleSaveAndClose = () => {
//     if (!selectedOutcome) {
//       toast.error('Please select a call outcome');
//       return;
//     }
//     const selectedOutcomeLabel = callOutcomes.find((o) => o.id === selectedOutcome)?.label;
//     toast.success('Call logged successfully', {
//       description: `Outcome: ${selectedOutcomeLabel}`,
//     });
//     onSaveAndClose();
//   };

//   if (!isOpen) return null;

//   // Use dynamic talking points if available, otherwise fallback to static
//   const talkingPoints = dynamicTalkingPoints.length > 0
//     ? dynamicTalkingPoints
//     : getStaticTalkingPoints(customer);

//   const severityStyles = {
//     high: 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500',
//     medium: 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500',
//     low: 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500',
//   };

//   return (
//     <div className="fixed right-0 top-0 h-full w-[380px] bg-card border-l border-border shadow-xl z-50 flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-border">
//         <div className="flex items-center gap-2">
//           <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//             <Sparkles className="h-4 w-4 text-primary" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-sm">Smart Dialer</h3>
//             {customer && <p className="text-xs text-muted-foreground">{customer.Name}</p>}
//           </div>
//         </div>
//         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
//           <X className="h-4 w-4" />
//         </Button>
//       </div>

//       <ScrollArea className="flex-1">
//         <div className="p-4 space-y-5">
//           {/* AI Suggested Script – line by line (no typing delay) */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Sparkles className="h-4 w-4 text-primary" />
//               <span className="text-xs font-medium text-primary">AI Suggested Script</span>
//             </div>
//             <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 min-h-[100px]">
//               {isGenerating && aiScriptLines.length === 0 ? (
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Generating personalized script...
//                 </div>
//               ) : (
//                 <div className="space-y-1">
//                   {aiScriptLines.map((line, index) => (
//                     <p key={index} className="text-sm text-foreground leading-relaxed">
//                       {/* Remove unwanted markdown bold markers */}
//                       {line.replace(/\*\*/g, '')}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Key Talking Points – highlighted from AI script (or fallback) */}
//           {talkingPoints.length > 0 && (
//             <div className="space-y-2">
//               <span className="text-xs font-medium text-muted-foreground">Key Talking Points</span>
//               <div className="space-y-2">
//                 {talkingPoints.map((point, index) => {
//                   const Icon = point.icon;
//                   return (
//                     <div
//                       key={index}
//                       className={cn(
//                         'p-3 rounded-lg flex items-start gap-2 text-sm',
//                         severityStyles[point.severity]
//                       )}
//                     >
//                       <Icon className="h-4 w-4 mt-0.5 shrink-0" />
//                       <span>{point.text}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="space-y-2">
//             <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleStartCall}>
//               <Phone className="h-4 w-4 mr-2" />
//               Start Call
//             </Button>
//             <Button variant="outline" className="w-full" onClick={handleSendWhatsApp}>
//               <MessageSquare className="h-4 w-4 mr-2" />
//               Send WhatsApp
//             </Button>
//           </div>

//           {/* Call Outcome */}
//           <div className="space-y-2">
//             <span className="text-xs font-medium text-muted-foreground">Call Outcome</span>
//             <div className="grid grid-cols-2 gap-2">
//               {callOutcomes.map((outcome) => (
//                 <button
//                   key={outcome.id}
//                   onClick={() => setSelectedOutcome(outcome.id)}
//                   className={cn(
//                     'px-3 py-2 rounded-lg text-xs font-medium border transition-all',
//                     selectedOutcome === outcome.id
//                       ? outcome.color + ' ring-2 ring-offset-2 ring-offset-background'
//                       : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
//                   )}
//                 >
//                   {selectedOutcome === outcome.id && <Check className="h-3 w-3 inline mr-1" />}
//                   {outcome.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Call Notes */}
//           <div className="space-y-2">
//             <span className="text-xs font-medium text-muted-foreground">Call Notes</span>
//             <Textarea
//               placeholder="Add call notes here..."
//               value={callNotes}
//               onChange={(e) => setCallNotes(e.target.value)}
//               className="min-h-[100px] resize-none text-sm"
//             />
//           </div>

//           {/* Follow-up Date */}
//           <div className="space-y-2">
//             <span className="text-xs font-medium text-muted-foreground">Follow-up Date</span>
//             <Button
//               variant="outline"
//               onClick={() => setIsCalendarOpen(true)}
//               className={cn(
//                 'w-full justify-start text-left font-normal',
//                 !followUpDate && 'text-muted-foreground'
//               )}
//             >
//               <Calendar className="mr-2 h-4 w-4" />
//               {followUpDate ? format(followUpDate, 'PPP') : 'Select a date'}
//             </Button>
//             <ShowDateModal
//               open={isCalendarOpen}
//               onClose={() => setIsCalendarOpen(false)}
//               onSelectDate={(selected) => {
//                 setFollowUpDate(selected);
//                 setIsCalendarOpen(false);
//               }}
//             />
//           </div>

//           {/* Customer Quick Info */}
//           {customer && (
//             <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
//               <span className="text-xs font-medium text-muted-foreground">Customer Summary</span>
//               <div className="grid grid-cols-2 gap-2 text-xs">
//                 <div>
//                   <span className="text-muted-foreground">Outstanding:</span>
//                   <span className="ml-1 font-medium">₹{customer.TotalOutstanding?.toLocaleString()}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Overdue:</span>
//                   <span
//                     className={cn(
//                       'ml-1 font-medium',
//                       customer.OverdueAmount > 0 ? 'text-destructive' : 'text-success'
//                     )}
//                   >
//                     ₹{customer.OverdueAmount?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Segment:</span>
//                   <Badge variant="outline" className="ml-1 text-[10px]">
//                     {customer.Grade}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </ScrollArea>

//       {/* Footer */}
//       <div className="p-4 border-t border-border">
//         <Button
//           className="w-full bg-success hover:bg-success/90 text-success-foreground"
//           onClick={handleSaveAndClose}
//         >
//           <Check className="h-4 w-4 mr-2" />
//           Save & Close
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SalesSmartDialer;

// import { useState, useEffect, useRef } from 'react';
// import { X, Phone, MessageSquare, Calendar, Sparkles, Check, Loader2, AlertCircle, DollarSign, Clock, Users } from 'lucide-react';
// import { Button } from '@/Components/ui/button';
// import { Badge } from '@/Components/ui/badge';
// import { Textarea } from '@/Components/ui/textarea';
// import { ScrollArea } from '@/Components/ui/scroll-area';
// import ShowDateModal from '../SalesUi/ShowDateModal';
// import { format } from 'date-fns';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { useSelector } from 'react-redux';

// const callOutcomes = [
//   { id: 'payment_promised', label: 'Payment Promised', color: 'bg-success/20 text-success border-success/30' },
//   { id: 'not_reachable', label: 'Not Reachable', color: 'bg-muted text-muted-foreground border-muted' },
//   { id: 'will_call_back', label: 'Will Call Back', color: 'bg-info/20 text-info border-info/30' },
//   { id: 'disputed', label: 'Disputed', color: 'bg-destructive/20 text-destructive border-destructive/30' },
//   { id: 'order_placed', label: 'Order Placed', color: 'bg-primary/20 text-primary border-primary/30' },
//   { id: 'follow_up', label: 'Follow-up Required', color: 'bg-warning/20 text-warning border-warning/30' },
// ];

// // Enhanced talking points with icons and importance levels
// // const getTalkingPoints = (customer) => {
// //   console.log("Generating talking points for customer---------------------:", customer);
// //   if (!customer) return [];

// //   const points = [];

// //   if (customer.OverdueAmount > 0) {
// //     points.push({
// //       text: `Overdue amount: ₹${customer.OverdueAmount.toLocaleString()} – Request payment commitment`,
// //       icon: AlertCircle,
// //       severity: 'high',
// //     });
// //   }

// //   // Assuming creditUsed and creditLimit exist in customer object
// //   const creditUsed = customer.creditUsed || 0;
// //   const creditLimit = customer.creditLimit || 1;
// //   if (creditUsed / creditLimit > 0.9) {
// //     points.push({
// //       text: `Credit limit near full (${Math.round((creditUsed / creditLimit) * 100)}%) – Discuss credit increase or payment`,
// //       icon: DollarSign,
// //       severity: 'medium',
// //     });
// //   }

// //   if (customer.pendingClaims > 0) {
// //     points.push({
// //       text: `${customer.pendingClaims} pending claim(s) – Address customer concerns`,
// //       icon: AlertCircle,
// //       severity: 'high',
// //     });
// //   }

// //   points.push({
// //     text: `Last order: ${customer.lastOrder || 'N/A'} – Suggest reorder if needed`,
// //     icon: Clock,
// //     severity: 'low',
// //   });

// //   points.push({
// //     text: `Total orders: ${customer.totalOrders || 'N/A'} – Thank for loyalty`,
// //     icon: Users,
// //     severity: 'low',
// //   });

// //   return points;
// // };

// const SalesSmartDialer = ({ isOpen, onClose, onSaveAndClose }) => {
//   const customer = useSelector((state) => state.sales.selectedCustomer);
//   const [callNotes, setCallNotes] = useState('');
//   const [selectedOutcome, setSelectedOutcome] = useState(null);
//   const [followUpDate, setFollowUpDate] = useState(undefined);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [aiScriptLines, setAiScriptLines] = useState([]); // Array of complete lines
//   const [partialLine, setPartialLine] = useState(''); // Buffer for incomplete line
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);

//   // Reset state when dialer closes
//   useEffect(() => {
//     if (!isOpen) {
//       setCallNotes('');
//       setSelectedOutcome(null);
//       setFollowUpDate(undefined);
//       setAiScriptLines([]);
//       setPartialLine('');
//     }
//   }, [isOpen]);

//   // Start streaming when customer changes and dialer opens
//   useEffect(() => {
//     if (customer && isOpen) {
//       streamSalesScript(customer.Acno);
//     }
//   }, [customer, isOpen]);

//   // API call for streaming AI response – line by line
//   const streamSalesScript = async (customerId) => {
//     setAiScriptLines([]);
//     setPartialLine('');
//     setIsGenerating(true);

//     try {
//       const response = await fetch('/__sales_api/sales/script/stream', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ customer_id: customerId }),
//       });

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder('utf-8');
//       let buffer = '';

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         // Split buffer by newline, keep the last partial line
//         const lines = buffer.split('.');
//         buffer = lines.pop() || ''; // Last element is incomplete

//         // Add complete lines to state
//         if (lines.length > 0) {
//           setAiScriptLines((prev) => [...prev, ...lines]);
//         }
//       }

//       // After stream ends, add any remaining partial line
//       if (buffer) {
//         setAiScriptLines((prev) => [...prev, buffer]);
//       }
//     } catch (error) {
//       console.error('Streaming error:', error);
//       toast.error('Failed to load AI script');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleStartCall = () => {
//     if (customer) {
//       toast.success(`Calling ${customer.Name}...`, {
//         description: customer.Phone,
//       });
//     }
//   };

//   const handleSendWhatsApp = () => {
//     if (customer) {
//       toast.success('WhatsApp message prepared', {
//         description: `Opening WhatsApp for ${customer.Name}`,
//       });
//       // Here you would actually open WhatsApp
//     }
//   };

//   const handleSaveAndClose = () => {
//     if (!selectedOutcome) {
//       toast.error('Please select a call outcome');
//       return;
//     }
//     const selectedOutcomeLabel = callOutcomes.find((o) => o.id === selectedOutcome)?.label;
//     toast.success('Call logged successfully', {
//       description: `Outcome: ${selectedOutcomeLabel}`,
//     });
//     onSaveAndClose();
//   };

//   if (!isOpen) return null;

//   // const talkingPoints = getTalkingPoints(customer);

//   // Map severity to tailwind classes for talking points
//   const severityStyles = {
//     high: 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500',
//     medium: 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500',
//     low: 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500',
//   };

//   return (
//     <div className="fixed right-0 top-0 h-full w-[380px] bg-card border-l border-border shadow-xl z-50 flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-border">
//         <div className="flex items-center gap-2">
//           <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//             <Sparkles className="h-4 w-4 text-primary" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-sm">Smart Dialer</h3>
//             {customer && <p className="text-xs text-muted-foreground">{customer.Name}</p>}
//           </div>
//         </div>
//         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
//           <X className="h-4 w-4" />
//         </Button>
//       </div>

//       <ScrollArea className="flex-1">
//         <div className="p-4 space-y-5">
//           {/* AI Suggested Script – line by line */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Sparkles className="h-4 w-4 text-primary" />
//               <span className="text-xs font-medium text-primary">AI Suggested Script</span>
//             </div>
//             <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 min-h-[100px]">
//               {isGenerating && aiScriptLines.length === 0 ? (
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                     <span className="inline-block w-2 h-4 bg-primary animate-pulse rounded-sm" />

//                   Generating personalized script...
//                 </div>
//               ) : (
//                 <div className="space-y-1">
//                   {aiScriptLines.map((line, index) => (
//                     <p className="text-sm leading-relaxed text-foreground">
//   {line}
// </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Key Talking Points – highlighted */}
//           {/* {talkingPoints.length > 0 && (
//             <div className="space-y-2">
//               <span className="text-xs font-medium text-muted-foreground">Key Talking Points</span>
//               <div className="space-y-2">
//                 {talkingPoints.map((point, index) => {
//                   const Icon = point.icon;
//                   return (
//                     <div
//                       key={index}
//                       className={cn(
//                         'p-3 rounded-lg flex items-start gap-2 text-sm',
//                         severityStyles[point.severity]
//                       )}
//                     >
//                       <Icon className="h-4 w-4 mt-0.5 shrink-0" />
//                       <span>{point.text}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )} */}

//           {/* Action Buttons */}
//           <div className="space-y-2">
//             <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleStartCall}>
//               <Phone className="h-4 w-4 mr-2" />
//               Start Call
//             </Button>
//             <Button variant="outline" className="w-full" onClick={handleSendWhatsApp}>
//               <MessageSquare className="h-4 w-4 mr-2" />
//               Send WhatsApp
//             </Button>
//           </div>

//           {/* Call Outcome */}
//           <div className="space-y-2">
//             <span className="text-xs font-medium text-muted-foreground">Call Outcome</span>
//             <div className="grid grid-cols-2 gap-2">
//               {callOutcomes.map((outcome) => (
//                 <button
//                   key={outcome.id}
//                   onClick={() => setSelectedOutcome(outcome.id)}
//                   className={cn(
//                     'px-3 py-2 rounded-lg text-xs font-medium border transition-all',
//                     selectedOutcome === outcome.id
//                       ? outcome.color + ' ring-2 ring-offset-2 ring-offset-background'
//                       : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
//                   )}
//                 >
//                   {selectedOutcome === outcome.id && <Check className="h-3 w-3 inline mr-1" />}
//                   {outcome.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Call Notes */}
//           <div className="space-y-2">
//             <span className="text-xs font-medium text-muted-foreground">Call Notes</span>
//             <Textarea
//               placeholder="Add call notes here..."
//               value={callNotes}
//               onChange={(e) => setCallNotes(e.target.value)}
//               className="min-h-[100px] resize-none text-sm"
//             />
//           </div>

//           {/* Follow-up Date */}
//           <div className="space-y-2">
//             <span className="text-xs font-medium text-muted-foreground">Follow-up Date</span>
//             <Button
//               variant="outline"
//               onClick={() => setIsCalendarOpen(true)}
//               className={cn(
//                 'w-full justify-start text-left font-normal',
//                 !followUpDate && 'text-muted-foreground'
//               )}
//             >
//               <Calendar className="mr-2 h-4 w-4" />
//               {followUpDate ? format(followUpDate, 'PPP') : 'Select a date'}
//             </Button>
//             <ShowDateModal
//               open={isCalendarOpen}
//               onClose={() => setIsCalendarOpen(false)}
//               onSelectDate={(selected) => {
//                 setFollowUpDate(selected);
//                 setIsCalendarOpen(false);
//               }}
//             />
//           </div>

//           {/* Customer Quick Info */}
//           {customer && (
//             <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
//               <span className="text-xs font-medium text-muted-foreground">Customer Summary</span>
//               <div className="grid grid-cols-2 gap-2 text-xs">
//                 <div>
//                   <span className="text-muted-foreground">Outstanding:</span>
//                   <span className="ml-1 font-medium">₹{customer.TotalOutstanding?.toLocaleString()}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Overdue:</span>
//                   <span
//                     className={cn(
//                       'ml-1 font-medium',
//                       customer.OverdueAmount > 0 ? 'text-destructive' : 'text-success'
//                     )}
//                   >
//                     ₹{customer.OverdueAmount?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Segment:</span>
//                   <Badge variant="outline" className="ml-1 text-[10px]">
//                     {customer.Grade}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </ScrollArea>

//       {/* Footer */}
//       <div className="p-4 border-t border-border">
//         <Button
//           className="w-full bg-success hover:bg-success/90 text-success-foreground"
//           onClick={handleSaveAndClose}
//         >
//           <Check className="h-4 w-4 mr-2" />
//           Save & Close
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SalesSmartDialer;




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
  useEffect(() => {
    if (customer && isOpen) {
      streamSalesScript(customer.Acno);
    }
  }, [customer, isOpen]);



  // console.log("Dynamic talking points extracted from AI script:", dynamicTalkingPoints);

  // API call for streaming AI response – line by line, immediate display
  const streamSalesScript = async (customerId) => {
    setAiScriptLines([]);
   
    setIsGenerating(true);

    try {
      const response = await fetch('/__sales_api/sales/script/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split buffer by newline, keep the last partial line in buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // last element may be incomplete

        // Add complete lines to state immediately
        if (lines.length > 0) {
          setAiScriptLines((prev) => [...prev, ...lines]);
        }
      }

      // After stream ends, add any remaining partial line
      if (buffer) {
        setAiScriptLines((prev) => [...prev, buffer]);
      }
    } catch (error) {
      console.error('Streaming error:', error);
      toast.error('Failed to load AI script');
    } finally {
      setIsGenerating(false);
    }
  };

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
