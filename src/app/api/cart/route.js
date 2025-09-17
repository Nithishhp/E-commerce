import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Fetch user's cart
export async function GET() {
  try {
    const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            sapling: true,
          },
        },
      },
    });
    
    if (!cart) {
      cart = {
        userId: user.id,
        items: [],
      };
    }
    
    // Format cart items for frontend
    const formattedItems = cart.items.map(item => ({
      id: item.sapling.id.toString(),
      name: item.sapling.name,
      price: `₹${item.sapling.price}`,
      image: item.sapling.image,
      quantity: item.quantity,
    }));
    
    return NextResponse.json({ 
      items: formattedItems 
    }, { status: 200 });
    
  } catch (error) {
    console.error("GET cart error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}