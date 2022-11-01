import fs from "fs";
import path from "path";
import { WebSocketServer, RawData, WebSocket } from "ws";
import { authenticateWs } from "./authentication";
import { fromBuffer } from "file-type";
import { v4 as uuid } from "uuid";
import { WSS_MAX_SIZE_MB } from "./constants";

type WsMesssageCallback = (ws: WebSocket, data: RawData) => void;

export const wss = new WebSocketServer({
  noServer: true,
  maxPayload: 1024 * 1024 * WSS_MAX_SIZE_MB,
  verifyClient: ({ req }, cb) => {
    const authenticated = authenticateWs(req);
    if (!authenticated) {
      cb(false, 401, "Unauthorized");
      return;
    }
    cb(true);
  },
});

wss.on("connection", function connection(ws) {
  ws.on("message", (data, isBinary) => {
    const callbacks = isBinary ? wsBinaryCallbacks : wsTextCallbacks;
    callbacks.map((cb) => cb(ws, data));
  });

  ws.send("Connection is ready.");
});

const wsTextCallbacks: WsMesssageCallback[] = [
  (ws, data) => ws.send(`received: ${data}`),
  (ws, data) => console.log(data.toString()),
];

const fileUpload: WsMesssageCallback = async (ws, data) => {
  const buffer = Buffer.from(data as ArrayBuffer);
  const { ext = "undefined" } = (await fromBuffer(buffer)) || {};
  const fname = uuid() + `.${ext}`;

  fs.writeFileSync(path.join("uploads", fname), buffer);
  ws.send(`received file: ${fname}`);
};

const wsBinaryCallbacks: WsMesssageCallback[] = [fileUpload];
