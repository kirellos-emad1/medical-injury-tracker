import { builder } from "../builder";

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
