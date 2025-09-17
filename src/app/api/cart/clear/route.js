import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE() {
  try {
    const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });
    
    if (!cart) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    
    // Clear all items from cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}