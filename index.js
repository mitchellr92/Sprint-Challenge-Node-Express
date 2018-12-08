const express = require('express');
const projectDb = require('./data/helpers/projectModel.js')

const server = express();
const PORT = 1010;

server.use(express.json());

server.get('/projects', (req, res) => {
    projectDb.get()
        .then(projects => {
            res.json(projects)
        })
        // Did not work without anonymous function
        .catch(err => {
            res.status(500).json({ message: 'Failed to load projects' })
        })
})

server.get('/projects/:id', (req, res) => {

    const { id } = req.params;

    projectDb.get(id)
        .then(project => {
            if (project) {
                res.json(project)
            } else {
                res.status(404).json({ message: 'Porject with specified ID does not exoist' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to load project' })
        })
})

server.post('/projects', (req, res) => {

    const project = req.body;

    if (project.name && project.description) {
        projectDb.insert(project)
            .then(idInfo => {
                projectDb.get(idInfo.id).then(project => {
                    res.status(201).json(project)
                })
            })
            .catch(err => {
                res.status(500).json({ message: 'Failed to insert project' })
            })
    } else {
        res.status(400).json({
            message: 'Missing name or description'
        })
    }
})

server.delete('/projects/:id', (req, res) => {

    const { id } = req.params;
    const project = req.body;

    projectDb.remove(id)
        .then(count => {
            if (count) {
                res.json(project)
            } else {
                res.status(404).json({ message: 'Porject with specified ID does not exist' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to delete project' })
        })
})

server.put('/projects/:id', (req, res) => {

    const { id } = req.params;
    const project = req.body;

    if (project.name && project.description) {
        projectDb.update(id, project)
            .then(project => {
                if (id) {
                    res.json({ message: 'Project has been updated' })
                } else {
                    res.status(404).json({ message: 'The project with the specified ID does not exist' })
                }
            })
            .catch(err => {
                res.status(500).json({ message: 'Failed to update project' })
            })
    } else {
        res.status(400).json({ message: 'Missing name or description' })
    }
})

server.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`)
})