// import { useQueryClient } from "@tanstack/react-query";
import { getMeApi } from "@/api/auth";
import { AuthProviderContext } from "@/hooks/useAuth";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
// Reuse the User type from AuthProviderContext to avoid duplicate/conflicting 'User' definitions
type ContextType = React.ContextType<typeof AuthProviderContext>;
type User = ContextType extends { user: infer U } ? U : null;

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const hasToasted = useRef(false); // 👈 Track toast state to prevent double firing on re-renders
  // const queryClient = useQueryClient();

  // fetch user on app load using session cookie
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMeApi();
        if (res.status === 200) {
          setUser(res.data.data);
        }
      } catch {
        setUser(null);
      } finally {
        setIsAuthenticating(false);
      }
    }
    fetchUser();
  }, []);

  // 🔔 Triggers your custom successful toast notice when a user successfully signs in with Google
  useEffect(() => {
    if (user && !hasToasted.current) {
      toast.success(
        `Welcome back, ${user.fullName || "Logged in successfully!"}`,
      );
      hasToasted.current = true; // Locks the toast state for this application mount instance
    }
  }, [user]);

  //   const handleLogout = async () => {
  //     try {
  //       if (user?.email) {
  //         await logoutApi(user.email);
  //       }
  //       toast.success("Logout successful!");
  //     } catch {
  //       toast.error("Logout failed. Please try again.");
  //     } finally {
  //       setUser(null); // always clears user even if API fails
  //       hasToasted.current = false; // Reset toast monitor tracking state on sign out
  //     }
  //   };

  const refetchUser = async () => {
    try {
      const res = await getMeApi();
      if (res.status === 200) {
        setUser(res.data.data);
      }
    } catch {
      setUser(null);
    }
  };

  const contextValue = {
    user,
    setUser,
    isAuthenticating,
    setIsAuthenticating,
    refetchUser,
    // handleLogout,
  };

  return (
    <AuthProviderContext.Provider value={contextValue}>
      {children}
    </AuthProviderContext.Provider>
  );
}
