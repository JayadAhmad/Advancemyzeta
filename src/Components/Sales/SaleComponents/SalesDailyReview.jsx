
import { Phone, Package, CreditCard, Calendar, Target, TrendingUp, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { cn } from '@/lib/utils';

const reviewData = {
  calls: { target: 32, completed: 28, connected: 22 },
  orders: { target: 8, captured: 6, value: 285000, targetValue: 350000 },
  collection: { target: 500000, achieved: 425000, ptp: 180000 },
  followUps: { scheduled: 15, completed: 12, missed: 3 },
};

const missedFollowUps = [
  { customer: 'Apollo Pharmacy', reason: 'Not reachable', time: '2:00 PM' },
  { customer: 'MedPlus Hyderabad', reason: 'Meeting overrun', time: '3:30 PM' },
  { customer: 'PharmEasy', reason: 'Busy signal', time: '4:30 PM' },
];

const topPerformance = [
  { metric: 'Highest Order', customer: 'Wellness Forever', value: '₹85,000' },
  { metric: 'Best Collection', customer: 'Netmeds', value: '₹125,000' },
  { metric: 'Most Calls', count: 28, target: 32 },
];

const blockers = [
  { type: 'Credit Block', count: 3, impact: '₹2.5L potential orders' },
  { type: 'Pending Claims', count: 4, impact: 'Payment holdups' },
  { type: 'Stock Out', count: 5, impact: '₹80K lost sales' },
];


const SalesDailyReview = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const callProgress = (reviewData.calls.completed / reviewData.calls.target) * 100;
  const orderProgress = (reviewData.orders.captured / reviewData.orders.target) * 100;
  const collectionProgress = (reviewData.collection.achieved / reviewData.collection.target) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-card border-l border-border z-50 flex flex-col shadow-xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">End of Day Review</h2>
              <p className="text-sm text-muted-foreground">Monday, January 15, 2024</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Overall Performance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Calls</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{reviewData.calls.completed}/{reviewData.calls.target}</p>
                    <p className="text-xs text-muted-foreground">{reviewData.calls.connected} connected</p>
                  </div>
                  <Badge className={cn(
                    'text-xs',
                    callProgress >= 90 ? 'bg-success/20 text-success' : callProgress >= 70 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                  )}>
                    {callProgress.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={callProgress} className="h-1.5 mt-3" />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Orders</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{reviewData.orders.captured}/{reviewData.orders.target}</p>
                    <p className="text-xs text-muted-foreground">₹{(reviewData.orders.value / 1000).toFixed(0)}K value</p>
                  </div>
                  <Badge className={cn(
                    'text-xs',
                    orderProgress >= 90 ? 'bg-success/20 text-success' : orderProgress >= 70 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                  )}>
                    {orderProgress.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={orderProgress} className="h-1.5 mt-3" />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium">Collection</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">₹{(reviewData.collection.achieved / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">₹{(reviewData.collection.ptp / 1000).toFixed(0)}K PTP taken</p>
                  </div>
                  <Badge className={cn(
                    'text-xs',
                    collectionProgress >= 90 ? 'bg-success/20 text-success' : collectionProgress >= 70 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                  )}>
                    {collectionProgress.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={collectionProgress} className="h-1.5 mt-3" />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Follow-ups</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{reviewData.followUps.completed}/{reviewData.followUps.scheduled}</p>
                    <p className="text-xs text-destructive">{reviewData.followUps.missed} missed</p>
                  </div>
                  <Badge className={cn(
                    'text-xs',
                    reviewData.followUps.missed === 0 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                  )}>
                    {((reviewData.followUps.completed / reviewData.followUps.scheduled) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Missed Follow-ups */}
            {missedFollowUps.length > 0 && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Missed Follow-ups</span>
                </div>
                <div className="space-y-2">
                  {missedFollowUps.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-destructive/10 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.customer}</p>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 text-destructive border-destructive/30 hover:bg-destructive/10">
                  Reschedule All
                </Button>
              </div>
            )}

            {/* Top Performance */}
            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Today's Highlights</span>
              </div>
              <div className="space-y-2">
                {topPerformance.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-success/10 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.metric}</p>
                      {item.customer && <p className="text-xs text-muted-foreground">{item.customer}</p>}
                    </div>
                    <span className="text-sm font-semibold text-success">{item.value || `${item.count}/${item.target}`}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers */}
            <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Today's Blockers</span>
              </div>
              <div className="space-y-2">
                {blockers.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-warning/10 last:border-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] bg-warning/20 text-warning">{item.count}</Badge>
                      <p className="text-sm">{item.type}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tomorrow's Priority */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Tomorrow's Priority</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Follow up with 3 missed customers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Collect ₹1.8L PTP commitments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Push credit blocked customers for payment
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">Export Report</Button>
            <Button>Submit & Close Day</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesDailyReview;