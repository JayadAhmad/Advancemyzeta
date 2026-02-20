// import { useState } from 'react';
// import { 
//   Search, Bell, AlertTriangle, Calendar, User, ChevronDown,
//   Package, FileText, Users, Bot, MessageSquare, X
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from '@/components/ui/dropdown-menu';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
// import { useAuth } from '@/contexts/AuthContext';

// const alerts = [
//   { id: 1, type: 'overdue', title: 'MedPlus Hyderabad', message: '₹8.5L overdue for 95 days', severity: 'critical' },
//   { id: 2, type: 'sla', title: 'Ticket #T-2024-0892', message: 'SLA breach in 2 hours', severity: 'warning' },
//   { id: 3, type: 'stock', title: 'Paracetamol 500mg', message: 'Below reorder level', severity: 'warning' },
//   { id: 4, type: 'overdue', title: 'Netmeds Bangalore', message: 'Broken PTP commitment', severity: 'critical' },
// ];

// const notifications = [
//   { id: 1, title: 'Payment Received', message: 'Apollo Pharmacy - ₹2.5L', time: '5 min ago', unread: true },
//   { id: 2, title: 'Order Dispatched', message: 'ORD-2024-1456 shipped', time: '15 min ago', unread: true },
//   { id: 3, title: 'New PTP Created', message: 'MedPlus - ₹1.2L for Jan 20', time: '1 hour ago', unread: false },
// ];

// export function GlobalTopBar({ onToggleCopilot, isCopilotOpen }) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchOpen, setSearchOpen] = useState(false);
//   const { profile, signOut } = useAuth();

//   const getInitials = (name) => {
//     return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
//   };

//   const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
//   const unreadNotifications = notifications.filter(n => n.unread).length;

//   return (
//     <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card/95 backdrop-blur px-4 gap-4">
//       {/* Global Search */}
//       <div className="flex-1 max-w-xl">
//         <Popover open={searchOpen} onOpenChange={setSearchOpen}>
//           <PopoverTrigger asChild>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search customer, item, invoice, batch..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setSearchOpen(true)}
//                 className="pl-9 pr-20 bg-muted/50 border-border/50 focus:border-primary h-9"
//               />
//               <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
//                 <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
//                   ⌘K
//                 </kbd>
//               </div>
//             </div>
//           </PopoverTrigger>
//           <PopoverContent className="w-[500px] p-0" align="start">
//             <div className="p-3 border-b border-border">
//               <p className="text-xs text-muted-foreground">Search across all modules</p>
//             </div>
//             <div className="p-2">
//               <div className="space-y-1">
//                 <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
//                   <Users className="h-4 w-4 text-primary" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Apollo Pharmacy Mumbai</p>
//                     <p className="text-xs text-muted-foreground">Customer • Outstanding: ₹4.5L</p>
//                   </div>
//                 </button>
//                 <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
//                   <FileText className="h-4 w-4 text-info" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">INV-2024-1234</p>
//                     <p className="text-xs text-muted-foreground">Invoice • ₹25,000 • Apollo Pharmacy</p>
//                   </div>
//                 </button>
//                 <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
//                   <Package className="h-4 w-4 text-success" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Paracetamol 500mg</p>
//                     <p className="text-xs text-muted-foreground">Item • Stock: 5,000 units • Margin: 12%</p>
//                   </div>
//                 </button>
//               </div>
//             </div>
//             <div className="p-2 border-t border-border bg-muted/30">
//               <p className="text-xs text-muted-foreground text-center">Type to search or press <kbd className="px-1 py-0.5 rounded bg-muted border text-[10px]">Tab</kbd> to filter by type</p>
//             </div>
//           </PopoverContent>
//         </Popover>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-2">
//         {/* Date Range */}
//         <Button variant="outline" size="sm" className="hidden lg:flex gap-2 h-8 text-xs">
//           <Calendar className="h-3.5 w-3.5" />
//           <span>Today</span>
//           <ChevronDown className="h-3 w-3" />
//         </Button>

//         {/* Alerts */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="relative h-8 w-8">
//               <AlertTriangle className={cn("h-4 w-4", criticalAlerts > 0 ? "text-destructive" : "text-muted-foreground")} />
//               {criticalAlerts > 0 && (
//                 <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-destructive animate-pulse">
//                   {criticalAlerts}
//                 </Badge>
//               )}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-80">
//             <DropdownMenuLabel className="flex items-center justify-between">
//               <span>Active Alerts</span>
//               <Badge variant="destructive" className="text-[10px]">{alerts.length} alerts</Badge>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             {alerts.map((alert) => (
//               <DropdownMenuItem key={alert.id} className="flex items-start gap-3 p-3 cursor-pointer">
//                 <div className={cn(
//                   "h-2 w-2 rounded-full mt-1.5 shrink-0",
//                   alert.severity === 'critical' ? "bg-destructive animate-pulse" : "bg-warning"
//                 )} />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium truncate">{alert.title}</p>
//                   <p className="text-xs text-muted-foreground">{alert.message}</p>
//                 </div>
//               </DropdownMenuItem>
//             ))}
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="justify-center text-primary">
//               View all alerts
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* Notifications */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="relative h-8 w-8">
//               <Bell className="h-4 w-4 text-muted-foreground" />
//               {unreadNotifications > 0 && (
//                 <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary">
//                   {unreadNotifications}
//                 </Badge>
//               )}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-80">
//             <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             {notifications.map((notif) => (
//               <DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-3 cursor-pointer">
//                 {notif.unread && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
//                 {!notif.unread && <div className="h-2 w-2 shrink-0" />}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium">{notif.title}</p>
//                   <p className="text-xs text-muted-foreground">{notif.message}</p>
//                   <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
//                 </div>
//               </DropdownMenuItem>
//             ))}
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="justify-center text-primary">
//               View all notifications
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* AI Copilot Toggle */}
//         <Button
//           variant={isCopilotOpen ? "default" : "outline"}
//           size="sm"
//           onClick={onToggleCopilot}
//           className={cn(
//             "gap-2 h-8 text-xs",
//             isCopilotOpen && "bg-primary text-primary-foreground"
//           )}
//         >
//           <Bot className="h-3.5 w-3.5" />
//           <span className="hidden sm:inline">AI Copilot</span>
//         </Button>

