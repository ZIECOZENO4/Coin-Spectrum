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
  isLoading: false,
});

export function BannedProvider({ children }: { children: React.ReactNode }) {
  const [isBanned, setIsBanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkBanStatus = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          return;
        }

        // Use a more efficient API call instead of direct database access
        const response = await fetch('/api/user/ban-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.banned) {
            setIsBanned(true);
          }
        }
      } catch (error) {
        console.error("Error checking ban status:", error);
      }
    };

    // Run ban check in background without blocking the UI
    checkBanStatus();
  }, []);

  // If user is banned, show banned page
  if (isBanned) {
    return <BannedPage />;
  }

  // Always render children while checking ban status in background
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
