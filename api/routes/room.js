const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

// Setup Mongoose Schema
const Room = require('../models/room');

// GET requests
router.get('/', (req, res, next) => {
    Room.find()
        .select('_id name description')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                rooms: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        description: doc.description
                    };
                }),
            };

            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// POST requests
router.post('/', (req, res, next) => {
    const room = new Room({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,


        // name: { type: String, required: true },
        // description: String,
        // layout: String,
        // wheelchair_access: Boolean,
        // room_category: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomCategory' },
        // web_link: String,
    });
    room.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Created room successfully',
            createdRoom: {
                _id: result._id,
                name: result.name,
                description: result.description,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/rooms/' + result.id,
                }
            },
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

});

// GET request for individual item
router.get('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    Room.findById(id)
    .select('_id name description')
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json({
                room: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/rooms/' + result.id,
                }
            });
        } else {
            res.status(404).json({message: 'Room not found'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// PATCH (update) request for individual item
router.patch('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Room.update({ _id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Room updated',    
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/rooms/' + id,
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// DELETE request for individual item
router.delete('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    Room.remove({ _id: id})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Room deleted',    
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/rooms/' + id,
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

module.exports = router;
