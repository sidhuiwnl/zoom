

import {NavLink} from "react-router";
import {SignedIn, SignedOut, SignUpButton, UserButton} from "@clerk/clerk-react";
import {useUser} from "@clerk/clerk-react";
import {useEffect} from "react";
import axios from "axios";

export default function Navbar(){
    const user = useUser();
    const userDetails = {
        id : user.user?.id,
        firstName : user.user?.firstName,
        lastName : user.user?.lastName,
        email : user.user?.emailAddresses[0].emailAddress,
        image : user.user?.imageUrl
    }
    async function addUser(){
        if(user){
            const response = await axios.post("http://localhost:8080/addUser", userDetails);
            console.log(response)
        }
    }
    useEffect(() =>{
        addUser()
    },[user])
    return(
        <div className="flex items-center justify-between px-4 py-10 ">
            <h1 className="text-sm underline">Surge</h1>
            <div className="flex gap-6">
                <NavLink to={"/login"} className="text-sm">
                    About
                </NavLink>
                <NavLink to={"/Add"} className="text-sm">
                    Meet
                </NavLink>
                <NavLink to={"/Recordings"} className="text-sm">
                    Recordings
                </NavLink>
            </div>
            <div>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
                <SignedOut>
                    <SignUpButton>
                        <button className="border-2 border-blue-500 rounded-xl px-4 py-2 text-sm ">Register</button>
                    </SignUpButton>
                </SignedOut>


            </div>
        </div>
    )
}