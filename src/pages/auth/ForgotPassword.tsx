import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { forgotPasswordApi } from '@/api/auth';
import axios from 'axios';
import { showToast } from '@/utils/CustomToast';
import { validateForgotPasswordSchema } from '@/lib/SchemaTypes'; 

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [shouldShake, setShouldShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 💡 State for error text

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 400); 
  };

  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (res) => {
      showToast.success(res.data.message || "A password reset OTP has been sent.");
      navigate(`/auth/verify-forgotpassword-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      triggerShake(); 
      if (axios.isAxiosError(error)) {
        setErrorMessage(error?.response?.data?.message || "Failed to process request."); // 💡 Display API error inline
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    
    if (!email.trim()) {
      triggerShake();
      setErrorMessage("Email Address is required.");
      return;
    }
    
    const validationResult = validateForgotPasswordSchema.safeParse({ email });

    if (!validationResult.success) {
      triggerShake(); 
      setErrorMessage(validationResult.error.issues[0]?.message || "Invalid email format.");
      return;
    }
    
    mutation.mutate(validationResult.data.email);
  };

  return (
    <div className="w-full max-w-md mb-40 mx-auto space-y-6 animate-fadeIn">
      <style>{`
        @keyframes customShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: customShake 0.4s ease-in-out; }
      `}</style>
      
      <div>
        <button type="button" onClick={() => navigate('/auth/login')} className="flex items-center gap-2 text-stone-800 hover:text-stone-600 font-medium text-base transition-colors group">
          <svg className="h-5 w-5 transform transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Login
        </button>
      </div>

      <div className="pt-2">
        <h2 className="text-[40px] font-bold text-stone-900 tracking-tight leading-tight mb-3">Forgot Password?</h2>
        <p className="text-stone-600 text-lg leading-relaxed max-w-[90%]">Enter the email associated with your account we’ll send you a link to reset your password</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-sm font-medium text-stone-800 mb-2">
            Email Address<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrorMessage(null); }} // 💡 Clear error on change
            placeholder="you@example.com"
            className={`w-full bg-white border px-6 py-4 rounded-3xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 transition-all text-base ${
              shouldShake ? 'animate-shake !border-red-500 ring-2 ring-red-500/20' : 'border-stone-200'
            }`}
            disabled={mutation.isPending}
          />
          {/* 💡 Inline Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mt-2 ml-1">{errorMessage}</p>}
        </div>

        <div className="pt-2">
          <button type="submit" disabled={mutation.isPending} className="w-full bg-[#1B4D3E] text-white py-4 rounded-3xl font-medium text-base transition-transform active:translate-y-0.5 active:shadow-none hover:bg-[#143b2f] shadow-[0px_4px_0px_0px_#D97706]">
            {mutation.isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </form>
    </div>
  );
}