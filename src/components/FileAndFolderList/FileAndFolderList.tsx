import { useFileAndFolderData } from "@/context/fileAndFolderContext"
import Link from "next/link"
import FileAndFolderContextMenu from "../ContextMenu/FileAndFolderContextMenu";
import { useEffect, useRef, useState } from "react";


import { IoMdMore } from "react-icons/io";



export default function FileAndFolderList(props: {
    parent: string,
    searchText: string
}) {


    const fileAndFolderData: any = useFileAndFolderData();
    const contextMenuRef: any = useRef();
    const [contextMenuConfig, setContextMenuConfig] = useState<{
        top: number,
        left: number,
        showContextMenu: Boolean,
        file: any
    }>({
        top: 0,
        left: 0,
        showContextMenu: false,
        file: {}
    });


    function trucateString(str: string, len: number) {
        if (str.length < len) return str

        return str.slice(0, len - 3) + "..." + str.slice(-4)

    }


    function contextMenuFunc(e: any, file: any) {
        e.preventDefault();
        setContextMenuConfig({
            top: e.clientY,
            left: e.clientX,
            showContextMenu: true,
            file
        })
    }




    // to manage outside click of context menu to close it
    useEffect(() => {
        const handler = (e: any) => {
            if (!contextMenuRef.current || !contextMenuRef.current.contains(e.target))
                setContextMenuConfig((pre: any) => {
                    return { ...pre, showContextMenu: false }
                })
        }
        document.addEventListener('mousedown', handler)

        return () => {
            document.removeEventListener('mousedown', handler)

        }
    })


    return <>

        <FileAndFolderContextMenu
            contextMenuRef={contextMenuRef}
            top={contextMenuConfig.top}
            left={contextMenuConfig.left}
            showContextMenu={contextMenuConfig.showContextMenu}
            file={contextMenuConfig.file}
            setContextMenuConfig={setContextMenuConfig}
        />

        <div className="mt-5 grid gap-3 px-4 w-full pb-32 "
            style={{
                gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))"
            }}
        >



            {/* folders  */}
            {
                fileAndFolderData?.map((file: any) => {
                    if (file.type == "FOLDER" && file.name.includes(props.searchText))
                        return <Link
                            onContextMenu={e => contextMenuFunc(e, file)}
                            className="  flex flex-col justify-center items-center text-base  shadow hover:shadow-lg h-[150px] transition-all font-medium   rounded-md p-2 bg-slate-200"
                            href={`/${file.uid}`}
                            key={file.uid}
                        >

                            <div className="h-full overflow-hidden flex items-center justify-center ">

                                <img
                                    src="/img/folder.png"
                                    alt="" />
                            </div>
                            <div className="flex justify-between w-full items-center">

                                <p
                                    className="truncate text-sm"
                                > {trucateString(file.name, 13)}</p>
                                <button
                                    onClick={e => contextMenuFunc(e, file)}
                                ><IoMdMore /></button>
                            </div>
                        </Link>



                })
            }


            {/* files  */}
            {
                fileAndFolderData?.map((file: any) => {
                    if (file.type === "FILE" && file.name.includes(props.searchText))
                        return <a
                            href={`/api/file/${file.fileServerId}`}
                            onContextMenu={e => contextMenuFunc(e, file)}
                            className="  flex flex-col justify-center items-center text-base  shadow hover:shadow-lg h-[150px] transition-all font-medium   rounded-md p-2  bg-slate-200 gap-1"
                            key={file.uid}
                        >
                            <div className="h-full w-full relative overflow-hidden rounded-lg ">
                                <img src="/img/file.png"
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
                                    alt="" />


                                <img
                                    className="rounded-lg overflow-hidden z-10 relative "
                                    // src="/img/file.png"
                                    // src={`https://drive.google.com/thumbnail?id=${file.fileServerId}`}
                                    src={`https://lh3.googleusercontent.com/d/${file.fileServerId}`}
                                    alt="" />
                            </div>
                            <div className="flex justify-between w-full items-center ">

                                <p
                                    className="truncate text-sm"
                                > {trucateString(file.name, 13)}</p>
                                <button
                                    className="text-xl"
                                    onClick={e => contextMenuFunc(e, file)}
                                ><IoMdMore /></button>

                            </div>
                        </a>


                })
            }

        </div >

    </>
}