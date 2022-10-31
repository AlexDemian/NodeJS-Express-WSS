import express from "express";
import { WebSocketServer } from 'ws';
import { HTTP_PORT, WSS_PORT } from "./constants";

const app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
})

app.listen(HTTP_PORT, () => {
  console.log(`Example app listening on port ${HTTP_PORT}`)
})

const wss = new WebSocketServer({port: WSS_PORT});

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    const message = `received: ${data}`
    ws.send(message);
  });

  ws.send('Connection is ready.');
});
