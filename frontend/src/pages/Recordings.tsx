import axios from "axios";
import {useEffect} from "react";
import {useUser} from "@clerk/clerk-react";

export default function Recordings(){
    let userData = useUser();

    async function getVideos(){
        const response =  axios.post("http://localhost:8080/getVideos",{
            id  : userData.user?.id
        })
        console.log(response)
    }
    useEffect(() =>{
      getVideos()
    },[])
    return(
        <div>
            <h1>dabdajd</h1>
        </div>
    )
}