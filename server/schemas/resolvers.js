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

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
    }

    const token = signToken (user);

    return { token, user };
},

saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
    if (context.user) {
        return await User.findOneAndUpdate(
{_id: context.user._id },
{
    $addToSet: {
        savedBooks: { bookId, authors, description, title, image, link },
    },
},
{
    new: true,
    runValidators: true,
}
);
}
throw new AuthenticationError('You need to be logged in!');
},
deleteBook: async (parent, { bookId }, context) => {
    if (context.user) {
        return User.findOneAndUpdate(
            { _id: context.user._id },
            {
                $pull: { savedBooks: { bookId } },
            },
            { new: true }
        );
    }
    throw new AuthenticationError('You need to be logged in!');
},
},
};

module.exports = resolvers;