const express = require('express');
const projectRouter = require('./routers/projectRouter.js');
const actionRouter = require('./routers/actionRouter.js');

const server = express();
const PORT = 1010;

server.use(express.json());

server.use('/projects', projectRouter);
server.use('/actions', actionRouter);

server.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`)
})