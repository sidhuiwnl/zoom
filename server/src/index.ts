import ws from "ws";
import express from "express";
import cors from "cors";
import * as http from "node:http";
import {createRouteHandler} from "uploadthing/express";
import { uploadRouter } from "./uploadthing";
import { UTApi } from "uploadthing/server";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(
    "/api/uploadthing",
    createRouteHandler({
        router: uploadRouter,
        config : {
            token : process.env.UPLOADTHING_TOKEN
        }
    }),
);
app.use(cors());



const server = http.createServer(app);

const wss = new ws.Server({server });

const utapi = new UTApi();

const videoChunks : Buffer[] = [];

wss.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message",(data) =>{
        if(Buffer.isBuffer(data)){
            videoChunks.push(data)
        }
    })


    socket.on("close",  async() => {
        console.log("Client disconnected");

        if(videoChunks.length > 0){
            const videoBuffer = Buffer.concat(videoChunks);

            try {
                const videoBlob = new Blob([videoBuffer], {
                    type : "video/webm"
                })

                const videoFile = new File([videoBlob], "output.webm", {
                    type: "video/webm",
                });
                const response = await utapi.uploadFiles([videoFile])
                console.log("Uploaded file details:", response);
                socket.close()
            }catch (error){
                console.error("Error uploading video:", error);
            }

        }

    });

    socket.on("error", (error) => {
        console.error("WebSocket error:", error);

    });
});



server.listen(8080,() =>{
    console.log("WebSocket server running on port 8080");
})