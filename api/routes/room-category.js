const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

// GET requests
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /room-category'
    });
});

// POST requests
router.post('/', (req, res, next) => {
    const roomCategory = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
    };

    res.status(200).json({
        message: 'Handling POST requests to /room-category',
        createdRoomCategory: roomCategory,
    });
});

// GET request for individual item
router.get('/:roomCategoryId', (req, res, next) => {
    const id = req.params.roomCategoryId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID /room-category',
            id: id,
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID /room-category',
            id: id,
        });
    }
});

// PATCH (update) request for individual item
router.patch('/:roomCategoryId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated room /room-category',
    });
});

// DELETE request for individual item
router.delete('/:roomCategoryId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted room /room-category',
    });
});

module.exports = router;
