import { useFolderPath, useSetFilesAndFoldersData } from "@/context/fileAndFolderContext";
import { useVerifyTokenFunc } from "@/context/tokenContext";
import { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";




export default function UploadFileModel(props: {
    cancelBtnFunc: () => void,
    parentId: string
}) {




    const [files, setFiles] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uplaodingFileIndex, setUplaodingFileIndex] = useState(-1)
    const progressBarRef: any = useRef();
    const setFilesAndFoldersData: any = useSetFilesAndFoldersData();
    const path: any = useFolderPath();
    const verifyToken: any = useVerifyTokenFunc();




    // functions 


    function removeFileFromList(index: number) {

        setFiles(pre => pre.filter((e, i: number) => i != index))
    }



    function onChangeFilesInput(e: any) {
        setFiles((pre: any) => [...Array.from(e.target.files).map((file: any) => {
            return {
                file,
                fileName: (file.path || file.name),
                uploaded: false
            }
        }), ...pre])

    }


    function convertSizeString(bytes: number) {

        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
        if (bytes < 1024 * 1024 * 1024) return `${Math.round(bytes / 1024 / 1024)} MB`
        return `${Math.round(bytes / 1024 / 1024 / 1024)} GB`
    }


    function onChangeFileName(name: string, indexToChange: number) {
        setFiles((pre: any) => {

            return pre.map((file: any, index: number) => {
                if (index === indexToChange)
                    file.fileName = name

                return file;
            })
        })


    }



    function setProgressBar(percentage: number) {
        progressBarRef.current.style.width = `${percentage}%`
    }

    function startUploadingFunc() {
        setIsUploading(true)
        setUplaodingFileIndex(0);
        uploadingFilesList();
    }


    async function uploadingFilesList() {


        for (let fileIndex in files)
            await uploadFile(Number(fileIndex))


        setIsUploading(false)
        setFiles([]);



    }


    async function uploadFile(fileIndex: number) {



        return new Promise((res) => {




            const formData = new FormData();

            formData.append("fileName", files[fileIndex].fileName)
            formData.append("file", files[fileIndex].file);
            formData.append("parent", props.parentId);
            formData.append('parentPath', path);


            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event: any) => {

                const percentage = event.loaded / event.total * 100;

                setProgressBar(percentage)
            }


            xhr.onload = () => {

                const data = JSON.parse(xhr.response)
                // console.log(data)
                if (data.success)
                    setFilesAndFoldersData((pre: any) => {
                        const isExists = pre.find((element: any) => element.uid === data.data.uid)
                        if (isExists) return pre
                        return [...pre, data.data]
                    })
                setFiles(pre => pre.map((file, index: number) => {
                    if (index === fileIndex) {
                        file.uploaded = true
                    }
                    return file

                }))
                res("done")
            }

            xhr.open("PUT", "/api/file", true);
            xhr.setRequestHeader('Authentication', `Bearer ${localStorage.getItem('apCloudAccessToken')}`);


            xhr.send(formData)
        })



    }



    if (isUploading)
        return <div
            className="fixed  z-50 top-[50%] w-[90%] max-w-md left-[50%] translate-y-[-50%] translate-x-[-50%] py-5 px-3 rounded-lg shadow-[0_0_0_100vw_#00000099]  bg-white grid gap-2"
        >

            <h1 className="text-3xl font-semibold m-2">Uploading</h1>
            <hr className="bg-gray-400 m-2" />
            <div className="grid gap-1 my-2 overflow-y-scroll max-h-56">
                {files.map((file: any, index: number) => {
                    if (uplaodingFileIndex != -1 && files[uplaodingFileIndex].uploaded)
                        if (uplaodingFileIndex === files.length - 1)
                            setUplaodingFileIndex(-1);
                        else if (index === uplaodingFileIndex + 1)
                            setUplaodingFileIndex(index);


                    return <div
                        className={`border-2 gap-1 rounded max-h-64 p-2 pb-1 border-gray-700 flex flex-col ${file.uploaded ? "pb-2 bg-black text-white" : ""}  `}
                        key={index}
                    >
                        <div className="grid grid-cols-[auto_4em] w-full items-center">

                            <h3 className="text-lg font-medium w-full">{file.fileName}</h3>
                            <p className="text-xs font-semibold text-center">{convertSizeString(file.file.size)}</p>
                        </div>

                        {uplaodingFileIndex === index
                            ?

                            <div className="w-full h-2 items-center" >
                                <div ref={progressBarRef} className="transition-all bg-blue-400 h-full rounded-3xl w-0"  ></div>
                            </div>
                            : <></>
                        }
                    </div>
                })}
            </div>


        </div >





    return <div className="fixed  z-50 top-[50%] w-[90%] max-w-md left-[50%] translate-y-[-50%] translate-x-[-50%] py-5 px-3 rounded-lg shadow-[0_0_0_100vw_#00000099]  bg-white grid gap-2">

        <label className="w-full h-[200px] border-dashed border-2 flex flex-col justify-center items-center rounded-lg border-gray-500">
            <input
                multiple
                type="file"
                onChange={onChangeFilesInput}
                className="hidden" />

            <FiUploadCloud className="text-8xl" />

            <h3 className="text-xl font-semibold"> Upload</h3>

        </label>

        <div className="grid gap-1 my-2 overflow-y-scroll max-h-56">
            {files.map((file: any, index: number) => {
                return <div
                    className="border grid grid-cols-[4em_auto_2em] rounded"
                    key={index}
                >
                    <div className="py-2 w-full bg-black text-white rounded-l text-xs text-center">{convertSizeString(file.file.size)}</div>
                    <input
                        type="text" value={file.fileName}
                        onChange={(e: any) => onChangeFileName(e.target.value, index)}
                        className="px-2 outline-none" />
                    <button className="bg-red-500 text-white rounded-r flex justify-center items-center text-lg"
                        onClick={() => removeFileFromList(index)}
                    ><MdDeleteOutline /></button>
                </div>

            })}
        </div>

        {files.length
            ?

            <button
                className="bg-blue-400 flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium self-end"
                onClick={startUploadingFunc}
            >
                <p>Upload</p>
            </button>

            :
            <></>
        }

        <button
            className="bg-black text-white   flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium self-end"
            onClick={props.cancelBtnFunc}
        >
            <p>Cancel</p>
        </button>

    </ div>
}