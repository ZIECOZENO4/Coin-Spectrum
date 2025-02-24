// // app/api/admin/traders/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { traders, users } from "@/lib/db/schema";
// import { getUserAuth } from "@/lib/auth/utils";
// import { eq } from "drizzle-orm";

// export async function POST(req: NextRequest) {
//   try {
//     console.log("Starting trader creation process...");
    
//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       console.error("User not authenticated");
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Verify admin role
//     const user = await db.query.users.findFirst({
//       where: eq(users.id, session.user.id)
//     });

//     if (user?.role !== "admin") {
//       console.error("Non-admin user attempted to create trader:", session.user.id);
//       return NextResponse.json(
//         { error: "Admin access required" },
//         { status: 403 }
//       );
//     }

//     const body = await req.json();
//     console.log("Request body:", body);

//     // Validate required fields
//     const {
//       name,
//       imageUrl,
//       followers,
//       minCapital,
//       percentageProfit,
//       totalProfit,
//       rating,
//       isPro = false
//     } = body;

//     if (!name || !imageUrl || !minCapital || !percentageProfit) {
//       console.error("Missing required fields");
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     console.log("Creating trader record...");
//     const trader = await db.transaction(async (tx) => {
//       const [newTrader] = await tx.insert(traders).values({
//         id: `trader_${Date.now()}`,
//         name,
//         imageUrl,
//         followers: followers || 0,
//         minCapital,
//         percentageProfit,
//         totalProfit: totalProfit || 0,
//         rating: rating || 5,
//         isPro,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }).returning();

//       return newTrader;
//     });

//     console.log("Trader created successfully:", trader);

//     return NextResponse.json({
//       success: true,
//       message: "Trader created successfully",
//       trader
//     });

//   } catch (error) {
//     console.error("Failed to create trader:", error);
//     return NextResponse.json(
//       { error: "Failed to create trader" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     console.log("Fetching traders...");
    
//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const allTraders = await db
//       .select()
//       .from(traders)
//       .orderBy(traders.createdAt);

//     console.log("Traders fetched successfully");
// // In your traders API route
// const validatedTraders = traders.map(trader => ({
//   ...trader,
//   imageUrl: trader.imageUrl || '/COIN-SPECTRUM.png'
// }));

//     return NextResponse.json({
//       success: true,
//       traders: allTraders
//     });

//   } catch (error) {
//     console.error("Failed to fetch traders:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch traders" },
//       { status: 500 }
//     );
//   }
// }


// app/api/admin/traders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { traders, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

// Utility function to validate image URLs
const validateImageUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export async function POST(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify admin role
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'imageUrl', 'minCapital', 'percentageProfit'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate image URL format
    if (!validateImageUrl(body.imageUrl)) {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    const traderData = {
      id: `trader_${Date.now()}`,
      name: body.name,
      imageUrl: body.imageUrl,
      followers: Number(body.followers) || 0,
      minCapital: Number(body.minCapital),
      percentageProfit: Number(body.percentageProfit),
      totalProfit: Number(body.totalProfit) || 0,
      rating: Math.min(Math.max(Number(body.rating) || 5, 1), 5), // Clamp between 1-5
      isPro: Boolean(body.isPro),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [newTrader] = await db.insert(traders).values(traderData).returning();

    return NextResponse.json({
      success: true,
      trader: {
        ...newTrader,
        // Convert numeric fields to proper numbers
        followers: Number(newTrader.followers),
        minCapital: Number(newTrader.minCapital),
        percentageProfit: Number(newTrader.percentageProfit),
        totalProfit: Number(newTrader.totalProfit),
        rating: Number(newTrader.rating)
      }
    });

  } catch (error) {
    console.error("Error creating trader:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tradersData = await db
      .select()
      .from(traders)
      .orderBy(traders.createdAt);

    // Validate and transform trader data
    const validatedTraders = tradersData.map(trader => ({
      ...trader,
      imageUrl: validateImageUrl(trader.imageUrl) ? 
        trader.imageUrl : 
        '/images/COIN-SPECTRUM.png',
      followers: Number(trader.followers),
      minCapital: Number(trader.minCapital),
      percentageProfit: Number(trader.percentageProfit),
      totalProfit: Number(trader.totalProfit),
      rating: Number(trader.rating),
      createdAt: trader.createdAt.toISOString(),
      updatedAt: trader.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      traders: validatedTraders
    });

  } catch (error) {
    console.error("Error fetching traders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
