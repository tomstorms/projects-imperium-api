# Projects / Imperium - API

A RESTful API that connects to MongoDB to serve the Imperium project.

## API

To start the API run the following commands:

```
cd api/
npm install
npm run start

```

Update ```api/nodemon.json``` with your Mongo Atlas Password

```
{
    "env": {
        "MONGO_ATLAS_PW": "YOUR_MONGO_USER_PW"
    }
}
```

The server should then start on localhost:6000