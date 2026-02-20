
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useToast } from '@/hooks/use-toast';
// import { Loader2, UserPlus } from 'lucide-react';

// // Define DEPARTMENT_LABELS as a regular JavaScript object
// const DEPARTMENT_LABELS = {
//   sales: 'Sales',
//   accounts: 'Accounts',
//   dispatch: 'Dispatch',
//   claims: 'Claims',
//   management: 'Management',
//   admin: 'Administrator'
// };

// const SignUpForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [department, setDepartment] = useState('sales');
//   const [isLoading, setIsLoading] = useState(false);
//   const { signUp } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Password validation: minimum 8 characters with complexity requirements
//     const hasMinLength = password.length >= 8;
//     const hasUppercase = /[A-Z]/.test(password);
//     const hasLowercase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
    
//     if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
//       toast({
//         title: 'Weak password',
//         description: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
//         variant: 'destructive',
//       });
//       setIsLoading(false);
//       return;
//     }

//     const { error } = await signUp(email, password, fullName, department);

//     if (error) {
//       let message = error.message;
//       if (message.includes('already registered')) {
//         message = 'This email is already registered. Please sign in instead.';
//       }
//       toast({
//         title: 'Sign up failed',
//         description: message,
//         variant: 'destructive',
//       });
//     } else {
//       toast({
//         title: 'Account created!',
//         description: 'Welcome to Jeplus Operations OS.',
//       });
//       navigate('/dashboard');
//     }

//     setIsLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="fullName" className="text-foreground/80">Full Name</Label>
//         <Input
//           id="fullName"
//           type="text"
//           placeholder="John Doe"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           required
//           className="bg-input/50 border-border/50 focus:border-primary"
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="signupEmail" className="text-foreground/80">Email</Label>
//         <Input
//           id="signupEmail"
//           type="email"
//           placeholder="you@company.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="bg-input/50 border-border/50 focus:border-primary"
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="department" className="text-foreground/80">Department</Label>
//         <Select value={department} onValueChange={(value) => setDepartment(value)}>
//           <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary">
//             <SelectValue placeholder="Select department" />
//           </SelectTrigger>
//           <SelectContent>
//             {Object.entries(DEPARTMENT_LABELS).map(([key, label]) => (
//               <SelectItem key={key} value={key}>
//                 {label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="signupPassword" className="text-foreground/80">Password</Label>
//         <Input
//           id="signupPassword"
//           type="password"
//           placeholder="••••••••"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="bg-input/50 border-border/50 focus:border-primary"
//         />
//       </div>
//       <Button
//         type="submit"
//         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//         ) : (
//           <UserPlus className="mr-2 h-4 w-4" />
//         )}
//         Create Account
//       </Button>
//     </form>
//   );
// }


// export default SignUpForm



import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus } from 'lucide-react';

// Define DEPARTMENT_LABELS as a regular JavaScript object
const DEPARTMENT_LABELS = {
  sales: 'Sales',
  accounts: 'Accounts',
  dispatch: 'Dispatch',
  claims: 'Claims',
  management: 'Management',
  admin: 'Administrator'
};

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('sales');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Password validation: minimum 8 characters with complexity requirements
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      alert('Weak password! Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      console.log('Demo Sign Up Data:', { 
        email, 
        password, 
        fullName, 
        department,
        maskedPassword: '*'.repeat(password.length)
      });
      
      alert(`Demo Account Created!\n\nName: ${fullName}\nEmail: ${email}\nDepartment: ${department}\n\nThis is a demo. No actual account was created.`);
      
      // Reset form
      setEmail('');
      setPassword('');
      setFullName('');
      setDepartment('sales');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground/80">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="bg-input/50 border-border/50 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupEmail" className="text-foreground/80">Email</Label>
        <Input
          id="signupEmail"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-input/50 border-border/50 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department" className="text-foreground/80">Department</Label>
        <Select value={department} onValueChange={(value) => setDepartment(value)}>
          <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DEPARTMENT_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupPassword" className="text-foreground/80">Password</Label>
        <Input
          id="signupPassword"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-input/50 border-border/50 focus:border-primary"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        Create Account (Demo)
      </Button>
      
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Demo Mode:</strong> This is a demonstration. No actual account will be created.
          All password validation rules are still enforced for demonstration purposes.
        </p>
      </div>
    </form>
  );
}

export default SignUpForm;