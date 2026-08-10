import React, { useEffect, useState } from "react";
import { AuthProviderContext, type User } from "@/hooks/useAuth";
import apiClient from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/user/me");
        return res?.data?.data || null;
      } catch (error) {
        return null;
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  const [user, setUserState] = useState<User | null>(null);

  // Sync Query data with Local State
  useEffect(() => {
    if (data) {
      setUserState(data);
    } else {
      setUserState(null);
    }
  }, [data]);

  const handleSetUser = (user: User | null) => {
    setUserState(user);
  };

  return (
    <AuthProviderContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        isAuthenticating: isLoading,
        setIsAuthenticating: () => {}, // Handled by useQuery
        refetchUser: async () => {
          await refetch();
        },
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}
