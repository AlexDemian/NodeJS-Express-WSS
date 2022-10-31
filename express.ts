import express from "express";
import { HTTP_PORT } from "./constants";

const app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
})

app.listen(HTTP_PORT, () => {
  console.log(`Example app listening on port ${HTTP_PORT}`)
})