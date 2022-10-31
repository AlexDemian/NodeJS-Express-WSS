import http from "http";
import url from "url";

import { HOST, HTTP_PORT } from "./constants";

export const authenticateHttp = (request: http.IncomingMessage) => {
  // Just a dummy method for demonstration.
  return request.headers["origin"] == `http://${HOST}:${HTTP_PORT}`;
};

export const authenticateWs = (request: http.IncomingMessage) => {
  // Just a dummy method for demonstration.
  const { url: requestUrl = "" } = request;
  return url.parse(requestUrl, true).query.token == "definitely_secure_token";
};
