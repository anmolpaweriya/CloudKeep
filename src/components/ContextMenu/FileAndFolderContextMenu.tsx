
import "client-only"

// icons
import { MdOpenWith } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegCopy, FaCut } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { MdContentPaste } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoLinkSharp } from "react-icons/io5";
import { MdSelectAll } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useSetFilesAndFoldersData } from "@/context/fileAndFolderContext";
import { useEffect, useState } from "react";
import RenameModel from "../Models/RenameModel";
import { useVerifyTokenFunc } from "@/context/tokenContext";




export default function FileAndFolderContextMenu(props: {
    contextMenuRef: any,
    top: number,
    left: number,
    showContextMenu: Boolean,
    file: any,
    setContextMenuConfig: any
}) {


    const [renameModelShow, setRenameModelShow] = useState(false)

    const router = useRouter();
    const setFilesAndFoldersData: any = useSetFilesAndFoldersData();
    const verifyToken: any = useVerifyTokenFunc();

    let { top, left } = props;


    if (left + 256 > window.innerWidth) left = window.innerWidth - 256;
    if (top + 300 > window.innerHeight) top = window.innerHeight - 300;







    function openFileOrFolderFunc() {

        if (props.file.type === "FOLDER")
            router.replace(`/${props.file.uid}`)
        else
            window.location.href = `/api/file/${props.file.fileServerId}`
    }


    function copyLinkFunc() {
        navigator.clipboard.writeText(`${window.location.origin}/api/file/${props.file.fileServerId}`);
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



    if (props.showContextMenu)
        return (<>
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

                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"><FaCut /> <p className="text-sm">Cut</p> </button>
                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"><FaRegCopy />            <p className="text-sm">Copy</p></button>
                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"><MdContentPaste />            <p className="text-sm">Paste</p></button>


                <div className="bg-gray-300 h-[1px]" ></div>


                <button className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"
                    onClick={copyLinkFunc}
                > <IoLinkSharp /> <p className="text-sm">Copy Link</p></button>

                {props.file.type === "FILE"
                    &&
                    <a
                        href={`https://docs.google.com/uc?export=download&id=${props.file.fileServerId}`}
                        className="box-border px-8 py-1 hover:bg-gray-100 flex gap-2 items-center rounded m-1"> <MdOutlineFileDownload /> <p className="text-sm">Donwload</p></a>
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
