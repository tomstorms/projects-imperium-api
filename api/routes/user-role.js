const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const checkAuth = require('../middleware/check-auth');

const UserRole = require('../models/user-role');

// POST requests
router.post('/register', (req, res, next) => {
    UserRole.find({ name: req.body.name })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'A user role already exists with that name.'
            });
        } else {
            const userRole = new UserRole({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name
            });
            userRole.save().then(result => {
                res.status(201).json({
                    message: 'User role created'
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
});

// GET requests
router.get('/', (req, res, next) => {
    UserRole.find()
    .select('_id name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            user_roles: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
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



// // POST requests
// router.post('/login', (req, res, next) => {
//     User.find({ email: req.body.email })
//     .exec()
//     .then(user => {
//         if (user.length < 1) {
//             return res.status(401).json({
//                 message: 'Auth failed'
//             });
//         }
//         bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//             if (err) {
//                 return res.status(401).json({
//                     message: 'Auth failed'
//                 });
//             }
//             if (result) {
//                 const token = jwt.sign({
//                     email: user[0].email,
//                     userId: user[0]._id
//                 },
//                 process.env.JWT_KEY,
//                 {
//                     expiresIn: '1h'
//                 });

//                 return res.status(200).json({
//                     message: 'Auth successful',
//                     token: token
//                 });
//             }
//             res.status(401).json({
//                 message: 'Auth failed'
//             });
//         });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// });

// // DELETE request for individual item
// router.delete('/:userId', (req, res, next) => {
//     User.remove({ _id: req.params.userId })
//     .exec()
//     .then(result => {
//         res.status(200).json({
//             message: 'User deleted'
//         });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// });

module.exports = router;