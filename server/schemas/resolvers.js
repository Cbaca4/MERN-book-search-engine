const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findById({ __id: context.user.__id }).populate("savedBooks");
                return userData;
            }
            throw new AuthenticationError("Not logged in");
        },
    },

    Mutation: {
        addUSer: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
    },
login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AuthenticationError('No user found with this email address');
    }
}
}