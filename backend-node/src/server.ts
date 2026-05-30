import http from "http";
import { Server } from "socket.io";
import { app } from "./app";
import { env } from "./config/env";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.allowedOrigins,
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.emit("security:connected", { ok: true });
});

server.listen(env.port, () => {
  console.log(`Security API running on http://localhost:${env.port}`);
});

