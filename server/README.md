# API Server

I have confirmed that the implementation works with the following versions:
- Node.js: v8.9.3
- MongoDB: v2.6.10
 
 [REFERENCE]
- [MongoDB](https://www.mongodb.com/)
- [Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)
- [Mongoose](http://mongoosejs.com/docs/)

## Authentication with client cert

This implementation partly support authentication with client cert, just for a testing purpose.

A real API server MUST implement such authentication for all the REST API pathes.

### Self-signed cert

[REFERENCE] https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node

### Client cert

[REFERENCE] https://www.linkedin.com/pulse/authentication-using-https-client-certificates-andr%C3%A1s-sevcsik
