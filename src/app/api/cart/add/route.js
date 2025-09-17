import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request) {
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
    
    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }
    
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_saplingId: {
          cartId: cart.id,
          saplingId: parseInt(saplingId),
        },
      },
    });
    
    if (existingItem) {
      // Update quantity if item exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      });
    } else {
      // Add new item to cart
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          saplingId: parseInt(saplingId),
          quantity: 1,
        },
      });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}