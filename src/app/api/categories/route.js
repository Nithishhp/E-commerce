import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST: Create a new category (admin only)
export async function POST(request) {
  try {
    // Ensure user is admin
    await requireAdmin();
    
    const body = await request.json();
    const { name } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }
    
    const trimmedName = name.trim();
    
    // Check if category already exists (case insensitive)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive'
        }
      },
    });
    
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }
    
    // Create new category
    const category = await prisma.category.create({
      data: { name: trimmedName },
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
