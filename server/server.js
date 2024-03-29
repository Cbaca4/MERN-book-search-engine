const express = require('express');
const {apolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDef, resolvers } = require('./schemas');
const db = require('./config/connection');

const routes = require('./routes');
const PORT = process.env.PORT || 3001;
const app = express();
const server = new apolloServer({
  typeDef,
  resolvers,
  context: authMiddleware,
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const StartApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => {
console.log(`API Server running on port ${PORT}!`);
console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

StartApolloServer();

