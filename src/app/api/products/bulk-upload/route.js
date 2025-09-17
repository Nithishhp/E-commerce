import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { requireAdmin } from "@/lib/auth";
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Ensure user is admin
    await requireAdmin();
    
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Validate file type
    const fileType = file.type;
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream'
    ];
    
    if (!validTypes.includes(fileType)) {
      return NextResponse.json({ error: "Only Excel files are allowed" }, { status: 400 });
    }
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      return NextResponse.json({ error: "No data found in the spreadsheet" }, { status: 400 });
    }
    
    // Validate and process each row
    const results = {
      success: [],
      errors: []
    };
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 because row 1 is headers
      
      try {
        // Validate required fields
        if (!row.name || row.price === undefined) {
          throw new Error("Name and price are required");
        }
        
        // Parse seasons (comma-separated string to array)
        let seasons = [];
        if (row.season) {
          seasons = row.season.split(',').map(s => s.trim());
        }
        
        // Parse availability (convert string 'true'/'false' to boolean)
        let availability = true;
        if (row.availability !== undefined) {
          availability = row.availability === true || 
                         row.availability === 'true' || 
                         row.availability === 1;
        }
        
        // Create product
        const product = await prisma.sapling.create({
          data: {
            name: row.name,
            price: parseFloat(row.price),
            description: row.description || "",
            category: row.category || "",
            image: row.image || "",
            season: seasons,
            availability: availability,
            rating: row.rating ? parseFloat(row.rating) : 0,
            reviews: row.reviews ? parseInt(row.reviews) : 0,
          },
        });
        
        results.success.push({
          row: rowNumber,
          id: product.id,
          name: product.name
        });
      } catch (error) {
        results.errors.push({
          row: rowNumber,
          name: row.name || `Row ${rowNumber}`,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      message: `Processed ${data.length} rows with ${results.success.length} successes and ${results.errors.length} errors`,
      results
    }, { status: 200 });
    
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ 
      error: "Failed to process bulk upload", 
      details: error.message 
    }, { status: 500 });
  }
}