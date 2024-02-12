import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function voteOnPoll(app: FastifyInstance) {
  //                              reply =? same as resonse, i guess.
  app.post("/polls/:pollId/votes", async (req, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollOptionId } = voteOnPollBody.parse(req.body);
    const { pollId } = voteOnPollParams.parse(req.params);

    let { sessionId } = req.cookies;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true,
      });
    }

    return reply.status(201).send({ sessionId });
  });
}
