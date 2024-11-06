"use client";

import "client-only";
import { useTokenData } from "@/context/tokenContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateFolderModel from "../Models/CreateFolderModel";
import UploadFileModel from "../Models/UploadFileModel";

export default function NavBar(props: {
  parentId: string;
  searchText: string;
  setSearchText: any;
  openCreateFolderModel: boolean;
  openUploadFileModel: boolean;
  setOpenCreateFolderModel: any;
  setOpenUploadFileModel: any;
}) {
  const [openProfileModel, setOpenProfileModel] = useState(false);

  const router = useRouter();
  const data: any = useTokenData();

  function toggleProfileModel(e: any) {
    e.preventDefault();
    setOpenProfileModel(!openProfileModel);
  }

  function LogoutBtnFunc(e: any) {
    e.stopPropagation();
    localStorage.removeItem("apCloudAccessToken");
    localStorage.removeItem("apCloudRefreshToken");

    router.replace("/auth");
  }

  return (
    <>
      {props.openCreateFolderModel && (
        <CreateFolderModel
          parentId={props.parentId}
          cancelBtnFunc={() => {
            props.setOpenCreateFolderModel(false);
          }}
        />
      )}
      {props.openUploadFileModel && (
        <UploadFileModel
          parentId={props.parentId}
          cancelBtnFunc={() => {
            props.setOpenUploadFileModel(false);
          }}
        />
      )}

      <nav className="px-4 h-30 bg-white md:px-6 py-8 sticky top-0 box-border w-full  z-40">
        <div className=" flex justify-between items-center">
          <h1 className="text-3xl font-bold">FileNest</h1>
          <div className="flex gap-2 items-center">
            <div className="flex  gap-2 text-sm max-md:hidden">
              <input
                value={props.searchText}
                onChange={(e: any) => props.setSearchText(e.target.value)}
                spellCheck={false}
                className="border   border-gray-300 rounded text-md box-border px-3 py-2 outline-gray-500"
                placeholder="Search file ..."
              />
              <button
                className="bg-black text-white   flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium "
                onClick={() => props.setOpenCreateFolderModel(true)}
              >
                <img
                  draggable={false}
                  className="h-[17px]"
                  src="/img/createFolder.png"
                  alt=""
                />
                <p>Create</p>
              </button>
              <button
                className="bg-black text-white   flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium "
                onClick={() => props.setOpenUploadFileModel(true)}
              >
                <img
                  draggable={false}
                  className="h-[15px]"
                  src="/img/upload.png"
                  alt=""
                />
                <p>Upload</p>
              </button>
            </div>

            <div onClick={toggleProfileModel} className=" relative max-md:flex">
              <img
                draggable={false}
                className="w-[30px]"
                src="/img/profile.png"
                alt=""
              />

              {openProfileModel && (
                <div className="absolute bg-white z-10 gap-3  top-full right-0 shadow shadow-gray-500 rounded p-2 flex flex-col mt-2 ">
                  <h1 className="font-semibold text-lg">Profile</h1>
                  <p>{data.email}</p>
                  <button
                    onClick={LogoutBtnFunc}
                    className="bg-black text-white   flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_50px_50px] gap-1 font-semibold mt-3 md:hidden">
          <input
            value={props.searchText}
            onChange={(e: any) => props.setSearchText(e.target.value)}
            spellCheck={false}
            className="border   border-gray-300 rounded text-md box-border px-3 py-2 outline-gray-500"
            placeholder="Search file ..."
          />

          <button
            onClick={() => props.setOpenCreateFolderModel(true)}
            className="bg-black text-white   flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium "
          >
            {" "}
            <img
              draggable={false}
              className="h-[20px]"
              src="/img/createFolder.png"
              alt=""
            />
          </button>

          <button
            onClick={() => props.setOpenUploadFileModel(true)}
            className="bg-black text-white   flex p-2 px-3 gap-2 justify-center items-center rounded-md font-medium "
          >
            {" "}
            <img
              draggable={false}
              className="h-[16px]"
              src="/img/upload.png"
              alt=""
            />
          </button>
        </div>
      </nav>
    </>
  );
}
