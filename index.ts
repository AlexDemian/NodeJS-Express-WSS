import express from "express";
import http from "http";
import { authenticateHttp } from "./authentication";

import { HTTP_PORT } from "./constants";
import { wss } from "./websocket";

const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const server = http.createServer(app).listen(HTTP_PORT);

server.on("upgrade", function upgrade(request, socket, head) {
  const authenticated = authenticateHttp(request);

  if (!authenticated) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request, socket);
  });
});
