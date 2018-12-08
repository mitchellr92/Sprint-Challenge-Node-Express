const express = require('express');
const projectDb = require('./data/helpers/projectModel.js')
const actionDb = require('./data/helpers/actionModel.js');

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

server.get('/projects/:id/actions', (req, res) => {

    const { id } = req.params;

    projectDb.getProjectActions(id)
        .then(projectActions => {
            if (projectActions) {
                res.json(projectActions)
            } else {
                res.status(404).json({ message: 'Project with specified ID does not exist' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to load project actions' })
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

server.get('/actions', (req, res) => {
    actionDb.get()
        .then(actions => {
            res.json(actions)
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to load actions' })
        })
})

server.get('/actions/:id', (req, res) => {

    const { id } = req.params;

    actionDb.get(id)
        .then(action => {
            if (action) {
                res.json(action)
            } else {
                res.status(404).json({ message: 'Action with specified ID does not exist' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to load action' })
        })
})

server.post('/actions', (req, res) => {
// Giving an error when trying to return the updated action
    const action = req.body;

    if (action.project_id && action.description && action.notes) {
        actionDb.insert(action)
            .then(idInfo => {
                actionDb.insert(idInfo.id).then(action => {
                    res.status(201).json(project)
                })
            })
            .catch(err => {
                res.status(500).json({ message: 'Failed to insert action' })
            })
    } else {
        res.status(400).json({
            message: 'Missing project ID, description or notes'
        })
    }
})

server.delete('/actions/:id', (req, res) => {

    const { id } = req.params;
    const action = req.body;

    actionDb.remove(id)
        .then(count => {
            if (count) {
                res.json(action)
            } else {
                res.status(404).json({ message: 'Action with specified ID does not exist' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to delete action' })
        })
})

server.put('/actions', (req, res) => {

})

server.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`)
})