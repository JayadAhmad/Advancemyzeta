// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { useAuth } from '@/contexts/AuthContext';
// import {
//   Activity,
//   LayoutDashboard,
//   Users,
//   DollarSign,
//   Truck,
//   AlertTriangle,
//   ShoppingCart,
//   BarChart3,
//   Settings,
//   ClipboardList,
//   Package,
//   Building2,
//   Shield,
//   ChevronRight,
//   Phone,
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from '@/components/ui/collapsible';

// const navGroups = [
//   {
//     label: 'COMMAND CENTER',
//     items: [
//       { label: 'Control Tower', icon: Building2, href: '/control-tower' },
//     ],
//   },
//   {
//     label: 'WORKSPACES',
//     items: [
//       { label: 'Sales', icon: Phone, href: '/sales', departments: ['sales', 'management', 'admin'], badge: '8' },
//       { label: 'Accounts', icon: DollarSign, href: '/accounts', departments: ['accounts', 'management', 'admin'], badge: '12', badgeVariant: 'destructive' },
//       { label: 'Dispatch', icon: Truck, href: '/dispatch', departments: ['dispatch', 'management', 'admin'], badge: '5', badgeVariant: 'warning' },
//       { label: 'Claims / RMA', icon: AlertTriangle, href: '/claims', departments: ['claims', 'management', 'admin'], badge: '3', badgeVariant: 'destructive' },
//       { label: 'Purchase', icon: ShoppingCart, href: '/purchase', departments: ['purchase', 'management', 'admin'] },
//     ],
//   },
//   {
//     label: 'MASTER DATA',
//     items: [
//       { label: 'Customers', icon: Users, href: '/customers' },
//       { label: 'Items', icon: Package, href: '/items' },
//     ],
//   },
//   {
//     label: 'OPERATIONS',
//     items: [
//       { label: 'Tasks & SLAs', icon: ClipboardList, href: '/tasks', badge: '15' },
//       { label: 'Analytics', icon: BarChart3, href: '/analytics', departments: ['management', 'admin'] },
//       { label: 'Admin', icon: Shield, href: '/admin', departments: ['admin'] },
//     ],
//   },
// ];

// export function AppSidebar() {
//   const location = useLocation();
// //   const { profile, role } = useAuth();
//   console.log('User Profile-------------:', profile);
//   console.log('User Role-------------:', role);
//   const [expandedGroups, setExpandedGroups] = useState(['COMMAND CENTER', 'WORKSPACES', 'MASTER DATA', 'OPERATIONS']);

//   const userDepartment = profile?.department || 'sales';

//   const toggleGroup = (label) => {
//     setExpandedGroups(prev => 
//       prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
//     );
//   };

//   const filterItems = (items) => {
//     return items.filter((item) => {
//       if (!item.departments) return true;
//       if (role === 'admin') return true;
//       return item.departments.includes(userDepartment);
//     });
//   };

//   return (
//     <div className="flex h-screen w-60 flex-col bg-sidebar border-r border-sidebar-border">
//       {/* Logo */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
//         <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
//           <Activity className="h-4 w-4 text-primary" />
//         </div>
//         <div>
//           <span className="text-base font-bold text-sidebar-foreground">JEPLUS</span>
//           <p className="text-[9px] text-sidebar-foreground/60 uppercase tracking-wider">Operations OS</p>
//         </div>
//       </div>

//       {/* Navigation */}
//       <ScrollArea className="flex-1 py-2">
//         <nav className="px-2 space-y-4">
//           {navGroups.map((group) => {
//             const filteredItems = filterItems(group.items);
//             if (filteredItems.length === 0) return null;

//             const isExpanded = expandedGroups.includes(group.label);

//             return (
//               <Collapsible key={group.label} open={isExpanded} onOpenChange={() => toggleGroup(group.label)}>
//                 <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider hover:text-sidebar-foreground/70 transition-colors">
//                   {group.label}
//                   <ChevronRight className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")} />
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <div className="mt-1 space-y-0.5">
//                     {filteredItems.map((item) => {
//                       const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
//                       const Icon = item.icon;

