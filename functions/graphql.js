const { createLambdaServer } = require('./bundle/server')
// import { createLambdaServer } from './bundle/server'

const server = createLambdaServer();

exports.handler = server.createHandler({
  cors: {
    origin: '*'
  }
});