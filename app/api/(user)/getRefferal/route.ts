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


import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, investments, userReferrals, userInvestments } from "@/lib/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
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
    // First get all referrals for the user
    const referralResults = await db
      .select({
        referredUser: {
          id: users.id,
          firstName: users.firstName,
          email: users.email,
          createdAt: users.createdAt,
        },
      })
      .from(userReferrals)
      .leftJoin(users, eq(userReferrals.referredUserId, users.id))
      .where(eq(userReferrals.referrerId, session.user.id));

    // Get referred by information
    const referredByResult = await db
      .select({
        referrer: {
          id: users.id,
          firstName: users.firstName,
          userName: users.username,
          fullName: users.fullName,
          email: users.email,
          createdAt: users.createdAt,
        },
      })
      .from(userReferrals)
      .leftJoin(users, eq(userReferrals.referrerId, users.id))
      .where(eq(userReferrals.referredUserId, session.user.id))
      .limit(1);

    // Get investments for referred users
    const referredUserIds = referralResults
    .filter((r): r is { referredUser: NonNullable<typeof r.referredUser> } => 
      r.referredUser !== null
    )
    .map(r => r.referredUser.id);
  
    const investmentsMap = new Map<string, number>();
    
    if (referredUserIds.length > 0) {
      const investmentCounts = await db
        .select({
          userId: userInvestments.userId,
          count: sql<number>`count(*)`,
        })
        .from(userInvestments)
        .where(inArray(userInvestments.userId, referredUserIds))
        .groupBy(userInvestments.userId);

      investmentCounts.forEach(count => {
        investmentsMap.set(count.userId, Number(count.count));
      });
    }

    const referrals: ReferralData[] = referralResults
    .filter((result): result is { referredUser: NonNullable<typeof result.referredUser> } => 
      result.referredUser !== null
    )
    .map(({ referredUser }) => ({
      id: referredUser.id,
      name: referredUser.firstName ?? null,
      email: referredUser.email,
      referralDate: referredUser.createdAt,
      hasInvestment: (investmentsMap.get(referredUser.id) ?? 0) > 0,
    }));
  

    const referredBy: ReferredByData | null = referredByResult[0]?.referrer
      ? {
          id: referredByResult[0].referrer.id,
          name:
            referredByResult[0].referrer.firstName ||
            referredByResult[0].referrer.userName ||
            referredByResult[0].referrer.fullName ||
            null,
          email: referredByResult[0].referrer.email,
          referralDate: referredByResult[0].referrer.createdAt,
          hasInvestment: false,
        }
      : null;

    const referralLink = `${getBaseUrl()}?ref=${session.user.id}`;

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
