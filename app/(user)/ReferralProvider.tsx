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

  const createReferral = async (ref: string) => {
    setIsProcessing(true);
    toast.info('Processing your referral...', {
      duration: 2000,
    });

    try {
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

      localStorage.removeItem('ref');
      setReferralId(null);
      toast.success('Referral processed successfully', {
        duration: 3000,
      });

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          duration: 4000,
        });
      } else {
        toast.error('Failed to process referral', {
          duration: 4000,
        });
      }
      setReferralId(ref);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const ref = localStorage.getItem('ref');
    if (ref) {
      toast.info('Referral link detected!', {
        duration: 3000,
      });
      setReferralId(ref);
      if (!isProcessing) {
        createReferral(ref);
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
