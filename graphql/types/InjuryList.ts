// import { builder } from "../builder";

// builder.prismaObject("InjuryList", {
//   fields: (t) => ({
//     id: t.exposeID("id"),
//     reporter: t.exposeString("reporter"),
//     date: t.exposeString("date"),
//     userId: t.exposeString("userId"),
//     injuries: t.relation("injuries"),
//   }),
// });

// builder.queryField("injuryList", (t) =>
//   t.prismaField({
//     type: ["InjuryList"],
//     resolve: (query, _parent, _args, _ctx, _info) =>
//       prisma.injuryList.findMany({ ...query }),
//   })
// );

// builder.mutationField("createInjuryList", (t) =>
//   t.prismaField({
//     type: "InjuryList",
//     args: {
//       reporter: t.arg.string({ required: true }),
//       date: t.arg.string({ required: true }),
//       userId: t.arg.string({ required: true }),
//     },
//     resolve: async (query, _parent, args, ctx) => {
//       const { reporter, date, userId } = args;

//       // check if user found signed in

//       if (!(await ctx).user) {
//         throw new Error("You have to be logged in to perform this action");
//       }
//       // create the injuryList
//       return await prisma.injuryList.create({
//         ...query,
//         data: {
//           reporter,
//           date,
//           userId,
//         },
//       });
//     },
//   })
// );
// builder.mutationField("updateInjuryList", (t) =>
//   t.prismaField({
//     type: "InjuryList",
//     args: {
//       injuryListId: t.arg.string({ required: true }),
//       reporter: t.arg.string(),
//       date: t.arg.string(),
//     },
//     resolve: async (query, _parent, args, _ctx) => {
//       const { injuryListId } = args;

//       try {
//         // Check if the InjuryList exists
//         const existingInjuryList = await prisma.injuryList.findUnique({
//           where: {
//             id: injuryListId,
//           },
//         });

//         if (!existingInjuryList) {
//           throw new Error("Injury not found");
//         }

//         // Updating InjuryList with Id"

//         const updateInjuryList = await prisma.injuryList.update({
//           ...query,
//           where: {
//             id: injuryListId,
//           },
//           data: {
//             reporter: args.reporter ? args.reporter : undefined,
//             date: args.date ? args.date : undefined,
//           },
//         });

//         return updateInjuryList;
//       } catch (error) {
//         console.error("Error Updating InjuryList:", error);
//         throw error; // Re-throw the error to propagate it up
//       }
//     },
//   })
// );

// builder.mutationField("deleteInjuryList", (t) =>
//   t.prismaField({
//     type: "InjuryList",
//     args: {
//       injuryListId: t.arg.string({ required: true }),
//     },
//     resolve: async (query, _parent, args, _ctx) => {
//       const { injuryListId } = args;

//       try {
//         // Find the related injuries
//         const relatedInjuries = await prisma.injury.findMany({
//           where: {
//             injuryListId,
//           },
//         });

//         // Delete the related injuries
//         await Promise.all(
//           relatedInjuries.map(async (injury) => {
//             await prisma.injury.delete({
//               where: {
//                 id: injury.id,
//               },
//             });
//           })
//         );

//         // Delete the InjuryList
//         const deletedInjuryList = await prisma.injuryList.delete({
//           ...query,
//           where: {
//             id: injuryListId,
//           },
//         });

//         return deletedInjuryList;
//       } catch (error) {
//         console.error("Error deleting InjuryList:", error);
//         throw new Error("Failed to delete InjuryList");
//       }
//     },
//   })
// );
