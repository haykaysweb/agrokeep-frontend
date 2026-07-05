import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { verifyOtpApi, resendVerifyOtpApi } from '@/api/auth';
import axios from 'axios';
import LoadingButton from '@/components/AuthButtons';
import { showToast } from '@/utils/CustomToast';

export default function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  // State to hold 6 individual digits
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [resendCountdown, setResendCountdown] = useState(30);
  const [shakeInputs, setShakeInputs] = useState(false); // 🛑 Manages shake trigger
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Simple countdown timer logic for resending the OTP
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Helper to trigger standard input error animation
  const triggerErrorShake = () => {
    setShakeInputs(true);
    setTimeout(() => setShakeInputs(false), 400); // Matches CSS shake duration
  };

  // Account Verification Mutation
  const verifyMutation = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (res) => {
      showToast.success(res.data.message || "Account verified successfully!");
      navigate('/auth/login'); 
    },
    onError: (error) => {
      triggerErrorShake(); // 🛑 Shake inputs if API rejects code
      if (axios.isAxiosError(error)) {
        showToast.error(error?.response?.data?.message || "Invalid or expired OTP code.");
      } else {
        showToast.error("Verification failed.");
      }
    },
  });

  // Resend OTP Mutation
  const resendMutation = useMutation({
    mutationFn: resendVerifyOtpApi,
    onSuccess: (res) => {
      showToast.success(res.data.message || "A fresh OTP code has been sent!");
      setResendCountdown(30); 
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast.error(error?.response?.data?.message || "Failed to send code. Try again.");
      }
    },
  });

  // Handles text entry & automatic focus movement forwards
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, ''); 
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); 
    setOtp(newOtp);

    // Focus the next box automatically
    if (index < 5 && element.value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handles backspacing & moving focus backwards
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      if (otp[index] === '') {
        if (index > 0) {
          newOtp[index - 1] = '';
          setOtp(newOtp);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Handles copying a full 6-digit code and pasting it straight into the array boxes
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').substring(0, 6);
    
    if (pastedData.length === 6) {
      const pastedOtp = pastedData.split('');
      setOtp(pastedOtp);
      inputRefs.current[5]?.focus(); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtpString = otp.join('');

    if (fullOtpString.length !== 6) {
      triggerErrorShake(); // 🛑 Shake inputs if incomplete
      showToast.error("Please enter all 6 digits of your verification code.");
      return;
    }

    verifyMutation.mutate({ email, otp: fullOtpString });
  };

  return (
    /* 🌾 ANIMATION 1: Smooth Glide Up Page Entry */
    <div className="w-full max-w-md mx-auto space-y-5 animate-slideUp">
      
      {/* Header Section */}
      <div>
        <h2 className="text-[40px] font-bold text-stone-900 tracking-tight leading-none mb-3">
          Verify Account
        </h2>
        <p className="text-stone-500 text-lg leading-relaxed">
          We sent a 6-digit secure code to <span className="font-semibold text-stone-800 break-all">{email || "your email"}</span>.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 6 Individual Spaced OTP Input Blocks */}
        {/* 🛑 ANIMATION 2: Entire row shakes if layout flags an error */}
        <div className={`flex justify-between gap-2 py-2 transition-transform ${shakeInputs ? 'animate-shake' : ''}`}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => { inputRefs.current[index] = el; }}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              /* ✨ ANIMATION 3: Box scales slightly and transitions borders dynamically on active focus */
              className={`w-12 h-14 bg-white border rounded-2xl text-center text-xl font-bold transition-all transform duration-150 focus:scale-105 focus:outline-none focus:ring-2 shadow-sm ${
                digit 
                  ? 'border-emerald-800 text-emerald-950 focus:ring-emerald-800' 
                  : 'border-stone-200 text-stone-800 focus:ring-emerald-800 focus:border-emerald-800'
              }`}
            />
          ))}
        </div>

        {/* Dynamic Resend Code Link Trigger */}
        <div className="text-center text-base text-stone-600">
          Didn't receive the code?{' '}
          {resendCountdown > 0 ? (
            <span className="text-stone-400 font-medium ml-1">
              Resend in {resendCountdown}s
            </span>
          ) : (
            <button
              type="button"
              disabled={resendMutation.isPending}
              onClick={() => resendMutation.mutate({ email })}
              className="text-emerald-800 font-semibold hover:underline focus:outline-none disabled:opacity-50 ml-1"
            >
              {resendMutation.isPending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <LoadingButton 
            loading={verifyMutation.isPending} 
            loadingText="Verifying account..." 
            text="Verify & Activate"
          />
        </div>
      </form>

      <p className="text-center text-stone-800 text-base">
        Want to try a different account?{' '}
        <Link to="/auth/register" className="text-blue-600 font-medium hover:underline ml-0.5">Sign Up</Link>
      </p>

    </div>
  );
}