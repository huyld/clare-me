## Setup
Rename `.envrc.example` to `.envrc` and update the values if need (e.g. if default port is already occupied). I use [`direnv`](https://github.com/direnv/direnv) to auto load the values from `.envrc` files. If you don't have it simply run `source .envrc` to load them.

### Redis
Make sure you're running local Redis in docker `docker run -d -p 6379:6379 redis --protected-mode no`.

### Authentication
In this repo the authentication service (AuthService) makes the following assumption:
- when the user logged in, a bearer token has been generated for that user
- the token is stored in cache with the key `auth::<token>` (the value does not matter much, it can just be the timestamp when the token was generated).
AuthService authenticates the request by checking the `Authorization` header.
For example the request has a header `'Authorization: Bearer aabbcc'`. If a key `auth::aabbcc` exists in the cache, then the request is authenticated, otherwise the middleware with respond with a 401 status code.

## Requirements
Node v20.18.0

