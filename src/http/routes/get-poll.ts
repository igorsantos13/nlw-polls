import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { redis } from "../../lib/redis";
import { UNABLE_TO_FIND_POSTINSTALL_TRIGGER_JSON_PARSE_ERROR } from "@prisma/client/scripts/postinstall.js";

export async function getPoll(app: FastifyInstance) {
  //                              reply =? same as resonse, i guess.
  app.get("/polls/:pollId", async (req, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(req.params);

    //procura enquete no banco dado um ID unico
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    //retorna uma mensagem caso nao encontre a enquete
    if (!poll) {
      return reply.status(400).send({ message: "Poll not found." });
    }

    //ranking geral de votos
    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES");
    const votes = result.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = result[index++];

        Object.assign(obj, { [line]: Number(score) });
      }

      return obj;
    }, {} as Record<string, number>);

    return reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: option.id in votes ? votes[option.id] : 0,
          };
        }),
      },
    });
  });
}
