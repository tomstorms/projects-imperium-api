# Projects / Imperium - API

A GraphQL API that connects to MongoDB to serve the Imperium project.

## API

To start the API run the following commands:

```
cd api/
npm run start

```

Update ```api/nodemon.json``` with your Mongo Atlas credentials and JWT token key

```
{
    "env": {
        "MONGO_COLLECTION": "",
        "MONGO_USERNAME": "",
        "MONGO_PASSWORD": "",
        "JWT_KEY": ""
    }
}
```

Your endpoint will be accessiable via: localhost:8000

Navigate to: http://localhost:8000/graphql/ for the GraphiQL UI.