import fastify from "fastify";
import z from "zod";
import { createPoll } from "./routes/create-poll";

const app = fastify();
app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running at port: 3333");
});

app.register(createPoll);

app.get("/hello", () => {
  return `hello NLW`;
});
