

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import KYCForm from './kyc-form';

export default function KycPage() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => setAccepted(false), 10000); 
  };

  return (
    <div className=" ">
      <KYCForm />
    </div>
  );
}
