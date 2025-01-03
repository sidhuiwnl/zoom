import {NavLink} from "react-router";
export default function Navbar(){
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
                <NavLink to={"/login"} className="text-sm">
                    Login
                </NavLink>
            </div>
            <div>
                <button className="border-2 border-blue-500 rounded-xl px-4 py-2 text-sm ">Register</button>
            </div>
        </div>
)
}