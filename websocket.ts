import { WebSocketServer, RawData, WebSocket } from "ws";
import { authenticateWs } from "./authentication";

type WsMesssageCallback = (ws: WebSocket, data: RawData) => void;

export const wss = new WebSocketServer({
  noServer: true,
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
  wsCallbacks.map((cb) => {
    ws.on("message", (data) => cb(ws, data));
  });
  ws.send("Connection is ready.");
});

const wsCallbacks: WsMesssageCallback[] = [
  (ws, data) => ws.send(`received: ${data}`),
  (ws, data) => console.log(data.toString()),
];
