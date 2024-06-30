import React, { useState } from 'react'


const SelectedFileContext = React.createContext([])
const SetSelectedFileContext = React.createContext(() => { })




export default function SelectedFileProvider({ children }: { children: any }) {


    const [selectedFiles, setSelectedFiles] = useState([])

    return <SelectedFileContext.Provider value={selectedFiles}>

        {children}
    </SelectedFileContext.Provider>
}


