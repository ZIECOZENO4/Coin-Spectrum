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
    console.log('🚀 Starting referral creation process...');
    console.log('📝 Referral ID:', ref);
    console.log('⏳ Current processing state:', isProcessing);
    
    // Check if already processing
    if (isProcessing) {
      console.log('⚠️ Already processing a referral, skipping...');
      return;
    }

    // Check if referral already exists in localStorage (prevent duplicate processing)
    const existingReferral = localStorage.getItem('processedReferral');
    if (existingReferral === ref) {
      console.log('⚠️ Referral already processed, skipping...');
      toast.info('ℹ️ Referral already processed', {
        duration: 2000,
      });
      return;
    }

    setIsProcessing(true);
    console.log('✅ Set processing state to true');
    
    // Step 1: Show initial processing toast
    console.log('🔔 Showing initial processing toast...');
    toast.info('🔗 Referral link detected! Processing...', {
      duration: 2000,
    });

    // Step 2: Show validation toast
    setTimeout(() => {
      console.log('🔔 Showing validation toast...');
      toast.info('✅ Validating referral code...', {
        duration: 2000,
      });
    }, 500);

    try {
      // Step 3: Show API call toast
      setTimeout(() => {
        console.log('🔔 Showing server connection toast...');
        toast.info('📡 Connecting to server...', {
          duration: 2000,
        });
      }, 1000);

      console.log('🌐 Making API call to /api/referrals...');
      console.log('📤 Request payload:', { referralId: ref });
      
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralId: ref }),
      });

      console.log('📥 API Response status:', response.status);
      console.log('📥 API Response ok:', response.ok);

      const data = await response.json();
      console.log('📥 API Response data:', data);

      if (!response.ok) {
        console.error('❌ API Error:', data.error || 'Failed to process referral');
        throw new Error(data.error || 'Failed to process referral');
      }

      // Step 4: Show success toast
      console.log('🎉 Referral processed successfully!');
      toast.success('🎉 Referral processed successfully! Welcome to Coin Spectrum!', {
        duration: 4000,
      });

      // Clean up and mark as processed
      console.log('🧹 Cleaning up localStorage and state...');
      localStorage.removeItem('ref');
      localStorage.setItem('processedReferral', ref); // Mark as processed
      setReferralId(null);
      console.log('✅ Cleanup completed and referral marked as processed');

    } catch (error) {
      console.error('💥 Error in referral creation:', error);
      
      // Step 5: Show error toast
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        toast.error(`❌ ${error.message}`, {
          duration: 4000,
        });
      } else {
        console.error('❌ Unknown error occurred');
        toast.error('❌ Failed to process referral. Please try again.', {
          duration: 4000,
        });
      }
      setReferralId(ref);
    } finally {
      console.log('🏁 Setting processing state to false');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    console.log('🔍 useEffect triggered - checking for referral...');
    console.log('🌐 Current URL:', typeof window !== 'undefined' ? window.location.href : 'N/A');
    console.log('⏳ Current processing state:', isProcessing);
    
    // Check for referral in URL first
    const urlRef = getReferralFromUrl();
    console.log('🔗 URL referral found:', urlRef);
    
    if (urlRef) {
      // Check if this referral was already processed
      const processedRef = localStorage.getItem('processedReferral');
      if (processedRef === urlRef) {
        console.log('⚠️ URL referral already processed, skipping...');
        // Still clean the URL
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('ref');
          window.history.replaceState({}, '', url.toString());
          console.log('🧹 Cleaned URL, new URL:', url.toString());
        }
        return;
      }
      
      console.log('✅ Referral detected in URL, processing...');
      toast.info('🔗 Referral link detected in URL!', {
        duration: 3000,
      });
      setReferralId(urlRef);
      localStorage.setItem('ref', urlRef);
      console.log('💾 Stored referral in localStorage:', urlRef);
      
      // Clean the URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('ref');
        window.history.replaceState({}, '', url.toString());
        console.log('🧹 Cleaned URL, new URL:', url.toString());
      }
      
      if (!isProcessing) {
        console.log('🚀 Starting referral creation from URL...');
        createReferral(urlRef);
      } else {
        console.log('⚠️ Already processing, skipping URL referral creation');
      }
      return;
    }

    // Check localStorage as fallback
    const storedRef = localStorage.getItem('ref');
    const processedRef = localStorage.getItem('processedReferral');
    console.log('💾 Stored referral from localStorage:', storedRef);
    console.log('✅ Processed referral from localStorage:', processedRef);
    
    if (storedRef) {
      // Check if this referral was already processed
      if (processedRef === storedRef) {
        console.log('⚠️ Referral already processed, skipping...');
        return;
      }
      
      console.log('✅ Referral detected in localStorage, processing...');
      toast.info('🔗 Referral link detected from storage!', {
        duration: 3000,
      });
      setReferralId(storedRef);
      if (!isProcessing) {
        console.log('🚀 Starting referral creation from localStorage...');
        createReferral(storedRef);
      } else {
        console.log('⚠️ Already processing, skipping localStorage referral creation');
      }
    } else {
      console.log('ℹ️ No referral found in URL or localStorage');
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
