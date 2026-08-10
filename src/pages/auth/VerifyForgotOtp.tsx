import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { verifyForgotOtpApi, resendForgotOtpApi } from "@/api/auth";
import axios from "axios";
import { showToast } from "@/utils/CustomToast";
import { validateVerifyOtpSchema } from "@/lib/SchemaTypes";

export default function VerifyForgotOtp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState("");
  const [shouldShake, setShouldShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      showToast.error("Invalid session. Please request a new code.");
      navigate("/auth/forgot-password");
    }
  }, [email, navigate]);

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 400);
  };

  const verifyMutation = useMutation({
    mutationFn: verifyForgotOtpApi,
    onSuccess: (res) => {
      showToast.success(res.data.message || "OTP Verified Successfully!");
      navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      triggerShake();

      if (axios.isAxiosError(error)) {
<<<<<<< HEAD
        const backendError = error.response?.data;

=======
        console.log("SERVER VALIDATION ERROR DATA:", error.response?.data);

        const backendError = error.response?.data;
>>>>>>> 52ca6ad16b46038b004b866c418ecb9041685517
        const serverMessage = Array.isArray(backendError?.message)
          ? backendError.message.join(", ")
          : backendError?.message ||
            backendError?.error ||
            "Validation failed.";

        setErrorMessage(serverMessage);
      } else {
<<<<<<< HEAD
=======
        if (import.meta.env.DEV) {
          console.error(error);
        }
>>>>>>> 52ca6ad16b46038b004b866c418ecb9041685517
        setErrorMessage("An unexpected error occurred.");
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendForgotOtpApi,
    onSuccess: (res) => {
      showToast.success(res.data.message || "A fresh OTP has been dispatched!");
    },
    onError: (error) => {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error?.response?.data?.message || "Failed to resend OTP code.",
        );
        error;
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); //  Clear previous error on submit

    // Manual extra guard
    if (!otp.trim() || otp.length < 6) {
      triggerShake();
      setErrorMessage("Please enter the full 6-digit code.");
      return;
    }

    const validationResult = validateVerifyOtpSchema.safeParse({ email, otp });

    if (!validationResult.success) {
      triggerShake();
      setErrorMessage(
        validationResult.error.issues[0]?.message || "Invalid input details.",
      );
      return;
    }

    verifyMutation.mutate(validationResult.data);
  };

  const handleResendClick = () => {
    if (resendMutation.isPending) return;
    resendMutation.mutate(email);
  };

  return (
    <div className="w-full max-w-md mb-40 mx-auto space-y-6 animate-fadeIn">
      <style>{`
        @keyframes customShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: customShake 0.4s ease-in-out;
        }
      `}</style>

      <div>
        <button
          type="button"
          onClick={() => navigate("/auth/forgot-password")}
          className="flex items-center gap-2 text-stone-800 hover:text-stone-600 font-medium text-base transition-colors group"
        >
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
          Back
        </button>
      </div>

      <div className="pt-2">
        <h2 className="text-[40px] font-bold text-stone-900 tracking-tight leading-tight mb-3">
          Verify OTP
        </h2>
        <p className="text-stone-600 text-lg leading-relaxed">
          Enter the verification code sent to{" "}
          <span className="font-semibold text-stone-900 break-all">
            {email}
          </span>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-sm font-medium text-stone-800 mb-2">
            Secure OTP Code<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setErrorMessage(null); //Clear error when user types
            }}
            placeholder="Enter 6-digit code"
            className={`w-full bg-white border px-6 py-4 rounded-3xl text-stone-800 tracking-[0.2em] font-mono text-center placeholder-stone-400 placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-emerald-800 transition-all text-xl font-bold ${
              shouldShake
                ? "animate-shake !border-red-500 ring-2 ring-red-500/20"
                : "border-stone-200"
            }`}
            disabled={verifyMutation.isPending}
          />
          {/* Inline Error Message Display */}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2 ml-1">{errorMessage}</p>
          )}
        </div>

        <div className="flex justify-center text-sm">
          <p className="text-stone-500">
            Didn't get the secure code?{" "}
            <button
              type="button"
              onClick={handleResendClick}
              disabled={resendMutation.isPending}
              className="text-emerald-800 font-semibold hover:underline focus:outline-none disabled:opacity-50 disabled:no-underline ml-0.5"
            >
              {resendMutation.isPending ? "Sending code..." : "Resend Code"}
            </button>
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full bg-[#1B4D3E] text-white py-4 rounded-3xl font-medium text-base transition-transform active:translate-y-0.5 active:shadow-none hover:bg-[#143b2f] shadow-[0px_4px_0px_0px_#D97706] disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {verifyMutation.isPending ? "Verifying Code..." : "Verify Code"}
          </button>
        </div>
      </form>
    </div>
  );
}
