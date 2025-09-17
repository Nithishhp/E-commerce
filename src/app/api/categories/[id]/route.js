import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

// GET a single category by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("GET category error:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

// UPDATE a category
export async function PUT(request, { params }) {
  try {
    // Ensure user is admin
    await requireAdmin();
    
    const { id } = params;
    const body = await request.json();
    
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }
    
    const trimmedName = body.name.trim();
    
    // Check if another category with the same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive'
        },
        id: {
          not: parseInt(id)
        }
      },
    });
    
    if (existingCategory) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 400 });
    }
    
    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: trimmedName },
    });
    
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("PUT category error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE a category
export async function DELETE(request, { params }) {
  try {
    // Ensure user is admin
    await requireAdmin();
    
    const { id } = params;
    
    // Check if category is in use by any products
    const productsUsingCategory = await prisma.sapling.findFirst({
      where: {
        categoryRel: {
          id: parseInt(id)
        }
      },
    });
    
    if (productsUsingCategory) {
      return NextResponse.json({ 
        error: "Cannot delete category that is in use by products" 
      }, { status: 400 });
    }
    
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}