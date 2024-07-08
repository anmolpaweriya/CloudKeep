
import "client-only"
import { useState } from "react";
import { useRouter } from "next/navigation";



// icons
import { MdOpenWith } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegCopy, FaCut } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { MdContentPaste } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoLinkSharp } from "react-icons/io5";
import { MdSelectAll } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";


// custom hooks
import { useSetFilesAndFoldersData } from "@/context/fileAndFolderContext";
import { useVerifyTokenFunc } from "@/context/tokenContext";
import { useSelectedFiles, useSetSelectedFiles } from "@/context/selectedFileContext";



// components
import RenameModel from "../Models/RenameModel";
import { useIsLoading, useSetIsLoading } from "@/context/loadingScreenContext";
import Loading from "@/loading";




export default function FileAndFolderContextMenu(props: {
    contextMenuRef: any,
    top: number,
    left: number,
    showContextMenu: Boolean,
    file: any,
    setContextMenuConfig: any,
    parent: string,
    setOpenCreateFolderModel: any,
    setOpenUploadFileModel: any
}) {


    const [renameModelShow, setRenameModelShow] = useState(false)

    const router = useRouter();
    const setFilesAndFoldersData: any = useSetFilesAndFoldersData();
    const verifyToken: any = useVerifyTokenFunc();
    const selectedFiles: any = useSelectedFiles();
    const setSelectedFiles: any = useSetSelectedFiles();
    const setIsLoading: any = useSetIsLoading();
    const isLoading: any = useIsLoading();
    let { top, left } = props;

    if (props.file) {

        if (top + 300 > window.innerHeight) top = window.innerHeight - 300;
    } else {
        if (top + 100 > window.innerHeight) top = window.innerHeight - 100;

    }
    if (left + 256 > window.innerWidth) left = window.innerWidth - 256;







    function openFileOrFolderFunc() {

        if (props.file.type === "FOLDER")
            router.replace(`/${props.file.uid}`)
        else
            window.location.href = `/api/file/${props.file.fileServerId}`
    }


    function copyLinkFunc() {
        if (props.file.type === "FILE")
            navigator.clipboard.writeText(`${window.location.origin}/api/file/${props.file.fileServerId}`);
        else
            navigator.clipboard.writeText(`${window.location.origin}/app/${props.file.uid}`);
        props.setContextMenuConfig({})
        // alert("Link Copied");
    }

    function copyDriveLinkFunc() {

        navigator.clipboard.writeText(`https://drive.google.com/uc?export=view&id=${props.file.fileServerId}`);
        props.setContextMenuConfig({})
        // alert("Link Copied");
    }

    function renameBtnFunc() {
        setRenameModelShow(true);
    }

    async function deleteFileOrFolderFunc() {

        const tokenVerifyData: any = await verifyToken();

        if (tokenVerifyData.err) {
            alert("Token Not Valid")
            return;
        }

        const data: any = await fetch(`/api/${props.file.type.toLowerCase()}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication": `Bearer ${localStorage.getItem("apCloudAccessToken")}`
                },
                body: JSON.stringify({
                    uid: props.file.uid
                })
            })

        if (data.err) {
            console.log(data.err)
            return;

        }

        setFilesAndFoldersData((pre: any) => pre.filter((file: any) => file.id !== props.file.id))



        props.setContextMenuConfig({});

    }

    function cancelRenameModelFunc() {
        setRenameModelShow(false);
        props.setContextMenuConfig({});
    }

    function cutFileFunc() {
        setSelectedFiles({
            type: 'move',
            files: [{ type: props.file.type, uid: props.file.uid }]
        })
        props.setContextMenuConfig({})
    }


    // comming soon
    // function copyFileFunc() {
    //     setSelectedFiles({
    //         type: 'copy',
    //         files: [props.file.id]
    //     })
    //     props.setContextMenuConfig({})

    // }



    async function pasteBtnFunc(e: any) {
        setIsLoading(true);

        for (let i = 0; i < selectedFiles.files.length; i++) {

            const file = selectedFiles.files[i];

            // console.log(file)
            if (file.parent === props.parent) continue;
            const data = await fetch(`/api/${selectedFiles.type}`, {
                method: "PATCH",
                headers: {
                    "Authentication": `Bearer ${localStorage.getItem('apCloudAccessToken')}`
                },
                body: JSON.stringify({
                    type: file.type,
                    uid: file.uid,
                    parent: props.parent
                })
            })
        }

        setSelectedFiles({ files: [] })
        setIsLoading(false);

        window.location.reload();

    }






    if (props.showContextMenu && !props.file)
        return <>
            {
                isLoading && <Loading />
            }
            <div
                ref={props.contextMenuRef}
                className={`absolute z-40 grid w-64 bg-white rounded shadow-md shadow-gray-400  `}
                style={{
                    top: `${top}px`,
                    left: `${left}px`
                }}
            >

                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                    onClick={() => props.setOpenCreateFolderModel(true)}
                ><MdCreateNewFolder />            <p className="text-sm">Create Folder</p></button>
                <button
                    onClick={() => props.setOpenUploadFileModel(true)}
                    className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"><MdOutlineFileUpload />            <p className="text-sm">Upload File</p></button>
                <div className="bg-gray-300 h-[1px]" ></div>

                {selectedFiles.files.length > 0

                    &&
                    <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                        onClick={pasteBtnFunc}
                    ><MdContentPaste />            <p className="text-sm">Paste</p></button>
                }


            </div>
        </>




    if (props.showContextMenu)
        return (<>
            {
                isLoading && <Loading />
            }
            <div
                ref={props.contextMenuRef}
                className={`absolute z-40 grid w-64 bg-white rounded shadow-md shadow-gray-400  `}
                style={{
                    top: `${top}px`,
                    left: `${left}px`
                }}
            >


                {/* Rename Model  */}
                {renameModelShow
                    &&
                    <RenameModel
                        cancelBtnFunc={cancelRenameModelFunc}
                        id={props.file.id}
                        type={props.file.type}
                        defaultName={props.file.name}
                    />
                }



                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                    onClick={openFileOrFolderFunc}
                > <MdOpenWith /> <p className="text-sm">Open</p></button>
                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"> <MdSelectAll /> <p className="text-sm">Select</p></button>

                <div className="bg-gray-300 h-[1px]" ></div>

                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                    onClick={cutFileFunc}
                ><FaCut /> <p className="text-sm">Cut</p> </button>


                {/* Comming soon */}
                {/* 
                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                    onClick={copyFileFunc}
                ><FaRegCopy /> <p className="text-sm">Copy</p></button> */}






                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                    onClick={copyLinkFunc}
                > <IoLinkSharp /> <p className="text-sm">Copy Link</p></button>



                {
                    props.file.type === "FILE"
                    &&
                    <>
                        <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                            onClick={copyDriveLinkFunc}
                        > <IoLinkSharp /> <p className="text-sm">Drive Link</p></button>
                        <a
                            href={`https://docs.google.com/uc?export=download&id=${props.file.fileServerId}`}
                            className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"> <MdOutlineFileDownload /> <p className="text-sm">Donwload</p></a>
                    </>
                }


                <div className="bg-gray-300 h-[1px]" ></div>

                <button
                    onClick={renameBtnFunc}
                    className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"><MdDriveFileRenameOutline />            <p className="text-sm">Rename</p></button>


                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                    onClick={deleteFileOrFolderFunc}
                ><MdDeleteOutline />            <p className="text-sm">Delete</p></button>


            </div>
        </>
        )
}
