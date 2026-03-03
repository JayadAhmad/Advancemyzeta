import { useState,useRef, useEffect } from "react";
import { X, Plus, Trash2, Search, Package, Check, Save } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";
import { fetchItemsApi } from "../../../Api/SalesApi";



const SalesOrderModal = ({
  isOpen,
  onClose,
  customerName,
  onSaveDraft,
  onConfirm,
}) => {
  const [orderItems, setOrderItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); 
  const searchInputRef = useRef(null); 
  const itemRefs = useRef([]); 
// search focus
   useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);
// global keydown for search and escape
useEffect(() => {
  const handleGlobalKeyDown = (e) => {
    console.log("Global keydown:", e.key);
    if (!isOpen) return;
     if (
      e.key === "ArrowDown" ||
      e.key === "ArrowUp" ||
      e.key === "Enter"
    ) {
      return;
    }

    // Alt+F (ya koi bhi combination) check karne ke liye
    if (e.altKey && e.key === 's') {
      console.log("Alt+F pressed - focusing search input");
      e.preventDefault();
      searchInputRef.current?.focus();
    }

    // Escape se modal close
    if (e.key === 'Escape') {
      console.log("Escape pressed - closing modal");
      onClose(); // ya jo bhi close function hai
    }
  };

  window.addEventListener('keydown', handleGlobalKeyDown);
  return () => window.removeEventListener('keydown', handleGlobalKeyDown);
}, [isOpen, onClose]);

  useEffect(() => {
    if (orderItems.length > 0) {
      setTimeout(() => {
        // const lastIndex = orderItems.length - 1;
        itemRefs.current[0]?.focus();
      }, 50);
    }
  }, [orderItems.length]);

   useEffect(() => {
    if (!showProductSearch) setSelectedIndex(-1);
  }, [showProductSearch]);

  // Auto-select first item when products change
  useEffect(() => {
    if (products.length > 0 && showProductSearch) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [products, showProductSearch]);

   const handleSearchKeyDown = (e) => {
      e.stopPropagation();
  
    if (!showProductSearch) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < products.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      addProduct(products[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowProductSearch(false);
      setSearchQuery('');
    }
      console.log("Key pressed:", e.key, "Selected Index:", selectedIndex);
  };
console.log("orderItems:", orderItems);

  const addProduct = (product) => {
    const existing = orderItems.find((item) => item.code === product.code);
    console.log("Adding product:", product, "Existing in order:", !!existing);

    if (existing) {
      setOrderItems((items) =>
        items.map((item) => {
          if (item.code === product.code) {
            const newQty = item.qty + 1;
            return {
              ...item,
              qty: newQty,
              amount: newQty * item.rate * (1 - item.mrp / 100),
            };
          }
          return item;
        }),
      );
    } else {
       const newItem = {
      ...product,
      qty: "",
      
    };
      setOrderItems([ newItem ,...orderItems]);
    }

    setShowProductSearch(false);
    setSearchQuery("");
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setProducts([]);
      setShowProductSearch(false);
      return;
    }

    setShowProductSearch(true);
    setLoading(true);

    try {
      const res = await fetchItemsApi(value);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (code, field, value) => {
    setOrderItems((items) =>
      items.map((item) => {
        if (item.code === code) {
          const updated = { ...item, [field]: value };
          updated.amount =
            updated.qty * updated.rate * (1 - updated.discount / 100);
          return updated;
        }
        return item;
      }),
    );
  };

  const removeItem = (id) => {
    setOrderItems((items) => items.filter((item) => item.id !== id));
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.mrp, 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.qty, 0);

  const handleSaveDraft = () => {
    onSaveDraft(orderItems);
  };

  const handleConfirmOrder = () => {
    onConfirm(orderItems);
  };

  const handleInputChange = (itemId, field, e) => {
    const value = parseFloat(e.target.value) || 0;
    if (field === "qty" && value < 1) return;
    if (field === "discount" && (value < 0 || value > 100)) return;
    updateItem(itemId, field, value);
  };

  // show item scheme
  const getSchemeText = (product) => {
  if (product.Scm === 'Y' && product.currentScm > 0) {
    return `${product.currentScm} + ${product.currentScm2}`;
  }

  if (product.Scm === 'N' && product.sellingScheme > 0) {
    return `${product.sellingScheme} + ${product.sellingScheme2}`;
  }

  return '0';
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span>New Order</span>
              <span className="text-muted-foreground font-normal ml-2">
                for {customerName?.Name}
              </span>
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
          ref={searchInputRef}
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowProductSearch(true)}
          onKeyDown={handleSearchKeyDown}
          className="pl-10"
        />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowProductSearch(!showProductSearch)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Product Search Dropdown */}
            {showProductSearch && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-auto">
                {loading && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                )}

                {!loading && products.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No products found
                  </div>
                )}

                {!loading &&
                  products.map((product,index) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        addProduct(product)
                           setSelectedIndex(-1);
                      }}
                      className={cn(
                  "w-full grid grid-cols-[60%_20%_20%] items-center p-3 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-0",
                  index === selectedIndex && "bg-muted/70"
                )}
                ref={index === selectedIndex ? (el) => el?.scrollIntoView({ block: 'nearest' }) : null}
              >
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground mono">
                             Scheme :{product.Scm && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-success/20 text-success"
                            >
                              {getSchemeText(product)}
                            </Badge>
                          )}
                          </span>
                         
                        </div>
                      </div>
                      <div className="">
                        <p className="text-sm font-medium mono">
                          Pack : {product.packSize}
                        </p>
                        <p
                          className={cn(
                            "text-sm"
                            
                          )}
                        >
                          Scheme: {getSchemeText(product)}
                        </p>
                      </div>
                       <div className="">
                        <p className="text-sm font-medium mono">
                          Mrp: {product.mrp}
                        </p>
                        <p
                          className={cn(
                            "text-sm"
                            
                          )}
                        >
                          Clqty: {product.clqty}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Order Items Table */}
          <div className="flex-1 overflow-hidden border border-border rounded-lg">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
              <div className="col-span-4">Name</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-center">Srat</div>
              <div className="col-span-1 text-center">pack</div>
              <div className="col-span-2 text-center">Mrp</div>
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
                  {orderItems.map((item,index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30"
                    >
                      <div className="col-span-4">
                        <p className="text-sm font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground mono">
                             Scheme :{item.Scm && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-success/20 text-success"
                            >
                              {getSchemeText(item)}
                            </Badge>
                          )}
                          </span>
                          
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Input
                          ref={el => itemRefs.current[index] = el}
                          type="text"
                          
                          value={item.qty}
                          onChange={(e) => handleInputChange(item.code, "qty", e)}
                          className="h-8 text-center"
                        />
                      </div>
                      
                      <div className="col-span-2 text-center">
                        <p className="text-sm font-medium mono">
                          ₹{item.sRate}
                        </p>
                      </div>
                      <div className="col-span-1 text-center">
                        <p className="text-sm font-medium mono">
                          {item.packSize}
                        </p>
                      </div>
                     
                      <div className="col-span-2 text-center">
                        <p className="text-sm font-medium mono">
                          ₹{item.mrp}
                        </p>
                      </div>
                      <div className="col-span-1 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.code)}
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
              <p className="text-2xl font-bold mono">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {/* <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={orderItems.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button> */}
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
