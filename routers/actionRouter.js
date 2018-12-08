const express = require('express');
const actionDb = require('../data/helpers/actionModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    actionDb.get()
        .then(actions => {
            res.json(actions)
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to load actions' })
        })
})

router.get('/:id', (req, res) => {

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

router.post('/', (req, res) => {
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

router.delete('/:id', (req, res) => {

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

router.put('/:id', (req, res) => {

    const { id } = req.params;
    const action = req.body;

    if (action.project_id && action.description && action.notes) {
        actionDb.update(id, action)
            .then(action => {
                if (id) {
                    res.json({ message: 'Action has been updated' })
                } else {
                    res.status(404).json({ message: 'Action with specified ID does not exist' })
                }
            })
            .catch(err => {
                res.status(500).json({ message: 'Failed to update action' })
            })
    } else {
        res.status(400).json({ message: 'Missing porject ID, description or notes' })
    }
})

module.exports = router;