import { prisma } from "@/utils/prisma";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {


    const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];
    const data = await req.json()

    if (!accessToken)
        return NextResponse.json({ err: "Forbidden" }, { status: 401 })


    try {
        const verify: any = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));




        let parentFolderData: any = null;

        if (data.parent !== "home") {
            parentFolderData = await prisma.filesAndFolders.findFirst({
                where: {
                    userId: verify.id,
                    uid: data.parent
                }
            })

            if (!parentFolderData)
                return NextResponse.json({ err: "Folder Not Found" }, { status: 404 })

        }
        const filesAndFolders = await prisma.filesAndFolders.findMany({
            where: {
                userId: verify.id,
                parent: data.parent

            }
        })




        const path = parentFolderData?.path || []



        for (let index in path) {
            const folderData = await prisma.filesAndFolders.findFirst({
                where: { uid: path[index] },
                select: { name: true }
            })

            path[index] = `${folderData?.name}/${path[index]}`

        }





        return NextResponse.json({ filesAndFolders, path }, { status: 200 })


    } catch (err) {

        return NextResponse.json({ err }, { status: 403 })


    }

}



async function createFolderRecursively(name: string, userId: string, parent: string, path: string[]) {
    let folder: any = await prisma.filesAndFolders.findFirst({
        where: {
            name: name.split('/')[0],
            parent,
            userId,
            type: "FOLDER"
        }
    })


    let folderUID: string = folder?.uid || "";

    if (!folder) {
        folderUID = uuidv4();

        folder = await prisma.filesAndFolders.create({
            data: {
                uid: folderUID,
                name: name.split('/')[0],
                userId,
                parent,
                path: [...path, folderUID],
                type: "FOLDER"
            }
        })
    }

    if (name.includes('/'))
        await createFolderRecursively(name.split('/').slice(1).join('/'), userId, folderUID, [...path, folderUID]);


    return folder;

}

export async function PUT(req: NextRequest) {

    const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];
    const data = await req.json()

    if (!accessToken)
        return NextResponse.json({ err: "Forbidden" }, { status: 401 })


    try {
        const verify: any = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));

        // const folderUID: string = uuidv4();

        // const folder = await prisma.filesAndFolders.create({
        //     data: {
        //         uid: folderUID,
        //         name: data.folderName.split('/')[0],
        //         userId: verify.id,
        //         parent: data.parent,
        //         path: [...data.path, folderUID],
        //         type: "FOLDER"
        //     }
        // })

        // if (data.folderName.includes('/'))
        const folder = await createFolderRecursively(data.folderName, verify.id, data.parent, data.path)


        return NextResponse.json(folder, { status: 201 })


    } catch (err) {
        // console.log(err)
        return NextResponse.json({ err }, { status: 403 })


    }


}


export async function PATCH(req: NextRequest) {



    const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];
    const data = await req.json()

    if (!accessToken)
        return NextResponse.json({ err: "Forbidden" }, { status: 401 })


    try {
        const verify: any = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));


        await prisma.filesAndFolders.update({
            where: {
                id: data.id,
                userId: verify.id
            },
            data: {
                name: data.name
            }
        })

        return NextResponse.json({ success: "Renamed successfully" }, { status: 201 })


    } catch (err) {

        return NextResponse.json({ err }, { status: 403 })


    }

}




function getGoogleAPIAuth() {
    const credentials = {
        type: process.env.type,
        project_id: process.env.project_id,
        private_key_id: process.env.private_key_id,
        private_key: process.env.private_key,
        client_email: process.env.client_email,
        client_id: process.env.client_id,
        auth_uri: process.env.auth_uri,
        token_uri: process.env.token_uri,
        auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
        client_x509_cert_url: process.env.client_x509_cert_url,
        universe_domain: process.env.universe_domain,
    }
    return new google.auth.GoogleAuth({
        // keyFile: process.cwd() + "/src/data/googleAPICredentials.json",
        credentials,
        scopes: ["https://www.googleapis.com/auth/drive"],
    });
}


async function deleteFileFromDrive(fileId: string) {
    const auth = getGoogleAPIAuth();
    const drive = google.drive({ version: "v3", auth });

    await drive.files.delete({
        fileId: fileId
    });

}


async function deleteRecursively(parent: string, userId: string) {


    await prisma.filesAndFolders.delete({ where: { uid: parent } })

    const childrens = await prisma.filesAndFolders.findMany({
        where: {
            parent,
            userId
        },
        select: {
            uid: true,
            fileServerId: true
        }
    })



    childrens.forEach(async (child: { uid: string, fileServerId: string | null }) => {

        await deleteRecursively(child.uid, userId)
        if (child.fileServerId)
            await deleteFileFromDrive(child.fileServerId)
    })


}

export async function DELETE(req: NextRequest) {
    try {
        const { uid }: { uid: string } = await req.json();

        const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];
        if (!accessToken)
            return NextResponse.json({ err: "Forbidden" }, { status: 401 })


        // console.log(req.headers)
        const verify: any = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));


        const isDataExists: any = await prisma.filesAndFolders.findFirst({
            where: {
                uid,
                userId: verify.id
            },

            select: {
                fileServerId: true
            }
        }

        )

        if (!isDataExists)
            throw new Error("File not Exists");


        await deleteRecursively(uid, verify.id)





        return NextResponse.json({ success: "removed" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 403 })
    }



}