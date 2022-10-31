import { WebSocketServer, RawData, WebSocket } from "ws";
import { WSS_PORT } from "./constants";

type WsMesssageCallback = (ws: WebSocket, data: RawData) => void

const wss = new WebSocketServer({port: WSS_PORT});

wss.on('connection', function connection(ws) {
    wsCallbacks.map((cb) => {
        ws.on('message', (data) => cb(ws, data))
    })
    ws.send('Connection is ready.');
});

const wsCallbacks: WsMesssageCallback[] = [
    (ws, data) => ws.send(`received: ${data}`),
    (ws, data) => console.log(data.toString())
]