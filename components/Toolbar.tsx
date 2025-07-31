'use client'

import { signIn } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export function Signin(){
    const {data: session, status} = useSession() 
    if (status == "authenticated"){
        return (
            <div>
                <button onClick={() => signOut({callbackUrl: '/'})}
                className="px-4 py-2 bg-blue-200 text-blue-800 rounded transition-colors duration-200 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow">
                    Sign out
                </button>
            </div>
        )
    }
    return(
        <div>
            <button onClick={() => signIn(undefined, { callbackUrl: '/account/dashboard' })}
                className="px-4 py-2 bg-blue-200 text-blue-800 rounded transition-colors duration-200 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow">
                    Sign in
            </button>
        </div>
    )
    
}

export default function Toolbar(){
    return (
        <header className="w-full bg-blue-200 shadow flex items-start justify-between px-6 py-4">
            <div className=" text-xl font-bold text-blue-800">
                <img src="/logo2.png" alt="Smart Planner Logo" className="h-8 w-8" />
            </div>
            <div className="text-blue-900 font-bold text-3xl">
                Smart Planner
            </div>
            <div>
                <Signin/>
            </div>
        </header>
    );
}