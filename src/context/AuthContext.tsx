import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { logoutUserApi } from "@/api/auth";
import { AuthProviderContext, type User } from "@/hooks/useAuth";
import apiClient from "@/api/apiClient";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user = null,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/user/me");
        return res?.data?.data || null;
      } catch {
        return null;
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  const handleSetUser = (newUser: User | null) => {
    queryClient.setQueryData(["currentUser"], newUser);
  };

  const handleLogout = async () => {
    try {
      await logoutUserApi(); // Calls your API function
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
    }
  };

  return (
    <AuthProviderContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        isAuthenticating: isLoading,
        setIsAuthenticating: () => {},
        refetchUser: async () => {
          await refetch();
        },
        handleLogout,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}
