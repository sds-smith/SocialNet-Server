

const resolvers = {
    Query: {
        greeting: (_root, _args, { message }) => message
    }
}

export { resolvers };