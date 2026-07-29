import cloudinary from "@/app/sharedui/lib/cloudinary"
import { NextResponse } from "next/server"



export async function POST(req: Request) {
    try {
        const form = await req.formData()
        const file = await form.get('file') as string
        console.log(file)
        if (!file) {
            return NextResponse.json({ message: "No file found" }, { status: 404 })
        }
        // const bytes = await file.arrayBuffer()
        const imageUrl = await cloudinary.uploader.upload(file, { folder: "blog" })
        console.log(imageUrl)
    } catch (error) {
        console.log(error)
    }
}