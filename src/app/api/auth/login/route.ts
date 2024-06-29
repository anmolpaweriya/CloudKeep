import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { prisma } from "@/utils/prisma";
import { JWTUtils } from "@/utils/jwtUtils";
import detectDeviceType from "@/utils/detectDeviceType";


export async function POST(req: NextRequest) {

    const data = await req.json();


    if (!data.email)
        return NextResponse.json({ err: "Email is messing" }, { status: 404 })

    if (!data.password)
        return NextResponse.json({ err: "Password is messing" }, { status: 404 })


    try {


        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user)
            return NextResponse.json({ err: "Email doesn't exists" })

        const compare = await bcrypt.compare(data.password, user.password);

        if (!compare)
            return NextResponse.json({ err: "Password is incorrect" });


        const deviceType = detectDeviceType(String(req.headers.get('user-agent')));
        const accessToken = await JWTUtils.generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = await JWTUtils.generateRefreshToken({ id: user.id, email: user.email });

        prisma.loggedInDevices.create({
            data: {
                refreshToken,
                deviceType,
                userId: user.id
            }
        })
        return NextResponse.json({
            accessToken, refreshToken,
            success: "Logged in"
        })

    } catch (err) {

        return NextResponse.json({ err: "Something went wrong" })
    }


}