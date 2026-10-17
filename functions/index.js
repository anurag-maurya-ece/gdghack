import { onRequest } from "firebase-functions/v2/https";

export const health = onRequest({ maxInstances: 2 }, (request, response) => {
  if (request.method !== "GET") return response.status(405).json({ error: "method-not-allowed" });
  response.json({ service: "tech-thela", status: "ok" });
});
