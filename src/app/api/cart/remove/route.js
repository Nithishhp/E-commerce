import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(request) {
  try {
    const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { saplingId } = await request.json();
    
    // Validate saplingId
    if (!saplingId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
    
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });
    
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }
    
    // Remove item from cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        saplingId: parseInt(saplingId),
      },
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}