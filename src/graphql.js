const { createLambdaServer } = require('./serverserver')
// import { createLambdaServer } from './bundle/server'

const server = createLambdaServer();

exports.handler = server.createHandler({
  cors: {
    origin: '*'
  }
});