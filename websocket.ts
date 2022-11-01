import { fromBuffer } from "file-type";
import fs from "fs";
import { IncomingMessage } from "http";
import path from "path";
import { v4 as uuid } from "uuid";
import { RawData, WebSocket, WebSocketServer } from "ws";
import { authenticateWs } from "./authentication";
import { WSS_MAX_SIZE_MB } from "./constants";
import { User } from "./types";

type WsRequest = IncomingMessage & { user: User };
type WsMesssageCallback = (
  ws: WebSocket,
  req: WsRequest,
  data: RawData
) => void;

export const wss = new WebSocketServer({
  noServer: true,
  maxPayload: 1024 * 1024 * WSS_MAX_SIZE_MB,

  verifyClient: ({ req }, cb) => {
    const user = authenticateWs(req);
    if (!user) {
      cb(false, 401, "Unauthorized");
      return;
    }
    // @ts-ignore
    req.user = user;
    cb(true);
  },
});

wss.on("connection", function connection(ws, req: WsRequest) {
  ws.on("message", (data, isBinary) => {
    const callbacks = isBinary ? wsBinaryCallbacks : wsTextCallbacks;
    callbacks.map((cb) => cb(ws, req, data));
  });

  ws.send("Connection is ready.");
});

const wsTextCallbacks: WsMesssageCallback[] = [
  (ws, { user }, data) => ws.send(`received message from ${user.name}: ${data}`),
  (ws, { user }, data) => console.log(user, data.toString()),
];

const fileUpload: WsMesssageCallback = async (ws, { user }, data) => {
  const buffer = Buffer.from(data as ArrayBuffer);
  const { ext = "undefined" } = (await fromBuffer(buffer)) || {};
  const fname = uuid() + `.${ext}`;

  fs.writeFileSync(path.join("uploads", fname), buffer);
  ws.send(`user ${user.name} shared file: ${fname}`);
};

const wsBinaryCallbacks: WsMesssageCallback[] = [fileUpload];
