const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Enable middleware for logging
app.use(morgan('dev'));

// Read body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@cluster0-zikku.mongodb.net/' + process.env.MONGO_COLLECTION + '?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

// CORS protection
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === 'OPTIONS') {
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE"
        );
        return res.status(200).json({});
    }

    next();
})

// Available routes
const roomRoutes = require('./routes/room');
const roomCategoryRoutes = require('./routes/room-category');
const userRoutes = require('./routes/user');
const userRolesRoutes = require('./routes/user-role');

// Activate routes
app.use('/rooms', roomRoutes);
app.use('/room-category', roomCategoryRoutes);
app.use('/users', userRoutes);
// app.use('/users/roles', userRolesRoutes);

// Catch all
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