//         {/* ERP Status */}
//         <div className="hidden xl:flex items-center gap-2 px-3 border-l border-border">
//           <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
//           <span className="text-[10px] text-muted-foreground">ERP Online</span>
//         </div>

//         {/* User Menu */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="sm" className="gap-2 h-8 ml-2">
//               <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
//                 <span className="text-[10px] font-semibold text-primary">
//                   {profile ? getInitials(profile.full_name) : 'U'}
//                 </span>
//               </div>
//               <ChevronDown className="h-3 w-3 text-muted-foreground" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-56">
//             <DropdownMenuLabel>
//               <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
//               <p className="text-xs text-muted-foreground">{profile?.email}</p>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Profile Settings</DropdownMenuItem>
//             <DropdownMenuItem>Preferences</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
//               Sign Out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// }



import { useState } from 'react';
import { 
  Search, Bell, AlertTriangle, Calendar, User, ChevronDown,
  Package, FileText, Users, Bot, MessageSquare, X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/Components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/ui/popover';
import { cn } from '@/lib/utils';

// Mock user data (replace with actual authentication logic)
const mockProfile = {
  full_name: 'John Doe',
  email: 'john.doe@example.com'
};

// Mock signOut function
const mockSignOut = () => {
  console.log('User signed out');
  // Add your actual sign out logic here
  // Example: 
  // localStorage.removeItem('token');
  // window.location.href = '/login';
};

export function GlobalTopBar({ onToggleCopilot, isCopilotOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Use mock profile instead of useAuth
  const profile = mockProfile;
  const signOut = mockSignOut;

  const alerts = [
    { id: 1, type: 'overdue', title: 'MedPlus Hyderabad', message: '₹8.5L overdue for 95 days', severity: 'critical' },
    { id: 2, type: 'sla', title: 'Ticket #T-2024-0892', message: 'SLA breach in 2 hours', severity: 'warning' },
    { id: 3, type: 'stock', title: 'Paracetamol 500mg', message: 'Below reorder level', severity: 'warning' },
    { id: 4, type: 'overdue', title: 'Netmeds Bangalore', message: 'Broken PTP commitment', severity: 'critical' },
  ];

  const notifications = [
    { id: 1, title: 'Payment Received', message: 'Apollo Pharmacy - ₹2.5L', time: '5 min ago', unread: true },
    { id: 2, title: 'Order Dispatched', message: 'ORD-2024-1456 shipped', time: '15 min ago', unread: true },
    { id: 3, title: 'New PTP Created', message: 'MedPlus - ₹1.2L for Jan 20', time: '1 hour ago', unread: false },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card/95 backdrop-blur px-4 gap-4">
      {/* Global Search */}
      <div className="flex-1 max-w-xl">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customer, item, invoice, batch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="pl-9 pr-20 bg-muted/50 border-border/50 focus:border-primary h-9"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] p-0" align="start">
            <div className="p-3 border-b border-border">
              <p className="text-xs text-muted-foreground">Search across all modules</p>
            </div>
            <div className="p-2">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
                  <Users className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Apollo Pharmacy Mumbai</p>
                    <p className="text-xs text-muted-foreground">Customer • Outstanding: ₹4.5L</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
                  <FileText className="h-4 w-4 text-info" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">INV-2024-1234</p>
                    <p className="text-xs text-muted-foreground">Invoice • ₹25,000 • Apollo Pharmacy</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
                  <Package className="h-4 w-4 text-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Paracetamol 500mg</p>
                    <p className="text-xs text-muted-foreground">Item • Stock: 5,000 units • Margin: 12%</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="p-2 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">Type to search or press <kbd className="px-1 py-0.5 rounded bg-muted border text-[10px]">Tab</kbd> to filter by type</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Date Range */}
        <Button variant="outline" size="sm" className="hidden lg:flex gap-2 h-8 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>Today</span>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {/* Alerts */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <AlertTriangle className={cn("h-4 w-4", criticalAlerts > 0 ? "text-destructive" : "text-muted-foreground")} />
              {criticalAlerts > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-destructive animate-pulse">
                  {criticalAlerts}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Active Alerts</span>
              <Badge variant="destructive" className="text-[10px]">{alerts.length} alerts</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.map((alert) => (
              <DropdownMenuItem key={alert.id} className="flex items-start gap-3 p-3 cursor-pointer">
                <div className={cn(
                  "h-2 w-2 rounded-full mt-1.5 shrink-0",
                  alert.severity === 'critical' ? "bg-destructive animate-pulse" : "bg-warning"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all alerts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Notifications */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-3 cursor-pointer">
                {notif.unread && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                {!notif.unread && <div className="h-2 w-2 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* AI Copilot Toggle */}
        <Button
          variant={isCopilotOpen ? "default" : "outline"}
          size="sm"
          onClick={onToggleCopilot}
          className={cn(
            "gap-2 h-8 text-xs",
            isCopilotOpen && "bg-primary text-primary-foreground"
          )}
        >
          <Bot className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI Copilot</span>
        </Button>

        {/* ERP Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 border-l border-border">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-muted-foreground">ERP Online</span>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 ml-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-primary">
                  {getInitials(profile.full_name)}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{profile.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}