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

builder.prismaObject("Injury", {
  fields: (t) => ({
    id: t.exposeID("id"),
    area: t.exposeString("area"),
    description: t.exposeString("description"),
    injuryListId: t.exposeString("injuryListId"),
  }),
});

builder.mutationField("createInjury", (t) =>
  t.prismaField({
    type: "Injury",
    args: {
      area: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      injuryListId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { area, description, injuryListId } = args;
      // check if user found signed in

      if (!(await ctx).user) {
        throw new Error("You have to be logged in to perform this action");
      }
      // create the injury

      const createdInjury = await prisma.injury.create({
        ...query,
        data: {
          area,
          description,
          injuryListId,
        },
      });
      return createdInjury;
    },
  })
);

builder.mutationField("updateInjury", (t) =>
  t.prismaField({
    type: "Injury",
    args: {
      injuryId: t.arg.string({ required: true }),
      area: t.arg.string(),
      description: t.arg.string(),
    },
    resolve: async (query, _parent, args, _ctx) => {
      const { injuryId } = args;

      try {
        // Check if the Injury exists
        const existingInjury = await prisma.injury.findUnique({
          where: {
            id: injuryId,
          },
        });

        if (!existingInjury) {
          throw new Error("Injury not found");
        }

        // Updating Injury with Id"

        const updateInjury = await prisma.injury.update({
          ...query,
          where: {
            id: injuryId,
          },
          data: {
            area: args.area ? args.area : undefined,
            description: args.description ? args.description : undefined,
          },
        });

        return updateInjury;
      } catch (error) {
        console.error("Error deleting Injury:", error);
        throw error; // Re-throw the error to propagate it up
      }
    },
  })
);

builder.mutationField("deleteInjury", (t) =>
  t.prismaField({
    type: "Injury",
    args: {
      injuryId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _ctx) => {
      const { injuryId } = args;

      try {
        // Check if the Injury exists
        const existingInjury = await prisma.injury.findUnique({
          where: {
            id: injuryId,
          },
        });

        if (!existingInjury) {
          throw new Error("Injury not found");
        }

        // Deleting Injury with Id"

        // Delete the Injury
        const deletedInjury = await prisma.injury.delete({
          ...query,
          where: {
            id: injuryId,
          },
        });

        return deletedInjury;
      } catch (error) {
        console.error("Error deleting Injury:", error);
        throw error; // Re-throw the error to propagate it up
      }
    },
  })
);

builder.prismaObject("InjuryList", {
  fields: (t) => ({
    id: t.exposeID("id"),
    reporter: t.exposeString("reporter"),
    date: t.exposeString("date"),
    userId: t.exposeString("userId"),
    injuries: t.relation("injuries"),
  }),
});

builder.queryField("injuryList", (t) =>
  t.prismaField({
    type: ["InjuryList"],
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.injuryList.findMany({ ...query }),
  })
);

builder.mutationField("createInjuryList", (t) =>
  t.prismaField({
    type: "InjuryList",
    args: {
      reporter: t.arg.string({ required: true }),
      date: t.arg.string({ required: true }),
      userId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { reporter, date, userId } = args;

      // check if user found signed in

      if (!(await ctx).user) {
        throw new Error("You have to be logged in to perform this action");
      }
      // create the injuryList
      return await prisma.injuryList.create({
        ...query,
        data: {
          reporter,
          date,
          userId,
        },
      });
    },
  })
);
builder.mutationField("updateInjuryList", (t) =>
  t.prismaField({
    type: "InjuryList",
    args: {
      injuryListId: t.arg.string({ required: true }),
      reporter: t.arg.string(),
      date: t.arg.string(),
    },
    resolve: async (query, _parent, args, _ctx) => {
      const { injuryListId } = args;

      try {
        // Check if the InjuryList exists
        const existingInjuryList = await prisma.injuryList.findUnique({
          where: {
            id: injuryListId,
          },
        });

        if (!existingInjuryList) {
          throw new Error("Injury not found");
        }

        // Updating InjuryList with Id"

        const updateInjuryList = await prisma.injuryList.update({
          ...query,
          where: {
            id: injuryListId,
          },
          data: {
            reporter: args.reporter ? args.reporter : undefined,
            date: args.date ? args.date : undefined,
          },
        });

        return updateInjuryList;
      } catch (error) {
        console.error("Error Updating InjuryList:", error);
        throw error; // Re-throw the error to propagate it up
      }
    },
  })
);

builder.mutationField("deleteInjuryList", (t) =>
  t.prismaField({
    type: "InjuryList",
    args: {
      injuryListId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _ctx) => {
      const { injuryListId } = args;

      try {
        // Find the related injuries
        const relatedInjuries = await prisma.injury.findMany({
          where: {
            injuryListId,
          },
        });

        // Delete the related injuries
        await Promise.all(
          relatedInjuries.map(async (injury) => {
            await prisma.injury.delete({
              where: {
                id: injury.id,
              },
            });
          })
        );

        // Delete the InjuryList
        const deletedInjuryList = await prisma.injuryList.delete({
          ...query,
          where: {
            id: injuryListId,
          },
        });

        return deletedInjuryList;
      } catch (error) {
        console.error("Error deleting InjuryList:", error);
        throw new Error("Failed to delete InjuryList");
      }
    },
  })
);

builder.mutationType({});
