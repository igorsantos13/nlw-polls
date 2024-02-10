import fastify from "fastify";

const app = fastify();

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running at port: 3333");
});

app.get("/hello", () => {
  return `hello NLW`;
});
