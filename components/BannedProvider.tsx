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
      console.log("🔍 BannedProvider: Starting ban status check...");
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.log("❌ BannedProvider: No authenticated user found:", error?.message || "No user");
          return;
        }

        console.log("👤 BannedProvider: User authenticated:", user.id);

        // Use a more efficient API call instead of direct database access
        console.log("🌐 BannedProvider: Making API call to /api/user/ban-status");
        const response = await fetch('/api/user/ban-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("📡 BannedProvider: API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("📊 BannedProvider: Ban status data:", data);
          
          if (data.banned) {
            console.log("🚫 BannedProvider: User is BANNED - redirecting to banned page");
            setIsBanned(true);
          } else {
            console.log("✅ BannedProvider: User is NOT banned - allowing access");
          }
        } else {
          console.error("❌ BannedProvider: API call failed with status:", response.status);
        }
      } catch (error) {
        console.error("💥 BannedProvider: Error checking ban status:", error);
      }
    };

    // Run ban check in background without blocking the UI
    console.log("🚀 BannedProvider: Starting background ban check...");
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
