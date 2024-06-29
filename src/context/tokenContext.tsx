import "client-only"
import { JWTUtils } from "@/utils/jwtUtils";
import React, { useContext, useEffect, useState } from "react";


const TokenDataContext = React.createContext({});







export function useTokenData() {
    return useContext(TokenDataContext);
}




export default function TokenProvider(props: any) {

    const [tokenData, setTokenData] = useState({});



    async function refreshAccessToken() {

        const refreshToken: string = String(localStorage.getItem('apCloudRefreshToken'))
        const data = await JWTUtils.refreshAccessToken(refreshToken);

        if (data.err) {

            localStorage.removeItem('apCloudAccessToken')
            localStorage.removeItem('apCloudRefreshToken')


            return;
        }
        localStorage.setItem('apCloudAccessToken', data.accessToken)

        setTokenData(data.data)


    }

    async function veriryToken() {
        if (typeof window === "undefined") return

        const accessToken: string = String(localStorage.getItem('apCloudAccessToken'))
        const data = await JWTUtils.fetchAccessTokenData(accessToken);
        if (data.err) {
            await refreshAccessToken()
            return;
        }

        setTokenData(data)




    }
    useEffect(() => {
        veriryToken();
    }, [])

    return <TokenDataContext.Provider value={tokenData}>
        {props.children}
    </TokenDataContext.Provider>
}