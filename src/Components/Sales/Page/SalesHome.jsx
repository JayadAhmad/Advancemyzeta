import { useState ,useEffect, use} from "react";
import Header from "../../Layout/Header";
import KPITile from "../../shared/KPITile";
import SalesOrderModal from "../SaleComponents/SalesOrderModal";
import PORequestModal from "../SaleComponents/PORequestModal";
import SalesLeftCustomerPanel from "../SaleComponents/SalesLeftCustomerPanel";
import SalesCustomerViewDetails from "../SaleComponents/SalesCustomerViewDetails";
import SalesDailyReview from "../SaleComponents/SalesDailyReview";
import SalesSmartDialer from "../SaleComponents/SalesSmartDialer";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import { useSelector,useDispatch } from "react-redux";
import { selectCustomer,clearSelectedCustomer } from "../../../features/salesSlice";
import {fetchTodayCustomersApi} from "../../../Api/SalesApi";
import {
  Phone,
  PhoneCall,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  BarChart3,
  Sparkles,
} from "lucide-react";

const SalesHome = () => {
  // const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dispatch = useDispatch();
  const selectedCustomer = useSelector((state) => state.sales.selectedCustomer);
  // console.log("SalesHome - selectedCustomer from Redux++++++:", selectedCustomer);
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showDailyReview, setShowDailyReview] = useState(false);
  const [showSmartDialer, setShowSmartDialer] = useState(false);
  // left customer panel data
  const [leftpanelData, setLeftPanelData] = useState([]);
  const [loadingLeftPanel, setLoadingLeftPanel] = useState(false);
  const [errorLeftPanel, setErrorLeftPanel] = useState(null);

  useEffect(() => {
  
  }, [selectedCustomer]);

  const loadTodayCustomers = async () => {
    try{
      setLoadingLeftPanel(true);
      const response = await fetchTodayCustomersApi();
      console.log("response sales api ---------------",response.data)
      setLeftPanelData(response.data);
    } catch (error) {
      setErrorLeftPanel(error.message);
    } finally {
      setLoadingLeftPanel(false);
    }
  };
  useEffect(() => {
    loadTodayCustomers();
  }, []);

  const handleSelectCustomer = (customer) => {
    // setSelectedCustomer(customer);
   
    dispatch(selectCustomer(customer));
    setShowSmartDialer(true);
  };

  const handleOpenDialer = () => {
    if (selectedCustomer) {
      setShowSmartDialer(true);
    } else {
      toast.info("Select a customer from the queue first");
    }
  };

  const handlePlaceOrder = () => {
    setShowCustomerDrawer(false);
    setShowOrderModal(true);
  };

  const handleCreatePO = () => {
    setShowCustomerDrawer(false);
    setShowPOModal(true);
  };

  return (
    <div className="h-full flex flex-col">
      <Header title="Sales Workspace" subtitle="My Territory">
        <div className="flex items-center gap-2">
           {selectedCustomer && (
            <>
            <Button size="sm" variant="outline" onClick={handleOpenDialer}>
              <Sparkles className="h-4 w-4 mr-2" />
              Smart Dialer
            </Button>
            <Button variant="outline" onClick={() => setShowCustomerDrawer(true)}> View Full Profile </Button>
             <Button variant="outline" onClick={handlePlaceOrder}> <Package className="h-4 w-4 mr-2" /> Place Order </Button>
            </> 
          ) 
        }
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDailyReview(true)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Daily Review
          </Button>
        </div>
      </Header>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          <KPITile
            title="Today's Calls"
            value="18/32"
            subtitle="14 pending"
            icon={Phone}
            variant="default"
          />
          <KPITile
            title="Connected"
            value="72%"
            subtitle="vs 65% avg"
            icon={PhoneCall}
            variant="success"
            trend={{ value: 7, isPositive: true }}
          />
          <KPITile
            title="Orders Captured"
            value="6"
            subtitle="₹2.85L value"
            icon={Package}
            variant="default"
          />
          <KPITile
            title="Sales Value"
            value="₹2.85L"
            subtitle="Target: ₹3.5L"
            icon={Target}
            variant="warning"
          />
          <KPITile
            title="PTP Committed"
            value="₹1.8L"
            subtitle="5 customers"
            icon={CreditCard}
            variant="info"
          />
          <KPITile
            title="Follow-ups Due"
            value="8"
            subtitle="3 high priority"
            icon={Calendar}
            variant="warning"
          />
          <KPITile
            title="Reactivations"
            value="2"
            subtitle="₹45K value"
            icon={TrendingUp}
            variant="success"
          />
        </div>

        {/* Main Work Area */}
        <div
          className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6"
          style={{ minHeight: "500px" }}
        >
          {/* Call Queue - Left Column */}
          <div className="lg:col-span-2 h-full">
            <SalesLeftCustomerPanel
              onSelectCustomer={handleSelectCustomer}
             customers={leftpanelData}
             loadding={loadingLeftPanel} error={errorLeftPanel} 
            />
          </div>

          {/* Customer List / Selected Customer Info - Center + Right */}

          <div className="lg:col-span-3 bg-card rounded-lg border border-border p-6 flex">
            {selectedCustomer ? (
              <>
                <div className="text-center">
                 
                  <div className="flex flex-col   gap-3">
                   <Button onClick={() => setShowSmartDialer(true)} className="bg-primary"> 
                   <Sparkles className="h-4 w-4 mr-2" /> Open Smart Dialer </Button>
                    <Button variant="outline" onClick={() => setShowCustomerDrawer(true)}> View Full Profile </Button>
                     <Button variant="outline" onClick={handlePlaceOrder}> <Package className="h-4 w-4 mr-2" /> Place Order </Button> 
                     </div>
                </div>
                <div className="text-center flex flex-col items-center justify-center mx-auto">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCustomer.type} • {selectedCustomer.segment}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a customer from the queue to start calling</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer 360 Drawer */}
      <SalesCustomerViewDetails
        isOpen={showCustomerDrawer}
        onClose={() => setShowCustomerDrawer(false)}
        customer={selectedCustomer}
        onPlaceOrder={handlePlaceOrder}
        onCreatePO={handleCreatePO}
      />

      {/* Order Capture Modal */}
      <SalesOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        customerName={selectedCustomer?.name || ""}
        onSaveDraft={(items) => {
          toast.success("Order saved as draft");
          setShowOrderModal(false);
        }}
        onConfirm={(items) => {
          toast.success("Order confirmed and sent to dispatch");
          setShowOrderModal(false);
        }}
      />

      {/* PO Request Modal */}
      <PORequestModal
        isOpen={showPOModal}
        onClose={() => setShowPOModal(false)}
        customerName={selectedCustomer?.name}
        onSubmit={(request) => {
          toast.success(`PO request created for ${request.itemName}`);
          setShowPOModal(false);
        }}
      />

      {/* Daily Review */}
      <SalesDailyReview
        isOpen={showDailyReview}
        onClose={() => setShowDailyReview(false)}
      />

      {/* Smart Dialer */}
      <SalesSmartDialer
        isOpen={showSmartDialer}
        onClose={() => setShowSmartDialer(false)}
        // customer={selectedCustomer}
        onSaveAndClose={() => {
          setShowSmartDialer(false);
          // setSelectedCustomer(null);
          dispatch(clearSelectedCustomer());
        }}
      />
    </div>
  );
};

export default SalesHome;
