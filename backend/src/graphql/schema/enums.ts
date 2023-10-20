import { extendType } from "nexus";



export const EnumQueries = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.string("castes", {
            resolve(_, _args, ctx) {
                return ctx.prisma.caste.findMany().then((res) => res.map((c) => c.name));
            }
        });
        t.nonNull.list.string("genders", {
            resolve(_, _args, ctx) {
                return ctx.prisma.gender.findMany().then((res) => res.map((g) => g.name));
            }
        });
    },
});