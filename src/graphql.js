const { createLambdaServer } = require('./server')
// import { createLambdaServer } from './bundle/server'

const server = createLambdaServer();

exports.handler = server.createHandler({
  cors: {
    origin: '*'
  }
});