const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hasUserRole } = require('../middleware/check-auth');

const User = require('../models/user');

// GET requests
router.get('/me', hasUserRole('authenticated', 'parents'), (req,res) => { 
    try {
        // Verify JWT Token
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userEmail = decoded.email;

        User.find({ email: userEmail })
        .select('_id email user_role')
        .exec()
        .then(user => {
            const userID = user[0]._id;
            const userEmail = user[0].email;
            const userRole = user[0].user_role;

            return res.status(200).json({
                user_id: userID,
                email: userEmail,
                user_role: userRole,
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });


    } catch (error) {
        return res.status(401).json({
            message: 'Token failed',
        });
    }
});

// POST requests
router.post('/register', hasUserRole('public'), (req,res) => { 
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const userRole = req.body.role || 'authenticated';

    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'An account already exists with that email address.'
            });
        } else {
            bcrypt.hash(userPassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: userEmail,
                        password: hash,
                        user_role: userRole,
                    });
                    user.save().then(result => {
                        const userId = result._id;

                        const token = jwt.sign({ email: userEmail, userId: userId, userRole: userRole }, process.env.JWT_KEY, { expiresIn: '3h' });
                        return res.status(200).json({
                            message: 'User created',
                            user_id: userId,
                            user_role: userRole,
                            token: token
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
});

// POST requests
router.post('/login', hasUserRole('public'), (req,res) => { 
    User.find({ email: req.body.email })
    .select('_id email password user_role')
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }

        const userID = user[0]._id;
        const userEmail = user[0].email;
        const userPassword = user[0].password;
        const userRole = user[0].user_role;

        bcrypt.compare(req.body.password, userPassword, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result) {
                const token = jwt.sign({ email: userEmail, userId: userID }, process.env.JWT_KEY, { expiresIn: '1h' });
                return res.status(200).json({
                    user_id: userID,
                    user_role: userRole,
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
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
router.delete('/:userId', hasUserRole('authenticated'), (req,res) => { 
    User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;