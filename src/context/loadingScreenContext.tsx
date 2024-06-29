"use client"

import React, { useContext, useState } from 'react'

const LoadingContext = React.createContext(false);
const SetLoadingContext = React.createContext((pre: any) => { });



export function useIsLoading() { return useContext(LoadingContext) }
export function useSetIsLoading() { return useContext(SetLoadingContext) }


export default function LoadingScreenProvider({ children }: { children: any }) {

    const [isLoading, setIsLoading] = useState(false)

    return <LoadingContext.Provider value={isLoading}>
        <SetLoadingContext.Provider value={setIsLoading}>

            {children}

        </SetLoadingContext.Provider>
    </LoadingContext.Provider>
}