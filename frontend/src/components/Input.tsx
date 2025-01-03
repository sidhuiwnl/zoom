import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react"
import axios from "axios"

export default function InputDemo() {
    const [link,setLink] = useState("");

    async function sendLink(){
        await axios.post("http://localhost:3000/getMeetId",{
            link: link,
        })
    }
    return (
        <div className=" space-y-4 w-[500px] h-[150px] p-3">
            <Label htmlFor="input-21" className="text-white">Add Meet Link</Label>
            <div className="flex rounded-lg shadow-sm shadow-black/5 bg ">
                <Input
                    onChange={(e) => {
                        e.preventDefault();
                        setLink(e.target.value)}}
                    id="input-21"
                    className="-me-px flex-1 rounded-e-none bg-black text-white placeholder:text-white focus:border-white border-neutral-800 shadow-none focus-visible:z-10 "
                    placeholder="Meet Link.."
                    type="email"
                />
                <button
                    onClick={sendLink}
                    className="inline-flex items-center rounded-e-lg border border-neutral-800 placeholder:text-white hover:bg-neutral-900 hover:text-white text-white bg-black border-input  px-3 text-sm font-medium text-foreground outline-offset-2 transition-colors hover:bg-accent hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50">
                    Send
                </button>
            </div>
        </div>
    );
}