//                       return (
//                         <Link
//                           key={item.href}
//                           to={item.href}
//                           className={cn(
//                             'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-all',
//                             isActive
//                               ? 'bg-sidebar-primary/15 text-sidebar-primary'
//                               : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
//                           )}
//                         >
//                           <Icon className={cn('h-4 w-4', isActive && 'text-sidebar-primary')} />
//                           <span className="flex-1 truncate">{item.label}</span>
//                           {item.badge && (
//                             <Badge
//                               variant={item.badgeVariant === 'destructive' ? 'destructive' : 'secondary'}
//                               className={cn(
//                                 'h-5 min-w-[20px] px-1.5 text-[10px] font-bold',
//                                 item.badgeVariant === 'warning' && 'bg-warning text-warning-foreground',
//                                 !item.badgeVariant && 'bg-sidebar-accent text-sidebar-foreground'
//                               )}
//                             >
//                               {item.badge}
//                             </Badge>
//                           )}
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>
//             );
//           })}
//         </nav>
//       </ScrollArea>

//       {/* Bottom Section */}
//       <div className="border-t border-sidebar-border p-2">
//         <Link
//           to="/settings"
//           className={cn(
//             "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-all",
//             location.pathname === '/settings'
//               ? 'bg-sidebar-primary/15 text-sidebar-primary'
//               : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
//           )}
//         >
//           <Settings className="h-4 w-4" />
//           Settings
//         </Link>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

import {
  Activity,
  Users,
  DollarSign,
  Truck,
  AlertTriangle,
  ShoppingCart,
  BarChart3,
  Settings,
  ClipboardList,
  Package,
  Building2,
  Shield,
  ChevronRight,
  Phone,
} from 'lucide-react';

import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/Components/ui/collapsible';

const navGroups = [
  {
    label: 'COMMAND CENTER',
    items: [
      { label: 'Control Tower', icon: Building2, href: '/control-tower' },
    ],
  },
  {
    label: 'WORKSPACES',
    items: [
      { label: 'Sales', icon: Phone, href: '/sales', departments: ['sales', 'management', 'admin'], badge: '8' },
      { label: 'Accounts', icon: DollarSign, href: '/accounts', departments: ['accounts', 'management', 'admin'], badge: '12', badgeVariant: 'destructive' },
      { label: 'Dispatch', icon: Truck, href: '/dispatch', departments: ['dispatch', 'management', 'admin'], badge: '5', badgeVariant: 'warning' },
      { label: 'Claims / RMA', icon: AlertTriangle, href: '/claims', departments: ['claims', 'management', 'admin'], badge: '3', badgeVariant: 'destructive' },
      { label: 'Purchase', icon: ShoppingCart, href: '/purchase', departments: ['purchase', 'management', 'admin'] },
    ],
  },
  {
    label: 'MASTER DATA',
    items: [
      { label: 'Customers', icon: Users, href: '/customers' },
      { label: 'Items', icon: Package, href: '/items' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Tasks & SLAs', icon: ClipboardList, href: '/tasks', badge: '15' },
      { label: 'Analytics', icon: BarChart3, href: '/analytics', departments: ['management', 'admin'] },
      { label: 'Admin', icon: Shield, href: '/admin', departments: ['admin'] },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

  // 🔹 TEMP / SIMPLE AUTH DATA
  const role = 'sales';          // 'admin' | 'management' | 'sales'
  const userDepartment = 'sales';

  const [expandedGroups, setExpandedGroups] = useState([
    'COMMAND CENTER',
    'WORKSPACES',
    'MASTER DATA',
    'OPERATIONS',
  ]);

  const toggleGroup = (label) => {
    setExpandedGroups((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : [...prev, label]
    );
  };

  const filterItems = (items) => {
    return items.filter((item) => {
      if (!item.departments) return true;
      if (role === 'admin') return true;
      return item.departments.includes(userDepartment);
    });
  };

  return (
    <div className="flex h-screen w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <div>
          <span className="text-base font-bold text-sidebar-foreground">
            JEPLUS
          </span>
          <p className="text-[9px] text-sidebar-foreground/60 uppercase tracking-wider">
            Operations OS
          </p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="px-2 space-y-4">
          {navGroups.map((group) => {
            const filteredItems = filterItems(group.items);
            if (filteredItems.length === 0) return null;

            const isExpanded = expandedGroups.includes(group.label);

            return (
              <Collapsible
                key={group.label}
                open={isExpanded}
                onOpenChange={() => toggleGroup(group.label)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  {group.label}
                  <ChevronRight
                    className={cn(
                      'h-3 w-3 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-1 space-y-0.5">
                    {filteredItems.map((item) => {
                      const isActive =
                        location.pathname === item.href ||
                        location.pathname.startsWith(item.href + '/');

                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium',
                            isActive
                              ? 'bg-sidebar-primary/15 text-sidebar-primary'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.label}</span>

                          {item.badge && (
                            <Badge className="h-5 min-w-[20px] px-1.5 text-[10px]">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2">
        <Link
          to="/settings"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}