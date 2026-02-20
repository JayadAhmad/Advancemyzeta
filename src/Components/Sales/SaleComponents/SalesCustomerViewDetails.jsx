import { useState } from 'react';
import { X, Phone, MessageSquare, Mail, FileText, CreditCard, Calendar, Package, AlertTriangle, Clock, TrendingUp, MapPin, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { cn } from '@/lib/utils';

const agingData = [
  { bucket: 'Current', amount: 125000, percentage: 45 },
  { bucket: '1-30 Days', amount: 85000, percentage: 31 },
  { bucket: '31-60 Days', amount: 45000, percentage: 16 },
  { bucket: '61-90 Days', amount: 15000, percentage: 5 },
  { bucket: '90+ Days', amount: 8000, percentage: 3 },
];

const recentInvoices = [
  { id: 'INV-2024-001', date: '2024-01-10', amount: 45000, status: 'paid' },
  { id: 'INV-2024-002', date: '2024-01-08', amount: 32000, status: 'pending' },
  { id: 'INV-2024-003', date: '2024-01-05', amount: 28500, status: 'overdue' },
  { id: 'INV-2024-004', date: '2024-01-02', amount: 51000, status: 'paid' },
];

const recommendedProducts = [
  { name: 'Paracetamol 500mg', reason: 'High margin', margin: '18%', stock: 'In Stock' },
  { name: 'Metformin 500mg', reason: 'Focus Product', margin: '15%', stock: 'In Stock' },
  { name: 'Omeprazole 20mg', reason: 'Frequently ordered', margin: '14%', stock: 'Low Stock' },
  { name: 'Amoxicillin 250mg', reason: 'Scheme Active', margin: '12%', stock: 'In Stock' },
];

const activityLog = [
  { type: 'call', description: 'Outbound call - Discussed scheme', date: '2 hours ago', user: 'Raj Kumar' },
  { type: 'order', description: 'Order placed - ₹45,000', date: 'Yesterday', user: 'System' },
  { type: 'payment', description: 'Payment received - ₹32,000', date: '3 days ago', user: 'System' },
  { type: 'visit', description: 'Field visit completed', date: '1 week ago', user: 'Raj Kumar' },
  { type: 'claim', description: 'Claim raised - Batch issue', date: '2 weeks ago', user: 'Customer' },
];

const getIconForActivityType = (type) => {
  switch (type) {
    case 'call': return Phone;
    case 'order': return Package;
    case 'payment': return CreditCard;
    case 'visit': return MapPin;
    case 'claim': return AlertTriangle;
    default: return Phone;
  }
};

const getColorForActivityType = (type) => {
  switch (type) {
    case 'call': return 'bg-primary/20 text-primary';
    case 'order': return 'bg-success/20 text-success';
    case 'payment': return 'bg-info/20 text-info';
    case 'visit': return 'bg-warning/20 text-warning';
    case 'claim': return 'bg-destructive/20 text-destructive';
    default: return 'bg-primary/20 text-primary';
  }
};

const getColorForAgingBucket = (bucket) => {
  switch (bucket) {
    case 'Current': return 'bg-success';
    case '1-30 Days': return 'bg-info';
    case '31-60 Days': return 'bg-warning';
    case '61-90 Days': return 'bg-orange-500';
    case '90+ Days': return 'bg-destructive';
    default: return 'bg-muted';
  }
};

 const SalesCustomerViewDetails = ({ isOpen, onClose, customer, onPlaceOrder, onCreatePO }) => {
  const [expandedAging, setExpandedAging] = useState(false);

  if (!isOpen || !customer) return null;

  const creditUtilization = (customer.creditUsed / customer.creditLimit) * 100;
  const isHighCreditUsage = creditUtilization > 80;

  const toggleAgingExpanded = () => {
    setExpandedAging(!expandedAging);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-card border-l border-border z-50 flex flex-col shadow-xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{customer.name}</h2>
                <Badge variant="outline" className="text-xs">{customer.segment}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Building className="h-3 w-3" />
                <span>{customer.type}</span>
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{customer.address}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button size="sm" className="bg-success hover:bg-success/90">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="border-success text-success hover:bg-success/10">
              <MessageSquare className="h-3 w-3 mr-1" />
              WhatsApp
            </Button>
            <Button size="sm" variant="outline">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-3 w-3 mr-1" />
              Statement
            </Button>
            <Button size="sm" variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              Follow-up
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Credit & Outstanding Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Outstanding</p>
                <p className="text-2xl font-bold mt-1">₹{(customer.outstanding / 1000).toFixed(1)}K</p>
                {customer.overdue > 0 && (
                  <p className="text-xs text-destructive mt-1">
                    ₹{(customer.overdue / 1000).toFixed(1)}K overdue
                  </p>
                )}
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Credit Limit</p>
                <p className="text-2xl font-bold mt-1">₹{(customer.creditLimit / 1000).toFixed(0)}K</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Used</span>
                    <span className={cn(isHighCreditUsage ? 'text-destructive' : 'text-foreground')}>
                      {creditUtilization.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all',
                        isHighCreditUsage ? 'bg-destructive' : 'bg-primary'
                      )}
                      style={{ width: `${Math.min(creditUtilization, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Aging Breakdown */}
            <div className="bg-muted/30 rounded-lg p-4">
              <button
                onClick={toggleAgingExpanded}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Aging Breakdown</span>
                </div>
                {expandedAging ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {expandedAging && (
                <div className="mt-4 space-y-2">
                  {agingData.map((item) => (
                    <div key={item.bucket} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          getColorForAgingBucket(item.bucket)
                        )} />
                        <span className="text-sm">{item.bucket}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium mono">₹{(item.amount / 1000).toFixed(0)}K</span>
                        <span className="text-xs text-muted-foreground w-8">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
                <TabsTrigger value="invoices" className="text-xs">Invoices</TabsTrigger>
                <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                <TabsTrigger value="claims" className="text-xs">Claims</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Recommended Products</p>
                  {recommendedProducts.map((product) => (
                    <div key={product.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[10px]">{product.reason}</Badge>
                          <span className="text-xs text-success">{product.margin} margin</span>
                        </div>
                      </div>
                      <Badge variant={product.stock === 'In Stock' ? 'outline' : 'destructive'} className="text-[10px]">
                        {product.stock}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="invoices" className="mt-4">
                <div className="space-y-2">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium mono">{invoice.id}</p>
                        <p className="text-xs text-muted-foreground">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium mono">₹{invoice.amount.toLocaleString()}</p>
                        <Badge 
                          variant={invoice.status === 'paid' ? 'outline' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}
                          className={cn(
                            'text-[10px]',
                            invoice.status === 'paid' && 'text-success border-success'
                          )}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <div className="space-y-3">
                  {activityLog.map((activity, index) => {
                    const IconComponent = getIconForActivityType(activity.type);
                    const activityColor = getColorForActivityType(activity.type);
                    
                    return (
                      <div key={index} className="flex gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                          activityColor
                        )}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">{activity.date}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{activity.user}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="claims" className="mt-4">
                {customer.pendingClaims > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div>
                        <p className="text-sm font-medium">Rate Difference Claim</p>
                        <p className="text-xs text-muted-foreground">INV-2024-003 • Submitted 5 days ago</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-destructive">₹2,500</p>
                        <Badge variant="destructive" className="text-[10px]">Beyond SLA</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No pending claims
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <AlertTriangle className="h-3 w-3 mr-2" />
                  Raise New Claim
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onPlaceOrder} className="bg-primary hover:bg-primary/90">
              <Package className="h-4 w-4 mr-2" />
              Place Order
            </Button>
            <Button variant="outline" onClick={onCreatePO}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Create PO Request
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <CreditCard className="h-3 w-3 mr-2" />
              Record Payment
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-3 w-3 mr-2" />
              Create PTP
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesCustomerViewDetails;