// types.ts
import { User, Investment } from "@prisma/client";

export type UserWithReferralsAndReferredBy = User & {
  referredUsers: (User & {
    investments: {
      id: string;
    }[];
  })[];
  referredBy: User | null;
};

export type ReferralData = {
  id: string;
  name: string | null;
  email: string;
  referralDate: Date;
  hasInvestment: boolean;
};

export type ReferredByData = {
  id: string;
  name: string | null;
  email: string;
  referralDate: Date;
  hasInvestment: boolean;
};

export type ApiResponse = {
  referrals: ReferralData[];
  referredBy: ReferredByData | null;
  referralLink: string;
};
