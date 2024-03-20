import { createLocalServer } from './server.js'

const server = createLocalServer();

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});