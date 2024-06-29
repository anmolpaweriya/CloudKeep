import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import { prisma } from "@/utils/prisma";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";




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


async function uploadFileToDrive(fileName: string, file: any) {

    const auth = getGoogleAPIAuth();
    const drive = google.drive({ version: "v3", auth });
    // Upload the file to the subfolder
    const fileStream = Readable.from(Buffer.from(await file.arrayBuffer()));
    const media = {
        mimeType: file.type,
        body: fileStream,
    };
    const fileMetadata = {
        name: fileName,
        parents: ["1x2cbWWRcpQggIHOrW_kZi_v3yxl9lWtp"], // Use the ID of the subfolder
    };
    const fileResponse = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: "id",
    });

    return String(fileResponse.data.id)
}


async function getDriveAPI() {
    const auth = getGoogleAPIAuth();
    const drive = google.drive({ version: "v3", auth });
    return drive
}

async function deleteFileFromDrive(fileId: string) {
    const drive = await getDriveAPI()

    await drive.files.delete({
        fileId: fileId
    });

}

export async function PUT(req: NextRequest) {

    try {
        const formData = await req.formData();
        const file: any = formData.get("file");
        const parent: any = formData.get("parent");
        const fileName: any = formData.get("fileName");

        const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];
        // console.log(req.headers)
        const verify: any = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));



        const isExist = await prisma.filesAndFolders.findFirst({ where: { name: fileName, parent } })
        if (isExist)
            throw new Error("File Name is Alerady Exists")


        const fileServerId: string = await uploadFileToDrive(fileName, file);
        const uid = uuidv4();
        const data: any = await prisma.filesAndFolders.create({
            data: {
                uid,
                name: fileName,
                userId: verify.id,
                parent,
                type: "FILE",
                fileServerId



            }
        })




        return NextResponse.json({ success: "uploaded", data }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ err })
    }
}


export async function PATCH(req: NextRequest) {



    const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];
    const data = await req.json()

    if (!accessToken)
        return NextResponse.json({ err: "Forbidden" }, { status: 401 })


    try {
        const verify: any = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));


        const fileData = await prisma.filesAndFolders.update({
            where: {
                id: data.id,
                userId: verify.id
            },
            data: {
                name: data.name
            },
            select: {
                fileServerId: true
            }
        })



        const drive = await getDriveAPI();
        const fileId: string | null = fileData.fileServerId
        if (fileId && data.name)
            drive.files.update({
                fileId,
                requestBody: {
                    name: data.name
                },
            });




        return NextResponse.json({ success: "Renamed successfully" }, { status: 201 })


    } catch (err) {

        return NextResponse.json({ err }, { status: 403 })


    }

}



export async function DELETE(req: NextRequest) {

    try {
        const { uid }: { uid: string } = await req.json();

        const accessToken = req.headers.get('authentication')?.split("Bearer ")[1];
        // console.log(req.headers)
        const verify: any = jwt.verify(String(accessToken), String(process.env.ACCESS_TOKEN_SECRET));


        const data: any = await prisma.filesAndFolders.findFirst({
            where: {
                uid,
                userId: verify.id
            },

            select: {
                fileServerId: true
            }
        }

        )

        if (!data)
            throw new Error("File not Exists");

        await prisma.filesAndFolders.delete({
            where: {
                uid,
                userId: verify.id
            }
        })
        await deleteFileFromDrive(data?.fileServerId);



        return NextResponse.json({ success: "removed" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ err })
    }

}