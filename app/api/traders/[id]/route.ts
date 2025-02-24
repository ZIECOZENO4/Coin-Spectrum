
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { traders, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Starting trader creation process...");
    
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

     const user = await db.query.users.findFirst({
       where: eq(users.id, session.user.id)
     });
 
     if (user?.role !== "admin") {
       console.error("Non-admin user attempted to create trader:", session.user.id);
       return NextResponse.json(
         { error: "Admin access required" },
         { status: 403 }
       );
     }

    const body = await req.json();
    const { id } = params;

    const updatedTrader = await db
      .update(traders)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(traders.id, id))
      .returning();

    return NextResponse.json(updatedTrader[0]);
  } catch (error) {
    console.error("Error updating trader:", error);
    return NextResponse.json(
      { error: "Failed to update trader" },
      { status: 500 }
    );
  }
}
