
import { useState } from 'react';
import { X, Plus, Trash2, Search, Package, Check, Save } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { cn } from '@/lib/utils';

const availableProducts = [
  { id: '1', name: 'Paracetamol 500mg', sku: 'PARA-500', rate: 45, stock: 500, scheme: 'Buy 10 Get 1' },
  { id: '2', name: 'Metformin 500mg', sku: 'MET-500', rate: 85, stock: 350, scheme: null },
  { id: '3', name: 'Omeprazole 20mg', sku: 'OME-20', rate: 120, stock: 200, scheme: '5% Extra' },
  { id: '4', name: 'Amoxicillin 250mg', sku: 'AMOX-250', rate: 65, stock: 420, scheme: null },
  { id: '5', name: 'Atorvastatin 10mg', sku: 'ATOR-10', rate: 95, stock: 180, scheme: 'Buy 5 Get 1' },
  { id: '6', name: 'Azithromycin 500mg', sku: 'AZI-500', rate: 150, stock: 120, scheme: null },
  { id: '7', name: 'Ciprofloxacin 500mg', sku: 'CIPRO-500', rate: 78, stock: 280, scheme: '3% Extra' },
  { id: '8', name: 'Pantoprazole 40mg', sku: 'PANTO-40', rate: 110, stock: 310, scheme: null },
];

 const SalesOrderModal = ({ isOpen, onClose, customerName, onSaveDraft, onConfirm }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);

  const filteredProducts = availableProducts.filter(
    product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = (product) => {
    const existing = orderItems.find(item => item.id === product.id);
    
    if (existing) {
      setOrderItems(items => 
        items.map(item => {
          if (item.id === product.id) {
            const newQty = item.qty + 1;
            return { 
              ...item, 
              qty: newQty, 
              amount: newQty * item.rate * (1 - item.discount / 100) 
            };
          }
          return item;
        })
      );
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        qty: 1,
        rate: product.rate,
        discount: 0,
        scheme: product.scheme || undefined,
        amount: product.rate,
        stock: product.stock,
      };
      setOrderItems([...orderItems, newItem]);
    }
    
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const updateItem = (id, field, value) => {
    setOrderItems(items =>
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.amount = updated.qty * updated.rate * (1 - updated.discount / 100);
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setOrderItems(items => items.filter(item => item.id !== id));
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.amount, 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.qty, 0);

  const handleSaveDraft = () => {
    onSaveDraft(orderItems);
  };

  const handleConfirmOrder = () => {
    onConfirm(orderItems);
  };

  const handleInputChange = (itemId, field, e) => {
    const value = parseFloat(e.target.value) || 0;
    if (field === 'qty' && value < 1) return;
    if (field === 'discount' && (value < 0 || value > 100)) return;
    updateItem(itemId, field, value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span>New Order</span>
              <span className="text-muted-foreground font-normal ml-2">for {customerName}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Add Product */}
          <div className="relative mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowProductSearch(true);
                  }}
                  onFocus={() => setShowProductSearch(true)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setShowProductSearch(!showProductSearch)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Product Search Dropdown */}
            {showProductSearch && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-auto">
                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No products found
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addProduct(product)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground mono">{product.sku}</span>
                          {product.scheme && (
                            <Badge variant="secondary" className="text-[10px] bg-success/20 text-success">
                              {product.scheme}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium mono">₹{product.rate}</p>
                        <p className={cn(
                          'text-xs',
                          product.stock < 50 ? 'text-destructive' : 'text-muted-foreground'
                        )}>
                          Stock: {product.stock}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Order Items Table */}
          <div className="flex-1 overflow-hidden border border-border rounded-lg">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
              <div className="col-span-4">Product</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-center">Rate</div>
              <div className="col-span-1 text-center">Disc%</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-1"></div>
            </div>
            
            <ScrollArea className="h-[300px]">
              {orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                  <Package className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">No items added</p>
                  <p className="text-xs">Search and add products above</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orderItems.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30">
                      <div className="col-span-4">
                        <p className="text-sm font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground mono">{item.sku}</span>
                          {item.scheme && (
                            <Badge variant="secondary" className="text-[9px] bg-success/20 text-success">
                              {item.scheme}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={item.qty}
                          onChange={(e) => handleInputChange(item.id, 'qty', e)}
                          className="h-8 text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min={0}
                          value={item.rate}
                          onChange={(e) => handleInputChange(item.id, 'rate', e)}
                          className="h-8 text-center"
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={item.discount}
                          onChange={(e) => handleInputChange(item.id, 'discount', e)}
                          className="h-8 text-center"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-sm font-medium mono">₹{item.amount.toLocaleString()}</p>
                      </div>
                      <div className="col-span-1 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center justify-between bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Total Items</p>
                <p className="text-lg font-semibold">{totalItems}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Line Items</p>
                <p className="text-lg font-semibold">{orderItems.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Order Total</p>
              <p className="text-2xl font-bold mono">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={orderItems.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={handleConfirmOrder}
              disabled={orderItems.length === 0}
              className="bg-success hover:bg-success/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesOrderModal;