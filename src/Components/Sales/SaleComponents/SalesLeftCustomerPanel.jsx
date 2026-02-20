import { useState, useMemo } from "react";
import {
  Phone,
  MessageSquare,
  Clock,
  User,
  AlertCircle,
  Star,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

// ─── Priority Helpers ────────────────────────────────────────────
const getPriority = (item, activeTab) => {
  if (activeTab === "overdue") {
    const amt = Number(item.OverdueAmount || 0);
    if (amt > 50000) return "critical";
    if (amt > 0) return "high";
  }
  if (activeTab === "highPotential") return "high";
  if (activeTab === "followUps") return "medium";
  if (activeTab === "noOrder") return "high";
  return "medium"; // today default
};

const priorityStyles = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/20 text-info border-info/30",
  high: "bg-warning/20 text-warning border-warning/30",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
};

const getPriorityBarColor = (priority) => {
  switch (priority) {
    case "critical":
      return "bg-destructive";
    case "high":
      return "bg-warning";
    case "medium":
      return "bg-info";
    default:
      return "bg-muted-foreground";
  }
};

// ─── Main Component ─────────────────────────────────────────────
const SalesLeftCustomerPanel = ({
  onSelectCustomer,
  customers,
  loading,
  error,
}) => {
  const selectedCustomerId = useSelector(
    (state) => state.sales.selectedCustomer?.Acno
  );

  const [activeTab, setActiveTab] = useState("today");

  const callQueueData = useMemo(() => ({
    today: customers,
    overdue: customers.filter((c) => Number(c.OverdueAmount) > 0),
    noOrder: customers.filter(
      (c) => c.IsOrder === false || c.IsOrder === "False"
    ),
    highPotential: customers.filter(
      (c) => c.HighValue === true || c.HighValue === "True"
    ),
    followUps: customers.filter(
      (c) => c.FollowUp === true || c.FollowUp === "True"
    ),
  }), [customers]);

  // Keyboard handling for accessibility
  const handleKeyDown = (e, item) => {
    console.log("event target value -------",e.key)
    if (e.key === "Enter" || e.key === " ") {
     
      e.preventDefault();
      onSelectCustomer(item);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg border border-border">
        <span className="text-sm text-muted-foreground animate-pulse">
          Loading customers...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg border border-border">
        <span className="text-sm text-destructive">Failed to load customers</span>
      </div>
    );
  }

  const renderQueueItem = (item) => {
    const isSelected = selectedCustomerId === item.Acno;
    const priority = getPriority(item, activeTab);

    return (
      <div
        key={item.Acno}
        role="button"
        tabIndex={0}
        onClick={() => onSelectCustomer(item)}
        onKeyDown={(e) => handleKeyDown(e, item)}
        className={cn(
          "w-full flex items-start gap-3 p-3 rounded-xl  transition-all duration-200 text-left group cursor-pointer",
          "border border-transparent hover:shadow-md hover:border-border",
          isSelected
            ? "bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border-primary/30 shadow-sm"
            : "hover:bg-muted/50"
        )}
      >
        {/* Priority bar – taller, more visible */}
         <div
    className={cn(
      "w-2 self-stretch rounded-full shrink-0",
      getPriorityBarColor(priority)
    )}
  />
        {/* Content – flex-1 + min-w-0 prevents overflow */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold truncate leading-tight">
              {item.Name}
            </p>
            <Badge
              className={cn(
                "text-[10px] px-1.5 py-0.5 font-medium border",
                priorityStyles[priority]
              )}
            >
              {priority === "critical" && <AlertCircle className="w-2.5 h-2.5 mr-1" />}
              {priority}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 font-normal">
              {item.Grade || "—"}
            </Badge>
            <span className="text-muted-foreground">
              Ac: {item.Acno}
            </span>
          </div>

          {Number(item.OverdueAmount) > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
                ₹ {item.OverdueAmount}  overdue
              </span>
            </div>
          )}
           {Number(item.TotalOutstanding) > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
                ₹ {item.TotalOutstanding}  Outstanding
              </span>
            </div>
          )}
        </div>

        {/* Action buttons – always visible, now with ml-auto & shrink-0 */}
       <div className="flex items-center gap-2 ml-auto shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-success hover:bg-success/10 hover:text-success"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Call", item.Name);
            }}
          >
            <Phone className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-success hover:bg-success/10 hover:text-success"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Message", item.Name);
            }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderTabContent = (data) => {
    if (!data.length) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
            <User className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">No customers</p>
        </div>
      );
    }
    return <div className="space-y-2">{data.map(renderQueueItem)}</div>;
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-3 pt-3 border-b border-border bg-muted/5">
          <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-muted/30">
            <TabsTrigger
              value="today"
              className="text-[11px] px-2 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
            >
              Today
              <Badge variant="secondary" className="ml-1 text-[9px] px-1.5">
                {callQueueData.today.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="overdue"
              className="text-[11px] px-2 py-1.5 data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground rounded-md"
            >
              Overdue
              <Badge
                variant="secondary"
                className="ml-1 text-[9px] px-1.5 "
              >
                {callQueueData.overdue.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="noOrder"
              className="text-[11px] px-2 py-1.5 data-[state=active]:bg-warning data-[state=active]:text-warning-foreground rounded-md"
            >
              No Order
              <Badge variant="secondary" className="ml-1 text-[9px] px-1.5">
                {callQueueData.noOrder.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="highPotential"
              className="text-[11px] px-2 py-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-md"
            >
              <Star className="w-3 h-3 mr-1 inline-block" />
              High Value
              <Badge variant="secondary" className="ml-1 text-[9px] px-1.5">
                {callQueueData.highPotential.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="followUps"
              className="text-[11px] px-2 py-1.5 data-[state=active]:bg-info data-[state=active]:text-info-foreground rounded-md"
            >
              <Clock className="w-3 h-3 mr-1 inline-block" />
              Follow-up
              <Badge variant="secondary" className="ml-1 text-[9px] px-1.5">
                {callQueueData.followUps.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 px-2 py-3">
          <TabsContent value="today" className="mt-0">
            {renderTabContent(callQueueData.today)}
          </TabsContent>
          <TabsContent value="overdue" className="mt-0">
            {renderTabContent(callQueueData.overdue)}
          </TabsContent>
          <TabsContent value="noOrder" className="mt-0">
            {renderTabContent(callQueueData.noOrder)}
          </TabsContent>
          <TabsContent value="highPotential" className="mt-0">
            {renderTabContent(callQueueData.highPotential)}
          </TabsContent>
          <TabsContent value="followUps" className="mt-0">
            {renderTabContent(callQueueData.followUps)}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default SalesLeftCustomerPanel;

