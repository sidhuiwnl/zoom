import { NavLink } from "react-router";
import rdr2 from "../../public/videoplayback.mp4"

export default function HomeSection() {
    return(
        <div className="flex flex-col justify-between items-center py-20 space-y-7">
            <h1 className="text-7xl tracking-tight">The Meeting Bot You Need.</h1>
            <p className="text-neutral-300">Surge Bot let's you record the meeting and transcribe the Meet</p>
            <NavLink to={"/Add"} className="text-sm bg-blue-700 rounded-xl px-4 py-2 ">
                Access
            </NavLink>
            <VideoMonitor/>
        </div>
    )
}

function VideoMonitor() {
    return (
        <div className="w-[900px] h-[400px] object-cover rounded-xl shadow-xl bg-white">
            <div className="w-full h-full">
                <video
                    className="w-full h-full rounded-xl object-cover"
                    src={rdr2}
                    autoPlay
                    loop={true}
                    muted
                ></video>
            </div>
        </div>
    );
}