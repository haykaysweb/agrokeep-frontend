import { useContext, createContext } from "react";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  role: string;
  avatarUrl?: string | null;
  avatarPublicId?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticating: boolean;
  setIsAuthenticating: (value: boolean) => void;
  refetchUser: () => Promise<void>;
}

// Initial state matching the AuthContextType
export const AuthProviderContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticating: false,
  setIsAuthenticating: () => {},
  refetchUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
