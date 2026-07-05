import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { validateSignupSchema, type signUpSchemaType } from '@/lib/SchemaTypes';
import { useMutation } from '@tanstack/react-query';
import { registerUserApi } from '@/api/auth';
import axios from 'axios';
import LoadingButton from '@/components/AuthButtons';
import { showToast } from '@/utils/CustomToast';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateSignupSchema),
  });

  // TanStack Query Mutation utilizing your standalone register API
  const mutation = useMutation({
    mutationFn: registerUserApi,
    onSuccess: (res, variables) => {
      showToast.success(res.data.message || "Registration Successful");
      // Seamlessly pass the registered email forward to your account verification route
      navigate(`/auth/verify-Account?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      if (axios.isAxiosError(error)) {
        showToast.error(error?.response?.data?.message || "Registration failed");
      } else {
        showToast.error("Registration failed");
      }
    },
  });

  // Triggers the direct browser redirection to your backend Google endpoint
  const handleGoogleAuth = () => {
    window.location.href = "https://agrokeep-backend.onrender.com/api/auth/google";
  };

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    /* 🌾 ANIMATION 1: Smooth Glide Up Page Entry */
    <div className="w-full max-w-md mx-auto space-y-5 animate-slideUp">
      
      {/* Header Section */}
      <div>
        <h2 className="text-[40px] font-bold text-stone-900 tracking-tight leading-none mb-3">
          Sign Up Here!
        </h2>
        <p className="text-stone-500 text-lg">
          Start your journey to optimal harvest management.
        </p>
      </div>

      {/* Form Section */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Full Name Field Wrapper */}
        {/* 🛑 ANIMATION 2: Input shakes conditionally if validation fails */}
        <div className={`relative ${errors.fullName ? 'animate-shake' : ''}`}>
          <input
            type="text"
            id="fullName"
            placeholder=" " /* Crucial blank space for peer placeholder tracking */
            {...register("fullName")}
            className={`peer w-full bg-white border px-6 pt-6 pb-2 rounded-3xl text-stone-800 placeholder-transparent focus:outline-none focus:ring-2 transition-all text-base ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:ring-emerald-800'
            }`}
          />
          {/* ✨ ANIMATION 3: Label shrinks and floats to top automatically on click/content entry */}
          <label 
            htmlFor="fullName"
            className="absolute left-6 top-4 text-stone-400 text-base pointer-events-none transition-all duration-200 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-emerald-800
            peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Full name<span className="text-red-500 ml-0.5">*</span>
          </label>
          {errors.fullName && (
            <p className="text-xs text-red-500 font-medium mt-1 pl-4">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Field Wrapper */}
        {/* 🛑 ANIMATION 2: Shakes on error */}
        <div className={`relative ${errors.email ? 'animate-shake' : ''}`}>
          <input
            type="email"
            id="email"
            placeholder=" "
            {...register("email")}
            className={`peer w-full bg-white border px-6 pt-6 pb-2 rounded-3xl text-stone-800 placeholder-transparent focus:outline-none focus:ring-2 transition-all text-base ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:ring-emerald-800'
            }`}
          />
          {/* ✨ ANIMATION 3: Email Floating Label */}
          <label 
            htmlFor="email"
            className="absolute left-6 top-4 text-stone-400 text-base pointer-events-none transition-all duration-200 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-emerald-800
            peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Email Address<span className="text-red-500 ml-0.5">*</span>
          </label>
          {errors.email && (
            <p className="text-xs text-red-500 font-medium mt-1 pl-4">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number Field Wrapper */}
        {/* 🛑 ANIMATION 2: Shakes on error */}
        <div className={`relative ${errors.phone ? 'animate-shake' : ''}`}>
          <input
            type="tel"
            id="phone"
            placeholder=" "
            {...register("phone")}
            className={`peer w-full bg-white border px-6 pt-6 pb-2 rounded-3xl text-stone-800 placeholder-transparent focus:outline-none focus:ring-2 transition-all text-base ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:ring-emerald-800'
            }`}
          />
          {/* ✨ ANIMATION 3: Phone Floating Label */}
          <label 
            htmlFor="phone"
            className="absolute left-6 top-4 text-stone-400 text-base pointer-events-none transition-all duration-200 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-emerald-800
            peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Phone Number<span className="text-red-500 ml-0.5">*</span>
          </label>
          {errors.phone && (
            <p className="text-xs text-red-500 font-medium mt-1 pl-4">{errors.phone.message}</p>
          )}
        </div>

        {/* Password Field Wrapper */}
        {/* 🛑 ANIMATION 2: Shakes on error */}
        <div className={`relative ${errors.password ? 'animate-shake' : ''}`}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder=" "
            {...register("password")}
            className={`peer w-full bg-white border px-6 pt-6 pb-2 rounded-3xl text-stone-800 placeholder-transparent focus:outline-none focus:ring-2 transition-all text-base pr-14 ${
              errors.password ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:ring-emerald-800'
            }`}
          />
          {/* ✨ ANIMATION 3: Password Floating Label */}
          <label 
            htmlFor="password"
            className="absolute left-6 top-4 text-stone-400 text-base pointer-events-none transition-all duration-200 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-emerald-800
            peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Password<span className="text-red-500 ml-0.5">*</span>
          </label>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-[26px] -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none z-10"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 10c2.5 4 6.5 6 9 6s6.5-2 9-6" strokeLinecap="round" />
              <path d="M12 16v2M8 15l-1 2M16 15l1 2M4.5 12.5L3 14M19.5 12.5L21 14" strokeLinecap="round" />
            </svg>
          </button>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium mt-1 pl-4">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field Wrapper */}
        {/* 🛑 ANIMATION 2: Shakes on error */}
        <div className={`relative ${errors.confirmPassword ? 'animate-shake' : ''}`}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            placeholder=" "
            {...register("confirmPassword")}
            className={`peer w-full bg-white border px-6 pt-6 pb-2 rounded-3xl text-stone-800 placeholder-transparent focus:outline-none focus:ring-2 transition-all text-base pr-14 ${
              errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:ring-emerald-800'
            }`}
          />
          {/* ✨ ANIMATION 3: Confirm Password Floating Label */}
          <label 
            htmlFor="confirmPassword"
            className="absolute left-6 top-4 text-stone-400 text-base pointer-events-none transition-all duration-200 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-emerald-800
            peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Confirm Password<span className="text-red-500 ml-0.5">*</span>
          </label>

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-5 top-[26px] -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none z-10"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 10c2.5 4 6.5 6 9 6s6.5-2 9-6" strokeLinecap="round" />
              <path d="M12 16v2M8 15l-1 2M16 15l1 2M4.5 12.5L3 14M19.5 12.5L21 14" strokeLinecap="round" />
            </svg>
          </button>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium mt-1 pl-4">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button Component */}
        <div className="pt-2">
          <LoadingButton 
            loading={mutation.isPending} 
            loadingText="Signing up..." 
            text="Sign Up"
          />
        </div>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-300"></div>
        </div>
        <span className="relative bg-[#FAF7F2] px-4 text-sm text-stone-400 font-medium">OR</span>
      </div>

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="flex w-full items-center justify-center gap-3 bg-white border border-stone-200 py-3.5 rounded-3xl font-medium text-stone-800 hover:bg-stone-50 transition-colors shadow-sm text-base"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

       <p className="text-center text-stone-800 text-base">
        Already a member?{' '}
         <Link to="/auth/login" className="text-blue-600 font-medium hover:underline ml-0.5">Login</Link>
      </p>

    </div>
  );
}