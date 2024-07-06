import { prisma } from "@/utils/prisma";
import { FileType } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";




async function changePathRecursively(userId: string, uid: string, path: string[], type: FileType) {

    if (type === "FILE") return;

    await prisma.filesAndFolders.update({
        where: {
            userId,
            uid
        },
        data: { path }
    })

    const childrens = await prisma.filesAndFolders.findMany({
        where: { parent: uid },
        select: { uid: true, type: true }
    })

    childrens.forEach((child: any) => { changePathRecursively(userId, child.uid, [...path, child.uid], child.type) })


}




export async function PATCH(req: NextRequest) {


    const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];
    const data = await req.json()

    if (!accessToken)
        return NextResponse.json({ err: "Forbidden" }, { status: 401 })


    try {
        const verify: any = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));


        let path: string[] = [];

        if (data.parent !== "home" && data.type === "FOLDER") {
            const parentData = await prisma.filesAndFolders.findFirst({
                where: {
                    uid: data.parent,
                    userId: verify.id
                }
            })

            if (!parentData)
                return NextResponse.json({ err: "Parent Not Found" }, { status: 404 })

            path = [...parentData.path, data.uid];
        }

        // console.log(data)


        const fileData = await prisma.filesAndFolders.update({
            where: {
                uid: data.uid,
                userId: verify.id
            },
            data: {
                parent: data.parent
            }
        })


        changePathRecursively(verify.id, data.uid, path, data.type);




        return NextResponse.json({ success: "Moved successfully" })


    } catch (err) {
        // console.log(err)

        return NextResponse.json({ err }, { status: 403 })


    }


}