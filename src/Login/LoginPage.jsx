// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';

// import LoginForm from './LoginForm';
// import SignUpForm from './SignUpForm';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Activity, Shield, Zap, BarChart3 } from 'lucide-react';

// const LoginPage = () => {
//   const [activeTab, setActiveTab] = useState('login');
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && user) {
//       navigate('/dashboard');
//     }
//   }, [user, loading, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="animate-pulse text-primary">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-background">
//       {/* Left Panel - Branding */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
//         <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        
//         <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
//                 <Activity className="h-6 w-6 text-white" />
//               </div>
//               <span className="text-2xl font-bold text-white">JEPLUS</span>
//             </div>
//             <p className="text-white/80 text-sm">Healthcare Distribution</p>
//           </div>

//           <div className="space-y-8">
//             <div>
//               <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
//                 Operations<br />
//                 <span className="text-white/90">Command Center</span>
//               </h1>
//               <p className="text-white/80 text-lg max-w-md">
//                 One unified platform for Sales, Accounts, Dispatch, Claims, and Management. 
//                 Drive revenue, reduce overdue, eliminate silos.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
//                 <Shield className="h-5 w-5 text-white mb-2" />
//                 <h3 className="text-sm font-semibold text-white">Role-Based Access</h3>
//                 <p className="text-xs text-white/70">Secure, department-driven views</p>
//               </div>
//               <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
//                 <Zap className="h-5 w-5 text-white mb-2" />
//                 <h3 className="text-sm font-semibold text-white">AI-Powered</h3>
//                 <p className="text-xs text-white/70">Smart insights & automation</p>
//               </div>
//               <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
//                 <BarChart3 className="h-5 w-5 text-white mb-2" />
//                 <h3 className="text-sm font-semibold text-white">Real-time KPIs</h3>
//                 <p className="text-xs text-white/70">Track what matters</p>
//               </div>
//               <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
//                 <Activity className="h-5 w-5 text-white mb-2" />
//                 <h3 className="text-sm font-semibold text-white">ERP Connected</h3>
//                 <p className="text-xs text-white/70">Synced with SQL Server</p>
//               </div>
//             </div>
//           </div>

//           <p className="text-xs text-white/60">
//             © 2024 Jeplus Healthcare. Enterprise Operations Platform.
//           </p>
//         </div>
//       </div>

//       {/* Right Panel - Auth Forms */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           <div className="lg:hidden mb-8 text-center">
//             <div className="flex items-center justify-center gap-3 mb-2">
//               <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                 <Activity className="h-6 w-6 text-primary" />
//               </div>
//               <span className="text-2xl font-bold text-foreground">JEPLUS</span>
//             </div>
//             <p className="text-muted-foreground">Operations Command Center</p>
//           </div>

//           <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="grid w-full grid-cols-2 bg-muted/50 mb-6">
//                 <TabsTrigger 
//                   value="login" 
//                   className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//                 >
//                   Sign In
//                 </TabsTrigger>
//                 <TabsTrigger 
//                   value="signup"
//                   className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//                 >
//                   Register
//                 </TabsTrigger>
//               </TabsList>
//               <TabsContent value="login">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
//                   <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
//                 </div>
//                 <LoginForm />
//               </TabsContent>
//               <TabsContent value="signup">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-semibold text-foreground">Create account</h2>
//                   <p className="text-sm text-muted-foreground">Join the Operations OS platform</p>
//                 </div>
//                 <SignUpForm />
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;


import { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Shield, Zap, BarChart3 } from 'lucide-react';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">JEPLUS</span>
            </div>
            <p className="text-white/80 text-sm">Healthcare Distribution</p>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                Operations<br />
                <span className="text-white/90">Command Center</span>
              </h1>
              <p className="text-white/80 text-lg max-w-md">
                One unified platform for Sales, Accounts, Dispatch, Claims, and Management. 
                Drive revenue, reduce overdue, eliminate silos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                <Shield className="h-5 w-5 text-white mb-2" />
                <h3 className="text-sm font-semibold text-white">Role-Based Access</h3>
                <p className="text-xs text-white/70">Secure, department-driven views</p>
              </div>
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                <Zap className="h-5 w-5 text-white mb-2" />
                <h3 className="text-sm font-semibold text-white">AI-Powered</h3>
                <p className="text-xs text-white/70">Smart insights & automation</p>
              </div>
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                <BarChart3 className="h-5 w-5 text-white mb-2" />
                <h3 className="text-sm font-semibold text-white">Real-time KPIs</h3>
                <p className="text-xs text-white/70">Track what matters</p>
              </div>
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                <Activity className="h-5 w-5 text-white mb-2" />
                <h3 className="text-sm font-semibold text-white">ERP Connected</h3>
                <p className="text-xs text-white/70">Synced with SQL Server</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/60">
            © 2024 Jeplus Healthcare. Enterprise Operations Platform.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">JEPLUS</span>
            </div>
            <p className="text-muted-foreground">Operations Command Center</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
           
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;