import { NextRequest } from "next/server";
import fetch from 'node-fetch'

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {



    const imageUrl = `https://drive.google.com/uc?export=view&id=${params.fileId}`;
    const response: any = await fetch(imageUrl);
    const imageBuffer: any = await response.buffer();
    // res.set('Content-Type', 'image/jpeg'); // Adjust content type based on your image type
    // res.send(imageBuffer);

    return new Response(imageBuffer)
}