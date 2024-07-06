import React, { useContext, useState } from 'react'


const SelectedFileContext = React.createContext({ files: [] })
const SetSelectedFileContext = React.createContext((pre: any) => pre)




export function useSelectedFiles() { return useContext(SelectedFileContext) }
export function useSetSelectedFiles() { return useContext(SetSelectedFileContext) }

export default function SelectedFileProvider({ children }: { children: any }) {


    const [selectedFiles, setSelectedFiles] = useState({ files: [] })

    console.log(selectedFiles)
    return <SelectedFileContext.Provider value={selectedFiles}>
        <SetSelectedFileContext.Provider value={setSelectedFiles}>


            {children}


        </SetSelectedFileContext.Provider>
    </SelectedFileContext.Provider>
}


