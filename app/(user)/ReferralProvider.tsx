'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ReferralContextType {
  referralId: string | null;
  setReferralId: (id: string | null) => void;
  isProcessing: boolean;
}

const ReferralContext = createContext<ReferralContextType>({
  referralId: null,
  setReferralId: () => {},
  isProcessing: false,
});

export function ReferralProvider({ children }: { children: React.ReactNode }) {
  const [referralId, setReferralId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to extract referral ID from URL
  const getReferralFromUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      return ref;
    }
    return null;
  };

  const createReferral = async (ref: string) => {
    setIsProcessing(true);
    
    // Step 1: Show initial processing toast
    toast.info('🔗 Referral link detected! Processing...', {
      duration: 2000,
    });

    // Step 2: Show validation toast
    setTimeout(() => {
      toast.info('✅ Validating referral code...', {
        duration: 2000,
      });
    }, 500);

    try {
      // Step 3: Show API call toast
      setTimeout(() => {
        toast.info('📡 Connecting to server...', {
          duration: 2000,
        });
      }, 1000);

      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralId: ref }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process referral');
      }

      // Step 4: Show success toast
      toast.success('🎉 Referral processed successfully! Welcome to Coin Spectrum!', {
        duration: 4000,
      });

      // Clean up
      localStorage.removeItem('ref');
      setReferralId(null);

    } catch (error) {
      // Step 5: Show error toast
      if (error instanceof Error) {
        toast.error(`❌ ${error.message}`, {
          duration: 4000,
        });
      } else {
        toast.error('❌ Failed to process referral. Please try again.', {
          duration: 4000,
        });
      }
      setReferralId(ref);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Check for referral in URL first
    const urlRef = getReferralFromUrl();
    if (urlRef) {
      toast.info('🔗 Referral link detected in URL!', {
        duration: 3000,
      });
      setReferralId(urlRef);
      localStorage.setItem('ref', urlRef);
      
      // Clean the URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('ref');
        window.history.replaceState({}, '', url.toString());
      }
      
      if (!isProcessing) {
        createReferral(urlRef);
      }
      return;
    }

    // Check localStorage as fallback
    const storedRef = localStorage.getItem('ref');
    if (storedRef) {
      toast.info('🔗 Referral link detected from storage!', {
        duration: 3000,
      });
      setReferralId(storedRef);
      if (!isProcessing) {
        createReferral(storedRef);
      }
    }
  }, []);

  return (
    <ReferralContext.Provider value={{ referralId, setReferralId, isProcessing }}>
      {children}
    </ReferralContext.Provider>
  );
}

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};
