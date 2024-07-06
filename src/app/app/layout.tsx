"use client"

import SelectedFileProvider from "@/context/selectedFileContext"


export default function Layout({ children }: { children: any }) {



    return <>
        <SelectedFileProvider>

            {children}

        </SelectedFileProvider>
    </>
}