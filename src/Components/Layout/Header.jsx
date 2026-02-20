// import React from 'react';
// import { Bell, Search, MessageSquare, HelpCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/contexts/AuthContext';

// export function Header({ title, subtitle, children }) {
//   const { profile, role } = useAuth();

//   return (
//     <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
//       <div>
//         <h1 className="text-xl font-semibold text-foreground">{title}</h1>
//         {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
//       </div>

//       <div className="flex items-center gap-4">
//         {children}
//         {/* Search */}
//         <div className="relative hidden md:block">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search customers, invoices..."
//             className="w-64 pl-9 bg-muted/50 border-border/50 focus:border-primary"
//           />
//         </div>

//         {/* Notifications */}
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-5 w-5 text-muted-foreground" />
//           <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive">
//             3
//           </Badge>
//         </Button>

//         {/* Messages */}
//         <Button variant="ghost" size="icon" className="relative">
//           <MessageSquare className="h-5 w-5 text-muted-foreground" />
//           <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary">
//             2
//           </Badge>
//         </Button>

//         {/* Help */}
//         <Button variant="ghost" size="icon">
//           <HelpCircle className="h-5 w-5 text-muted-foreground" />
//         </Button>

//         {/* Status Indicator */}
//         <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-border">
//           <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
//           <span className="text-xs text-muted-foreground">ERP Connected</span>
//         </div>
//       </div>
//     </header>
//   );
// }


import React from 'react';
import { Bell, Search, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';

const Header = ({ title, subtitle, children }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      
      {/* Left Section */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {children}

        {/* Search */}
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers, invoices..."
            className="w-64 pl-9 bg-muted/50 border-border/50 focus:border-primary"
          />
        </div> */}

        {/* Notifications */}
        {/* <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive">
            3
          </Badge>
        </Button> */}

        {/* Messages */}
        {/* <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary">
            2
          </Badge>
        </Button> */}

        {/* Help */}
        {/* <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button> */}

        {/* Status Indicator */}
        {/* <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-border">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">
            ERP Connected
          </span>
        </div> */}
      </div>
    </header>
  );
}
export default Header;