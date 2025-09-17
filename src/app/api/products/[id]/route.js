import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

// GET a single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const product = await prisma.sapling.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("GET product error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// UPDATE a product
export async function PUT(request, { params }) {
  try {
    // Ensure user is admin
    await requireAdmin();
    
    const { id } = params;
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || body.price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }
    
    if (!body.category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    
    // Look up category by name
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name: {
          equals: body.category,
          mode: 'insensitive'
        }
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    // Update product
    const updatedProduct = await prisma.sapling.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        price: parseFloat(body.price),
        description: body.description || "",
        category: body.category || "",
        image: body.image || "",
        season: body.season || [],
        availability: body.availability !== undefined ? body.availability : true,
        rating: body.rating ? parseFloat(body.rating) : 0,
        reviews: body.reviews ? parseInt(body.reviews) : 0,
        categoryRel: {
          connect: {
            id: existingCategory.id,
          },
        },
      },
    });
    
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("PUT product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request, { params }) {
  try {
    // Ensure user is admin
    await requireAdmin();
    
    const { id } = params;
    
    await prisma.sapling.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}




