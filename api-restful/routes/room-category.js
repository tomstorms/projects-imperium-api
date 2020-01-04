const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { hasUserRole } = require('../middleware/check-auth');

const RoomCategory = require('../models/room-category');

// GET requests
router.get('/', hasUserRole('authenticated'), (req,res) => { 
    RoomCategory.find()
    .select('_id name price')
    .exec()
    .then(roomCategory => {
        if (roomCategory.length < 1) {
            return res.status(200).json({
                message: 'No room categories exist.'
            });
        }
        
        return res.status(200).json({
            data: roomCategory
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// GET request for individual item
router.get('/:roomCategoryId', hasUserRole('authenticated'), (req,res) => { 
    const id = req.params.roomCategoryId;
    RoomCategory.findOne({_id: id})
    .select('_id name price')
    .exec()
    .then(roomCategory => {
        if (roomCategory.length < 1) {
            return res.status(200).json({
                message: 'No room categories exist.'
            });
        }
        
        return res.status(200).json({
            data: roomCategory
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// POST requests
router.post('/', hasUserRole('authenticated'), (req,res) => { 
    const roomCategory = new RoomCategory({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    roomCategory.save().then(result => {
        res.status(200).json({
            message: 'Created room category successfully',
            createdRoomCategory: {
                _id: result._id,
                name: result.name,
                price: result.price,
            },
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// PATCH (update) request for individual item
router.patch('/:roomCategoryId', hasUserRole('authenticated'), (req,res) => {
    const id = req.params.roomCategoryId;
    const updateOps = {};
    for (const key of Object.keys(req.body)) {
        updateOps[key] = req.body[key];
    }
    
    RoomCategory.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Room Category updated',
            updatedRoomCategory: updateOps,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// DELETE request for individual item
router.delete('/:roomCategoryId', hasUserRole('authenticated'), (req,res) => { 
    const id = req.params.roomCategoryId;
    RoomCategory.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Room Category deleted',
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
