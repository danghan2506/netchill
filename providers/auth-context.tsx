import React, { createContext, useContext, useMemo } from "react";
import { useAuth as useClerkAuth, useUser as useClerkUser } from "@clerk/expo";
import type { AppUser } from "@/interfaces/user";

type AuthContextType = {
  user: AppUser | null;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded: authLoaded, signOut, userId } = useClerkAuth();
  const { isLoaded: userLoaded, user: clerkUser } = useClerkUser();

  const user: AppUser | null = useMemo(() => {
    if (!clerkUser || !userId) return null;
    return {
      id: userId,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      name: clerkUser.fullName ?? clerkUser.firstName ?? "",
      imageUrl: clerkUser.imageUrl ?? "",
    };
  }, [clerkUser, userId]);

  const isLoading = !(authLoaded && userLoaded);

  const refreshUserData = async () => {
    if (clerkUser) {
      await clerkUser.reload();
    }
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
