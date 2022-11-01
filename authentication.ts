import { IncomingMessage } from "http";
import url from "url";

import { HOST, HTTP_PORT } from "./constants";
import { User } from "./types";

const defaultUser: User = { name: "John Doe" };

export const authenticateHttp = (request: IncomingMessage) => {
  // Just a dummy method for demonstration.
  if (request.headers["origin"] == `http://${HOST}:${HTTP_PORT}`)
    return defaultUser;
};

export const authenticateWs = (request: IncomingMessage): User | undefined => {
  // Just a dummy method for demonstration.
  const { url: requestUrl = "" } = request;
  const verified =
    url.parse(requestUrl, true).query.token == "definitely_secure_token";
  if (verified) return defaultUser;
};
