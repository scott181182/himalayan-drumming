import { extendType } from "nexus";




export const TagQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.string("tags", {
            resolve: (_, _args, ctx) => ctx.prisma.tag.findMany().then((tag) => tag.map((t) => t.name))
        });
    },
});
