import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router";
import { resetPasswordSchema } from "@/lib/SchemaTypes";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "@/api/auth";
import axios from "axios";
import { showToast } from "@/utils/CustomToast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Extract email string passed forward from the OTP verification stage parameters
  const email = searchParams.get("email") || "";

  // Prevent accessing this route directly without a valid context session email
  useEffect(() => {
    if (!email) {
      showToast.error(
        "Session expired. Please restart the forgot password process.",
      );
      navigate("/auth/forgot-password");
    }
  }, [email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  // TanStack Query Mutation linking your dynamic form fields to the resetPassword endpoint
  const mutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (res) => {
      // "Password reset successfully. You can now log in"
      showToast.success(res.data.message || "Password reset successfully!");
      navigate("/auth/login");
    },
    onError: (error) => {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      if (axios.isAxiosError(error)) {
        showToast.error(
          error?.response?.data?.message || "Failed to reset password.",
        );
      } else {
        showToast.error("An unexpected error occurred.");
      }
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      email,
      newPassword: data.password, // Maps React Hook Form field to backend schema parameters
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn">
      {/* Back to Login link */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="flex items-center gap-2 text-stone-800 hover:text-stone-600 font-medium text-base transition-colors group"
        >
          {/* Arrow Left SVG */}
          <svg
            className="h-5 w-5 transform transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Login
        </button>
      </div>

      {/* Header Title */}
      <div className="pt-2">
        <h2 className="text-[40px] font-bold text-stone-900 tracking-tight leading-tight">
          Enter New Password
        </h2>
      </div>

      {/* Form Section */}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* New Password Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-stone-800 mb-2">
            New Password<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              disabled={mutation.isPending}
              {...register("password")}
              className={`w-full bg-white border px-6 py-3.5 rounded-3xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 transition-all text-base pr-14 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-stone-200 focus:ring-emerald-800"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
            >
              {/* Custom Eyelash Visibility Icon */}
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M3 10c2.5 4 6.5 6 9 6s6.5-2 9-6"
                  strokeLinecap="round"
                />
                <path
                  d="M12 16v2M8 15l-1 2M16 15l1 2M4.5 12.5L3 14M19.5 12.5L21 14"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium mt-1.5 pl-3">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-stone-800 mb-2">
            Confirm New Password<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="***********"
              disabled={mutation.isPending}
              {...register("confirmPassword")}
              className={`w-full bg-white border px-6 py-3.5 rounded-3xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 transition-all text-base pr-14 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-stone-200 focus:ring-emerald-800"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
            >
              {/* Custom Eyelash Visibility Icon */}
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M3 10c2.5 4 6.5 6 9 6s6.5-2 9-6"
                  strokeLinecap="round"
                />
                <path
                  d="M12 16v2M8 15l-1 2M16 15l1 2M4.5 12.5L3 14M19.5 12.5L21 14"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium mt-1.5 pl-3">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Reset Password Button with Flat Amber Shadow Edge */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#1B4D3E] text-white py-4 rounded-3xl font-medium text-base transition-transform active:translate-y-0.5 active:shadow-none hover:bg-[#143b2f] shadow-[0px_4px_0px_0px_#D97706] disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Updating Password..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
