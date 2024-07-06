"use client"
import "client-only"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppPage() {


    const router = useRouter();

    useEffect(() => {


        if (!localStorage.getItem('apCloudAccessToken'))
            router.push('auth');

        else
            router.push('/app/home')
    })


    return <></>
}
