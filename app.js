import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import typeDefsBook from './schemas/Book.js'
import typeDefsUser from './schemas/User.js'
import booksResolvers from './resolvers/books.js'      
import usersResolvers from './resolvers/users.js'

import authenticate  from './middleware/authenticate.js'
import sequelize from './utils/database.js'


const server = new ApolloServer({
  typeDefs: [typeDefsBook, typeDefsUser],
  resolvers: [booksResolvers, usersResolvers],
 
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async({ req }) => {
    // console.log("context")
    const user =  await authenticate(req); 
    // console.log(user)
    return user
  }
})

console.log(`Server ready at: ${url}`)

sequelize.sync({ force: process.env.FORCE_DB_SYNC === "true" })
    .then(() => {
      console.log("Database synchronization successful");
    })
    .catch((error) => {
      console.error("Error synchronizing database:", error);
    });
