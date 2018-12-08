const express = require('express');
const projectDb = require('./data/helpers/projectModel.js')

const server = express();
const PORT = 1010;

server.get('/projects', (req, res) => {
    projectDb.get()
        .then(projects => {
            res.json(projects)
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to load projects' })
        })
})

server.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`)
})