import { useContext, createContext } from "react";

interface User {
  _id: string;
  fullName: string; 
  email: string;
  phone: string;
  emailVerified: boolean;
  role: string;
 
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticating: boolean;
  setIsAuthenticating: (value: boolean) => void;
//   handleLogout: () => Promise<void>;
  refetchUser: () => Promise<void>; 
}

const initialState: AuthContextType = {
  user: null,
  setUser: () => null,
  isAuthenticating: false,
  setIsAuthenticating: () => null,
//   handleLogout: async () => {}, 
  refetchUser: async () => {}, 
};

// create the store
export const AuthProviderContext = createContext<AuthContextType>(initialState);

// hook to consume the values provided by the auth provider context
export const useAuth = () => {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    throw new Error("UseAuth must be used within an AuthProvider");
  }
  return context;
};