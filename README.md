## Requirements
Node v20.18.0

## Setup
Rename `.envrc.example` to `.envrc` and update the values if need. I use [`direnv`](https://github.com/direnv/direnv) to auto load the values from `.envrc` files. If you don't have it simply run `source .envrc` to load them.

Start the app with `docker compose up`

### Authentication
All requests are authenticated by `AuthService`. The service provide `doAuth` method to be used as express' middleware.

In this repo the authentication service (AuthService) makes the following assumption:
- when the user logged in, a bearer token has already been generated for that user
- the token is stored in cache with the key `auth::<token>` (the value does not matter for the scope of this challenge, it can just be the timestamp when the token was generated).

AuthService authenticates the request by checking the `Authorization` header.
For example the request has a header `'Authorization: Bearer AaBbCc'`. If a key `auth::AaBbCc` exists in the cache, then the request is authenticated, otherwise the middleware with respond with a 401 status code.
After starting the app with Docker compose, access the redis and set the authentication token
```sh
## Shell
$ docker exec -it clarecache redis-cli
## Redis cache
127.0.0.1:6379> set auth::AaBbCc 1
```

The following sample requests will use this token.

## Design
[System architecture](./docs/design.jpg)

### Intent service
The service is responsible for classifying user's intent. It uses simple string matching logic to detect whether the message is a question from FAQ, suicidal or normal content.

### Cache
The cache used in this project is Redis. Redis client can be replaced by any other client (e.g. in memory cache), as long as that client implements the interface `CacheClient`.
The cache service in this project is also utilized by the store module below.

### Store
The persistence layer of the application. The store in this project utilizes the cache service to persist data. The cache service can also be used as a caching layer before reading the database in the future.

### Flow
The service is responsible for
- generating responses
- maintaining conversation by keeping previous message in cache
In order to generate responses it get the intent from Intent service. Questions from FAQ and suicidal messages will have predefined responses.
At the current state, normal messages from normal flow will be responded with predefined responses. But the service can be extended to delegate the response generating to AI models as the whole conversation is kept.

### Auth service
Refer section Authentication above.

### Configuration
The project has 2 sets of configuration for production and development environment. The value of `NODE_ENV` defines which set to load.

## Testing
The project uses Jest framework. End-to-end tests and unit tests are defined in `tests/e2e` and `tests/unit`.
Issue the command `npm run test` to run the test suites.

### Sample requests
Below are the sample requests that can be use to manually test the running server. Use `docker compose up` to spin up the server before sending the requests.

#### POST /sendMessage
FAQ message
```bash
curl --request POST \
  --url http://localhost:3000/sendMessage \
  --header 'Authorization: Bearer AaBbCc' \
  --header 'Content-Type: application/json' \
  --data '{
	"from": "U123",
	"to": "clare",
	"text": "Is this anonymous?"
}'
```

Suicidal message
```bash
curl --request POST \
  --url http://localhost:3000/sendMessage \
  --header 'Authorization: Bearer AaBbCc' \
  --header 'Content-Type: application/json' \
  --data '{
	"from": "U123",
	"to": "clare",
	"text": "I might hurt myself"
}'
```

Normal message
```bash
curl --request POST \
  --url http://localhost:3000/sendMessage \
  --header 'Authorization: Bearer AaBbCc' \
  --header 'Content-Type: application/json' \
  --data '{
	"from": "U123",
	"to": "clare",
	"text": "I feel good."
}'
```

#### GET /retrieveContext
```bash
curl --request GET \
  --url http://localhost:3000/retrieveContext/U123 \
  --header 'Authorization: Bearer AaBbCc'
```

#### POST /updateContext
```bash
curl --request POST \
  --url http://localhost:3000/updateContext \
  --header 'Authorization: Bearer AaBbCc' \
  --header 'Content-Type: application/json' \
  --data '{
	"from": "U123",
	"to": "clare",
	"text": "I feel sad."
}'
```

#### POST /initiateCheckIn
```bash
curl --request POST \
  --url http://localhost:3000/initiateCheckin \
  --header 'Authorization: Bearer AaBbCc' \
  --header 'Content-Type: application/json' \
  --data '{
	"to": "U123"
}'
```
