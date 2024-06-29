import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { prisma } from "@/utils/prisma";


export async function POST(req: NextRequest) {

    const data = await req.json();


    if (!data.email)
        return NextResponse.json({ err: "Email is messing" }, { status: 404 })

    if (!data.password)
        return NextResponse.json({ err: "Password is messing" }, { status: 404 })



    try {

        const password = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password
            }
        })


        if (!user) throw Error();
        return NextResponse.json({ success: "Signed up successfully" })

    } catch (err) {

        return NextResponse.json({ err: "Email already Exists" })
    }


}