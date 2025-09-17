import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from "@/lib/auth";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    if (!fileType.startsWith('image/')) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${fileType};base64,${base64}`;
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'plant-shop-products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    // Return the Cloudinary URL
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    }, { status: 200 });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ 
      error: "Failed to upload image", 
      details: error.message 
    }, { status: 500 });
  }
}