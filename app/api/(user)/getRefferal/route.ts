// // API Route Handler
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db/prisma";

// import { getUserAuth } from "@/lib/auth/utils";
// import { getBaseUrl } from "@/lib/addBaseUrl";
// import {
//   UserWithReferralsAndReferredBy,
//   ReferralData,
//   ReferredByData,
//   ApiResponse,
// } from "./types";

// export async function GET(request: Request) {
//   const { session } = await getUserAuth();
//   if (!session) {
//     return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//   }

//   try {
//     const user: UserWithReferralsAndReferredBy | null =
//       await prisma.user.findUnique({
//         where: { id: session.user.id },
//         include: {
//           referredUsers: {
//             include: {
//               investments: {
//                 select: {
//                   id: true,
//                 },
//               },
//             },
//           },
//           referredBy: true,
//         },
//       });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const referrals: ReferralData[] = user.referredUsers.map((referral) => ({
//       id: referral.id,
//       name: referral.firstName,
//       email: referral.email,
//       referralDate: referral.createdAt,
//       hasInvestment: referral.investments.length > 0,
//     }));

//     const referredBy: ReferredByData | null = user.referredBy
//       ? {
//           id: user.referredBy.id,
//           name:
//             user.referredBy.firstName ||
//             user.referredBy.userName ||
//             user.referredBy.fullName ||
//             null,
//           email: user.referredBy.email,
//           referralDate: user.referredBy.createdAt,
//           hasInvestment: false, // Adjust this based on your requirements
//         }
//       : null;

//     const referralLink = `${getBaseUrl()}?ref=${user.id}`;

//     const response: ApiResponse = {
//       referrals,
//       referredBy,
//       referralLink,
//     };

//     return NextResponse.json(response, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching referral data:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


// API Route Handler
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, investments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { getBaseUrl } from "@/lib/addBaseUrl";
import {
  UserWithReferralsAndReferredBy,
  ReferralData,
  ReferredByData,
  ApiResponse,
} from "./types";

export async function GET(request: Request) {
  const { session } = await getUserAuth();
  if (!session) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        referredUsers: {
          with: {
            investments: true,
          },
        },
        referredBy: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const referrals: ReferralData[] = user.referredUsers.map((referral) => ({
      id: referral.id,
      name: referral.firstName,
      email: referral.email,
      referralDate: referral.createdAt,
      hasInvestment: referral.investments.length > 0,
    }));

    const referredBy: ReferredByData | null = user.referredBy
      ? {
          id: user.referredBy.id,
          name:
            user.referredBy.firstName ||
            user.referredBy.userName ||
            user.referredBy.fullName ||
            null,
          email: user.referredBy.email,
          referralDate: user.referredBy.createdAt,
          hasInvestment: false, // Adjust this based on your requirements
        }
      : null;

    const referralLink = `${getBaseUrl()}?ref=${user.id}`;

    const response: ApiResponse = {
      referrals,
      referredBy,
      referralLink,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching referral data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
