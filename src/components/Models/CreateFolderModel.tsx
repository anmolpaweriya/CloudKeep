"use client"

import { useFolderPath, useSetFilesAndFoldersData } from "@/context/fileAndFolderContext";
import { useSetIsLoading } from "@/context/loadingScreenContext";
import { useVerifyTokenFunc } from "@/context/tokenContext";
import { useState } from "react";

export default function CreateFolderModel(props: {
    cancelBtnFunc: () => void,
    parentId: string
}) {


    const [folderName, setFolderName] = useState("");
    const path: any = useFolderPath();
    const setFolderData: any = useSetFilesAndFoldersData();
    const setIsLoading = useSetIsLoading();
    const verifyToken: any = useVerifyTokenFunc();








    async function createFolderBtnFunc(e: any) {
        e.preventDefault();
        if (folderName === "")
            return;

        if (typeof window === "undefined") return

        const tokenVerifyData: any = await verifyToken();

        if (tokenVerifyData.err) {
            alert("Token Not Valid")
            return;
        }


        setIsLoading(true);
        const data: any = await fetch('/api/folder', {
            method: "PUT",
            headers: {
                "Authentication": `Bearer ${localStorage.getItem('apCloudAccessToken')}`
            },
            body: JSON.stringify({
                folderName,
                parent: props.parentId,
                path: path.map((element: string) => element.split('/')[1])
            })
        }).then(res => res.json())
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
        if (data.err) {
            console.log(data.err)



            if (data.err?.meta?.target === "FilesAndFolders_parent_name_key")
                alert("Folder Already Exists");

            return;
        }

        setFolderData((pre: any) => [...pre, data]);
        props.cancelBtnFunc();

    }


    return <form className="fixed  z-50 top-[50%] w-[90%] max-w-md left-[50%] translate-y-[-50%] translate-x-[-50%] py-5 px-3 rounded-lg shadow-[0_0_0_100vw_#00000099]  bg-white grid gap-2">
        <h1 className="text-center border-b p-4 mb-3 border-b-gray-500 text-3xl font-semibold">Create Folder </h1>
        <h5 className=" font-medium">Name</h5>
        <input
            value={folderName}
            onChange={e => { setFolderName(e.target.value) }}
            spellCheck={false}
            className="border w-full  border-gray-300 rounded text-md box-border px-3 py-2 outline-gray-500"

            placeholder="Enter Folder name"

        />
        <div className="flex gap-2 justify-end">

            <button
                className="bg-lime-400    flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium self-end"
                onClick={createFolderBtnFunc}
            >
                <p>Create</p>
            </button>
            <button
                className="bg-red-400   flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium self-end"
                onClick={props.cancelBtnFunc}
            >
                <p>Cancel</p>
            </button>
        </div>
    </form>
}