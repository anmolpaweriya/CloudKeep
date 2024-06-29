"use client"

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import FileAndFolderList from "@/components/FileAndFolderList/FileAndFolderList";
import NavBar from "@/components/NavBar/NavBar";
import FilesAndFoldersDataProvider from "@/context/fileAndFolderContext";
import { useIsLoading } from "@/context/loadingScreenContext";
import TokenProvider from "@/context/tokenContext";
import Loading from "@/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home({ params }: { params: { parentId: string } }) {

    const router = useRouter();
    const isLoading = useIsLoading();
    const [searchText, setSearchText] = useState("")




    useEffect(() => {

        if (typeof window !== "undefined" && !localStorage.getItem('apCloudAccessToken'))
            router.push('auth');
    })

    if (isLoading)
        return <Loading />

    return (
        <TokenProvider>
            <FilesAndFoldersDataProvider parent={params.parentId}>


                <NavBar
                    parentId={params.parentId}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />

                <BreadCrumb />

                <FileAndFolderList
                    searchText={searchText}
                    parent={params.parentId}
                />

            </FilesAndFoldersDataProvider>
        </TokenProvider>
    );
}
