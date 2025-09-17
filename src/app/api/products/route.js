// app/api/saplings/route.js
import { PrismaClient } from "@/generated/prisma"; 
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

// Create a singleton instance of PrismaClient
const globalForPrisma = global || {};
if (!globalForPrisma.prisma) globalForPrisma.prisma = null;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// GET: Fetch all products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const categories = searchParams.get('categories');
    const categoryIds = searchParams.get('categoryIds');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const season = searchParams.get('season');
    const seasons = searchParams.get('seasons');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined;
    const includeUnavailable = searchParams.get('includeUnavailable') === 'true';
    
    // Build filter conditions
    let where = {};
    
    // Only filter by availability if we're not explicitly including unavailable products
    // and we're not in the admin panel
    if (!includeUnavailable) {
      where.availability = true;
    }
    
    // Handle category filtering with numeric IDs
    if (categoryIds) {
      // Split comma-separated category IDs and filter by any of them
      const idList = categoryIds.split(',').map(id => parseInt(id, 10));
      where.OR = idList.map(id => ({ categoryRel: { id } }));
    }
    // Backward compatibility for category name filtering
    else if (categories) {
      // Split comma-separated categories and filter by any of them
      const categoryList = categories.split(',');
      where.OR = categoryList.map(cat => ({ category: cat }));
    } 
    else if (category && category !== 'all') {
      // Backward compatibility for single category
      where.category = category;
    }
    
    if (minPrice && maxPrice) {
      where.price = {
        gte: parseFloat(minPrice),
        lte: parseFloat(maxPrice),
      };
    } else if (minPrice) {
      where.price = { gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      where.price = { lte: parseFloat(maxPrice) };
    }
    
    if (season && season !== 'all') {
      where.season = { has: season };
    }
    
    if (search) {
      // If we already have OR conditions for categories, we need to combine them with search
      if (where.OR) {
        const categoryConditions = [...where.OR];
        where.OR = categoryConditions;
        where.AND = [{
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        }];
      } else {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
    }
    
    // If featured parameter is provided, filter for featured products
    if (featured === 'true') {
      where.featured = true;
    }
    
    // Build the query options
    const options = {
      where,
      orderBy: { id: 'desc' }, // Order by newest first
    };
    
    // Apply limit if provided
    if (limit) {
      options.take = parseInt(limit);
    }
    
    const products = await prisma.sapling.findMany(options);
    
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(request) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const body = await request.json();
    const {
      name,
      price,
      description,
      category, // category name (e.g., "Climbers")
      image,
      season,
      availability,
      rating,
      reviews,
    } = body;

    // Validate required fields
    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }
    
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // Look up category by name
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name: {
          equals: category,
          mode: 'insensitive'
        }
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Create product with category relation
    const product = await prisma.sapling.create({
      data: { 
        name,
        price: parseFloat(price),
        description: description || "",
        category, // Store name string in the `category` field
        image: image || "",
        season: season || [],
        availability: availability !== undefined ? availability : true,
        rating: rating ? parseFloat(rating) : 0,
        reviews: reviews ? parseInt(reviews) : 0,
        categoryRel: {
          connect: {
            id: existingCategory.id,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

