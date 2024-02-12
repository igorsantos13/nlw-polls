import { Prisma, PrismaClient } from "@prisma/client";
import fastify from "fastify";
import z from "zod";

const app = fastify();
const prisma = new PrismaClient();

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running at port: 3333");
});

app.get("/hello", () => {
  return `hello NLW`;
});

//                              reply =? same as resonse, i guess.
app.post("/polls", async (req, reply) => {
  const createPollBody = z.object({
    title: z.string(),
  });

  const { title } = createPollBody.parse(req.body);

  const poll = await prisma.poll.create({
    data: {
      title,
    },
  });

  return reply.status(201).send({ poolId: poll.id });
});
