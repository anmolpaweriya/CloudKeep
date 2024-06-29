import { useSetFilesAndFoldersData } from "@/context/fileAndFolderContext";
import { useSetIsLoading } from "@/context/loadingScreenContext";
import { useState } from "react";
import "client-only"

export default function RenameModel(props: {
    cancelBtnFunc: () => void,
    id: string,
    type: string,
    defaultName: string
}) {


    const [name, setName] = useState(props.defaultName);
    const setFolderData: any = useSetFilesAndFoldersData();
    const setIsLoading = useSetIsLoading();







    async function renameBtnFunc() {
        if (name === "")
            return;

        // if (typeof window === "undefined") return

        setIsLoading(true);



        const data: any = await fetch(`/api/${props.type.toLowerCase()}`, {
            method: "PATCH",
            headers: {
                "Authentication": `Bearer ${localStorage.getItem('apCloudAccessToken')}`
            },
            body: JSON.stringify({
                id: props.id,
                name
            })
        }).then(res => res.json());


        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
        if (data.err) {

            if (data.err.meta.target === "FilesAndFolders_parent_name_key")
                alert("Name Already Exists");
            // console.log(data.err)
            return;
        }

        setFolderData((pre: any) => pre.map((element: any) => {

            if (element.id === props.id)
                element.name = name;
            return element

        }));
        props.cancelBtnFunc();

    }


    return <div className="fixed  z-50 top-[50%] w-[90%] max-w-md left-[50%] translate-y-[-50%] translate-x-[-50%] py-5 px-3 rounded-lg shadow-[0_0_0_100vw_#00000099]  bg-white grid gap-2">
        <h1 className="text-center border-b p-4 mb-3 border-b-gray-500 text-3xl font-semibold">Rename </h1>
        <h5 className=" font-medium">New name</h5>
        <input
            value={name}
            onChange={e => { setName(e.target.value) }}
            spellCheck={false}
            className="border w-full  border-gray-300 rounded text-md box-border px-3 py-2 outline-gray-500"

            placeholder="Enter Folder name"

        />
        <div className="flex gap-2 justify-end">

            <button
                className="bg-lime-400    flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium self-end"
                onClick={renameBtnFunc}
            >
                <p>Rename</p>
            </button>
            <button
                className="bg-red-400   flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium self-end"
                onClick={props.cancelBtnFunc}
            >
                <p>Cancel</p>
            </button>
        </div>
    </div>
}