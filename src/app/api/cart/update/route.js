import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { saplingId, quantity } = await request.json();
    
    // Validate input
    if (!saplingId || !quantity || quantity < 1) {
      return NextResponse.json({ 
        error: "Product ID and valid quantity are required" 
      }, { status: 400 });
    }
    
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });
    
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }
    
    // Update item quantity
    await prisma.cartItem.updateMany({
      where: {
        cartId: cart.id,
        saplingId: parseInt(saplingId),
      },
      data: {
        quantity: quantity,
      },
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}