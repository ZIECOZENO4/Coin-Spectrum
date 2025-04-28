'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import KYCForm from './kyc-form';
import KYCApproved from './kyc-approved';
import KYCPending from './kyc-pending';
import { Loader2 } from 'lucide-react';

interface KYCStatus {
  status: 'pending' | 'approved' | 'rejected' | null;
  notes?: string;
  submissionDate?: string;
}

export default function KycPage() {
  const { data: kycStatus, isLoading } = useQuery<KYCStatus>({
    queryKey: ['kyc-status'],
    queryFn: async () => {
      const response = await fetch('/api/kyc/status');
      if (!response.ok) throw new Error('Failed to fetch KYC status');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (kycStatus?.status === 'approved') {
    return <KYCApproved />;
  }

  if (kycStatus?.status === 'pending' && kycStatus?.submissionDate) {
    return <KYCPending submissionDate={kycStatus.submissionDate} />;
  }

  return <KYCForm />;
}
