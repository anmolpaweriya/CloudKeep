import { JWTUtils } from "@/utils/jwtUtils";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];

    if (!accessToken)
        return NextResponse.json({ err: "Forbidden" }, { status: 401 })



    try {
        const verify = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));



        return NextResponse.json(verify)

    } catch (err) {

        return NextResponse.json({ err }, { status: 403 })


    }



}
export async function POST(req: NextRequest) {

    const { refreshToken } = await req.json()

    if (!refreshToken)
        return NextResponse.json({ err: "Forbidden" }, { status: 401 })

    try {
        const data: any = jwt.verify(String(refreshToken), String(process.env.REFRESH_TOKEN_SECRET));

        if (data.exp)
            delete data['exp'];
        if (data.iat)
            delete data['iat'];
        const accessToken = await JWTUtils.generateAccessToken(data)



        return NextResponse.json({ accessToken, data })

    } catch (err) {

        return NextResponse.json({ err }, { status: 403 })


    }



}