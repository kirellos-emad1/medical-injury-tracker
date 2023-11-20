import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import prisma from "../lib/prisma";
import { createContext } from "./context";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: ReturnType<typeof createContext>;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.queryType({
  fields: (t) => ({
    ok: t.boolean({
      resolve: () => true,
    }),
  }),
});
builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    injuryLists: t.relation("injuryLists"),
  }),
});
builder.queryField("getUserData", (t) =>
  t.prismaField({
    type: "User",
    resolve: async (query, _parent, _args, ctx) => {
      if (!(await ctx).user) {
        throw new Error("You have to be logged in to perform this action");
      }

      const user = await prisma.user.findUnique({
        ...query,
        where: {
          email: (await ctx).user?.email,
        },
      });

      if (!user) throw Error("User does not exist");

      return user;
    },
  })
);
builder.mutationType({});
