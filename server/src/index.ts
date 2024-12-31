import ws from "ws";
import fs from "fs";




const wss = new ws.Server({ port: 8080 });

const videoChunks : Buffer[] = [];

wss.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message",(data) =>{
        if(Buffer.isBuffer(data)){
            videoChunks.push(data)
        }
    })


    socket.on("close", () => {
        console.log("Client disconnected");

        if(videoChunks.length > 0){
            const videoBuffer = Buffer.concat(videoChunks);

            const filePath = "output.webm"
            fs.writeFile(filePath,videoBuffer,(err) =>{
                if (err) {
                    console.error("Error saving video file:", err);
                } else {
                    console.log(`Video saved to ${filePath}`);
                    socket.close();
                }
            })
        }

    });

    socket.on("error", (error) => {
        console.error("WebSocket error:", error);

    });
});

console.log("WebSocket server running on ws://127.0.0.1:8080");
