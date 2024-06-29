
"use client"

import "client-only"
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function AuthPage() {

    const [section, setSection] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [description, setDescription] = useState({ type: '', message: '' })

    const router = useRouter();




    function changeSectionBtnFunc(e: any) {
        e.preventDefault();
        if (isProcessing) return;

        setEmail('');
        setPassword('')
        if (section === 'Login')
            setSection('Sign up')
        else
            setSection('Login')

    }

    async function authFunc(e: any) {
        e.preventDefault();

        let api = '/api/auth/login';
        if (section !== 'Login')
            api = '/api/auth/signup';


        setIsProcessing(true);

        const data = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }).then(res => res.json());
        setTimeout(() => {

            setIsProcessing(false);
        }, 100);


        if (data.err) {
            setDescription({ type: 'Error', message: data.err })
            return
        }
        if (data.success)
            setDescription({ type: 'Success', message: data.success })



        localStorage.setItem('apCloudAccessToken', data.accessToken);
        localStorage.setItem('apCloudRefreshToken', data.refreshToken);


        router.replace('/')

    }



    return <div className="w-vw h-svh flex justify-center items-center bg-gray-100 ">
        <form onSubmit={authFunc} className="w-full box-border max-w-md shadow-xl rounded-md py-7 px-5 bg-white mx-5">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">{section}</h1>
                <p className="text-gray-500 text-sm">
                    {
                        section == 'Login'
                            ?
                            "Enter your email and password to access your account"
                            :
                            "Enter your email and create a new password"

                    }

                </p>
            </div>
            {
                description.type !== '' &&
                <div className={`${description.type == 'Error' ? 'bg-red-200' : 'bg-lime-200'} p-2 rounded mt-5 text-sm font-medium text-gray-600 `}> {description.message}</div>
            }

            <div className={`${description.message === '' ? 'mt-10' : 'mt-5'} mb-5 w-full box-border grid gap-3`}>

                <div className="w-full grid gap-2">
                    <label htmlFor="emailInputId" className="font-medium text-sm">Email</label>


                    <input
                        id="emailInputId"
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value) }}
                        spellCheck={false}
                        className="border w-full border-gray-300 rounded text-md box-border px-3 py-2 outline-gray-500"
                        required
                        placeholder="johndoe@email.com"

                    />

                </div>
                <div className="w-full grid gap-2">
                    <div className="flex font-medium text-sm justify-between">

                        <label htmlFor="passwordInputId" >Password</label>
                        {
                            section === 'Login'
                            &&
                            <button className="text-gray-400 hover:underline"
                                onClick={e => e.preventDefault()}
                            >
                                Forgot Password ?
                            </button>
                        }
                    </div>


                    <input
                        id="passwordInputId"
                        type="password"
                        value={password}
                        onChange={e => { setPassword(e.target.value) }}
                        spellCheck={false}
                        className="border w-full border-gray-300 rounded text-md box-border px-3 py-2 outline-gray-500"
                        required

                    />

                </div>
            </div>


            <button
                className="bg-black rounded-md font-medium p-2 text-center text-white w-full flex justify-center items-center gap-2 "

                onClick={e => {
                    isProcessing && e.preventDefault();
                }}
            >
                {
                    isProcessing
                        ?
                        <svg
                            className="h-[1.5em]"
                            viewBox="0 0 200 200"><circle fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>

                        :
                        section
                }
            </button>


            <p className="mt-10 text-sm ">Don&apos;t have an account? <button className="font-medium text-gray-900 hover:underline "
                onClick={changeSectionBtnFunc}
            >{section === 'Login' ? 'Sign up' : 'Login'}</button></p>


        </form>


    </div>
}