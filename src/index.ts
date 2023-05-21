import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AuthUser, withPolicy } from "@zenstackhq/runtime";
import { PrismaClient } from "@prisma/client";

const typeDefs = readFileSync("./schema.graphql", "utf8");

const prisma = new PrismaClient();

function createZenstack(authUser: AuthUser) {
    return withPolicy(prisma, { user: authUser });
}

export async function createContext({ req, res }) {
    const userId = req.header("X-USER-ID");
    if (!userId || Number.isNaN(parseInt(userId))) {
        res.status(403).json({ error: "unauthorized" });
    }

    const user = { id: parseInt(userId) };
    return {
        prisma: createZenstack(user),
        currentUser: user,
    };
}

const resolvers = {
    Query: {
        posts: (parent, args, contextValue, info) => {
            return contextValue.prisma.post.findMany();
        },
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: createContext,
});

console.log(`🚀  Server ready at: ${url}`);
