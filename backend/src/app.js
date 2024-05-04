import express from "express";
import http from "http"; // Import http module
import { Server } from "socket.io"; // Import Server class from socket.io
import "./DB/mongoose.js";
import userRouter from "./routers/account.js"
import storyRouter from "./routers/story.js"
import followRouter from "./routers/follow.js"
import blockRouter from "./routers/block.js"
import ratingRouter from "./routers/rating.js"
import commentsRouter from "./routers/comments.js"
import listsRouter from "./routers/readingList.js"
import likesRouter from "./routers/likes.js"
import writersRouter from "./routers/writers.js"
import cors from "cors"
import cookieParser from "cookie-parser"

import { findDocument, applyChangesAndBroadcast } from "./routers/io.js";
import Story from "./models/story.js";

const app = express()
const server = http.createServer(app); // Create a server instance
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const port = process.env.PORT

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json())
app.use(cookieParser())

app.use(userRouter)
app.use(storyRouter)
app.use(followRouter)
app.use(blockRouter)
app.use(ratingRouter)
app.use(commentsRouter)
app.use(listsRouter)
app.use(likesRouter)
app.use(writersRouter)

server.listen(port, () => {
    console.log('run on port ' + port)
});

const users = {}
// Socket.io connection logic
io.on("connection", socket => {

    socket.on("joinWritingPage", (user) => {
        users[user] = socket.id
    })
    
    socket.on("get-document", async documentId => {
        const document = await findDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.slide);

        socket.on("send-changes", async delta => {
            applyChangesAndBroadcast(socket, documentId, delta);
        });

        socket.on("save-document", async data => {
            await Story.findByIdAndUpdate(documentId, { slide: data });
        });
    });

    socket.on("remove-user", (userId) => {
        const targetSocket = io.sockets.sockets.get(users[userId]);
        targetSocket?.emit("navigate")
    })

    socket.on("rule-change", ({ userId, rule}) => {
        const targetSocket = io.sockets.sockets.get(users[userId]);
        targetSocket?.emit("changed", rule)
    })
});
