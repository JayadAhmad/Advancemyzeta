// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';
// import { Loader2, LogIn } from 'lucide-react';

// const LoginForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { signIn } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const { error } = await signIn(email, password);

//     if (error) {
//       toast({
//         title: 'Sign in failed',
//         description: error.message,
//         variant: 'destructive',
//       });
//     } else {
//       toast({
//         title: 'Welcome back!',
//         description: 'You have been signed in successfully.',
//       });
//       navigate('/dashboard');
//     }

//     setIsLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="email" className="text-foreground/80">Email</Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="you@company.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="bg-input/50 border-border/50 focus:border-primary"
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="password" className="text-foreground/80">Password</Label>
//         <Input
//           id="password"
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
//           <LogIn className="mr-2 h-4 w-4" />
//         )}
//         Sign In
//       </Button>
//     </form>
//   );
// }

// export default LoginForm

import { useState,useEffect,useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import { Loader2, LogIn, Mail, Smartphone, Shield } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner'; 
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  console.log("LoginForm rendered");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [empId, setEmpId] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState(1); 
  const timerRef = useRef(null);
  
useEffect(() => {
  if (countdown <= 0) {
    clearInterval(timerRef.current);
    return;
  }

  timerRef.current = setInterval(() => {
    setCountdown(prev => prev - 1);
  }, 1000);

  return () => clearInterval(timerRef.current);
}, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    const trimmedId = empId.trim();
    console.log('Sending OTP for JECODE:', trimmedId);
    if (!trimmedId) {
      toast.error('Please enter your JECODE');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/send-otp', {
        code: trimmedId,
      });
      console.log("OTP send response:", response.data);
      
      if (response?.data) {
        toast.success('OTP sent successfully to your registered mobile number');
        setIsOtpSent(true);
        setStep(2);
        
        // Start countdown for 60 seconds
        setCountdown(120);
        // const timer = setInterval(() => {
        //   setCountdown((prev) => {
        //     if (prev <= 1) {
        //       clearInterval(timer);
        //       return 0;
        //     }
        //     return prev - 1;
        //   });
        // }, 1000);
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    console.log('Verifying OTP for JECODE:', empId, 'OTP:', otp);
    e.preventDefault();
    
    const trimmedId = empId.trim();
    const trimmedOtp = otp.trim();
    
    if (!trimmedId || !trimmedOtp) {
      toast.error('Please enter both JECODE and OTP');
      return;
    }

    if (trimmedOtp.length !== 4) {
      toast.error('OTP must be 4 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        code: trimmedId,
        otp: trimmedOtp,
      });
      console.log("OTP verify response:", response);
      if (response.data) {
        toast.success('Login successful!');
        // Handle successful login (store token, redirect, etc.)
        console.log('Login successful:', response.data);
        dispatch(loginSuccess({
          token: response.data.token,
          user: {
            name: response.data.name,
            role: response.data.role,
    },
        }))
        navigate('/sales');
        
        // Reset form
        setEmpId('');
        setOtp('');
        setIsOtpSent(false);
        setStep(1);
        clearInterval(timerRef.current);
        setCountdown(0);

      } else {
        toast.error(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    console.log('Resending OTP for JECODE:', empId);
    
    const trimmedId = empId.trim();
    if (!trimmedId) {
      toast.error('Please enter your JECODE');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/send-otp', {
        code: trimmedId,
      });
      console.log("OTP resend response:", response.data);
      if (response?.data) {
        toast.success('OTP resent successfully');
        setCountdown(120);
        
       
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setStep(1);
    setOtp('');
    setIsOtpSent(false);
    clearInterval(timerRef.current);
    setCountdown(0);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
          Secure Login
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your JECODE and OTP to access your account
        </p>
      </div>

      <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="jecode" className="text-sm font-medium text-foreground">
                  Employee ID
                </Label>
              </div>
              <Input
                id="jecode"
                type="text"
                placeholder="Enter JE PLUS ID "
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                required
                className="h-12 bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                autoComplete="username"
                autoFocus
              />
              {/* <p className="text-xs text-muted-foreground mt-1">
                Enter your registered JE PLUS employee ID
              </p> */}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading || !empId.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Send OTP
                </>
              )}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">JECODE Entered</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="text-xs h-8"
              >
                Change
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                    Verification OTP
                  </Label>
                </div>
                {countdown > 0 ? (
                  <span className="text-xs text-muted-foreground">
                    Resend in {countdown}s
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={handleResendOtp}
                    className="text-xs h-auto p-0"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                )}
              </div>
              
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtp(value.slice(0, 4));
                }}
                required
                className="h-12 text-center text-2xl tracking-widest bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                autoComplete="one-time-code"
                autoFocus
              />
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>OTP sent to your registered mobile number</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading || otp.length !== 4}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        )}
      </form>

     
    </div>
  );
};

export default LoginForm;