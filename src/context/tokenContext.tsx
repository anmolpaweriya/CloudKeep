"use client"

import "client-only"
import { JWTUtils } from "@/utils/jwtUtils";
import React, { useContext, useEffect, useState } from "react";


const TokenDataContext = React.createContext({});
const VerifyTokenDataContext = React.createContext(() => { });







export function useTokenData() {
    return useContext(TokenDataContext);
}

export function useVerifyTokenFunc() {
    return useContext(VerifyTokenDataContext);
}



export default function TokenProvider(props: any) {

    const [tokenData, setTokenData] = useState({});



    async function refreshAccessToken() {

        const refreshToken: string = String(localStorage.getItem('apCloudRefreshToken'))
        const data = await JWTUtils.refreshAccessToken(refreshToken);

        if (data.err) {

            localStorage.removeItem('apCloudAccessToken')
            localStorage.removeItem('apCloudRefreshToken')


            return data;
        }
        localStorage.setItem('apCloudAccessToken', data.accessToken)

        setTokenData(data.data)

        return data

    }

    async function veriryToken() {


        const accessToken: string = String(localStorage.getItem('apCloudAccessToken'))
        const data = await JWTUtils.fetchAccessTokenData(accessToken);
        if (data.err) {
            return await refreshAccessToken()

        }

        setTokenData(data)

        return data;

    }
    useEffect(() => {
        veriryToken();
    }, [])

    return <TokenDataContext.Provider value={tokenData}>
        <VerifyTokenDataContext.Provider value={veriryToken}>

            {props.children}

        </VerifyTokenDataContext.Provider>
    </TokenDataContext.Provider>
}