import React, { createContext, useContext, useEffect, useState } from "react";
import { UserInfo } from "@/types/user-type";
import { supabase } from "@/utils/supabase";
import { userService } from "@/services/user-service";
import { Session } from "@supabase/supabase-js";
type AuthContextType = {
  user: UserInfo | null;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUserProfile = async (user: any) => {
    try {
      let profile = await userService.getUserProfile(user.id);
      if (!profile) {
        profile = await userService.upsertUserProfile(user);
      }
      setUser(profile);
    } catch (error) {
      console.error("Error fetching user profile in context:", error);
    }
  };
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserData = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsLoading(false);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
