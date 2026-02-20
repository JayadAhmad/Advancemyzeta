import { useState } from 'react';
import { Search, Package, AlertTriangle, Calendar, Building } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { cn } from '@/lib/utils';

const lowStockItems = [
  { id: '1', name: 'Omeprazole 20mg', sku: 'OME-20', stock: 25, reorderLevel: 100, avgDailySales: 15 },
  { id: '2', name: 'Atorvastatin 10mg', sku: 'ATOR-10', stock: 40, reorderLevel: 150, avgDailySales: 20 },
  { id: '3', name: 'Azithromycin 500mg', sku: 'AZI-500', stock: 18, reorderLevel: 80, avgDailySales: 8 },
  { id: '4', name: 'Clopidogrel 75mg', sku: 'CLOP-75', stock: 0, reorderLevel: 60, avgDailySales: 5 },
  { id: '5', name: 'Losartan 50mg', sku: 'LOS-50', stock: 35, reorderLevel: 120, avgDailySales: 12 },
];

const priorityOptions = [
  { value: 'low', label: 'Low', description: 'Within 2 weeks', color: 'bg-muted text-muted-foreground' },
  { value: 'medium', label: 'Medium', description: 'Within 1 week', color: 'bg-info/20 text-info' },
  { value: 'high', label: 'High', description: 'Within 3 days', color: 'bg-warning/20 text-warning' },
  { value: 'urgent', label: 'Urgent', description: 'Within 24 hours', color: 'bg-destructive/20 text-destructive' },
];

const reasonOptions = [
  'Customer Demand',
  'Stock Out',
  'Low Stock Alert',
  'Seasonal Demand',
  'New Customer Requirement',
  'Scheme/Promotion',
  'Other',
];

const getStockDaysRemaining = (item) => {
  if (item.avgDailySales === 0) return 'N/A';
  const days = Math.floor(item.stock / item.avgDailySales);
  return days === 0 ? 'Out of Stock' : `${days} days`;
};

const getStockColor = (stock, reorderLevel) => {
  if (stock === 0) return 'text-destructive';
  if (stock < reorderLevel) return 'text-warning';
  return 'text-foreground';
};

export const PORequestModal = ({ isOpen, onClose, customerName, onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(0);
  const [priority, setPriority] = useState('medium');
  const [reason, setReason] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showItemSearch, setShowItemSearch] = useState(false);

  const filteredItems = lowStockItems.filter(
    item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowItemSearch(true);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setSearchQuery('');
    setShowItemSearch(false);
    // Suggest reorder quantity
    setQty(item.reorderLevel - item.stock);
  };

  const handleQtyChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQty(value < 0 ? 0 : value);
  };

  const handlePrioritySelect = (value) => {
    setPriority(value);
  };

  const handleSubmit = () => {
    if (!selectedItem || !qty || !reason || !expectedDate) return;

    const requestData = {
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      qty,
      priority,
      customerName,
      reason,
      expectedDate,
      notes: notes || undefined,
    };

    onSubmit(requestData);

    // Reset form
    setSelectedItem(null);
    setQty(0);
    setPriority('medium');
    setReason('');
    setExpectedDate('');
    setNotes('');
    onClose();
  };

  const isFormValid = selectedItem && qty > 0 && reason && expectedDate;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Create Purchase Request
          </DialogTitle>
          <DialogDescription>
            Request purchase team to procure items for stock replenishment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Link (if any) */}
          {customerName && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Linked to:</span>
              <Badge variant="outline">{customerName}</Badge>
            </div>
          )}

          {/* Item Selection */}
          <div className="space-y-2">
            <Label>Select Item *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowItemSearch(true)}
                className="pl-10"
              />
              
              {showItemSearch && searchQuery && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-auto">
                  {filteredItems.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      No items found
                    </div>
                  ) : (
                    filteredItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleItemSelect(item)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <span className="text-xs text-muted-foreground mono">{item.sku}</span>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            'text-sm font-medium',
                            getStockColor(item.stock, item.reorderLevel)
                          )}>
                            {item.stock} in stock
                          </p>
                          <p className="text-xs text-muted-foreground">{getStockDaysRemaining(item)}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Item Display */}
            {selectedItem && (
              <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{selectedItem.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground mono">{selectedItem.sku}</span>
                    {selectedItem.stock === 0 && (
                      <Badge variant="destructive" className="text-[10px]">Out of Stock</Badge>
                    )}
                    {selectedItem.stock > 0 && selectedItem.stock < selectedItem.reorderLevel && (
                      <Badge variant="secondary" className="text-[10px] bg-warning/20 text-warning">Low Stock</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">Current: <span className="font-medium">{selectedItem.stock}</span></p>
                  <p className="text-xs text-muted-foreground">Reorder: {selectedItem.reorderLevel}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label>Quantity Required *</Label>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={handleQtyChange}
              placeholder="Enter quantity"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority *</Label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handlePrioritySelect(option.value)}
                  className={cn(
                    'p-2 rounded-lg border transition-all text-center',
                    priority === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Badge className={cn('text-[10px]', option.color)}>{option.label}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason..." />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expected Date */}
          <div className="space-y-2">
            <Label>Expected Delivery Date *</Label>
            <Input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or notes..."
              rows={2}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PORequestModal