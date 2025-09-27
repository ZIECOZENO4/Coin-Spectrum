"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BannedPage from "./BannedPage";

interface BannedContextType {
  isBanned: boolean;
  isLoading: boolean;
}

const BannedContext = createContext<BannedContextType>({
  isBanned: false,
  isLoading: true,
});

export function BannedProvider({ children }: { children: React.ReactNode }) {
  const [isBanned, setIsBanned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBanStatus = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setIsLoading(false);
          return;
        }

        // Check if user is banned
        const userData = await db
          .select({ banned: users.banned })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        if (userData[0]?.banned) {
          setIsBanned(true);
        }
      } catch (error) {
        console.error("Error checking ban status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBanStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isBanned) {
    return <BannedPage />;
  }

  return (
    <BannedContext.Provider value={{ isBanned, isLoading }}>
      {children}
    </BannedContext.Provider>
  );
}

export function useBanned() {
  const context = useContext(BannedContext);
  if (context === undefined) {
    throw new Error("useBanned must be used within a BannedProvider");
  }
  return context;
}
