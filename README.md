Orange Clinical Interface
=========

Basic web interface for clinicians to access OrangeRx API.

## Quick up and running quide

### Prerequisites

- Node.js (v0.10+) and NPM
- Grunt.js, Karma and Bower (`npm install -g grunt-cli karma bower`)

```
#install dependencies and build
npm install
bower install
grunt watch

# open in browser
open ./build/index.html
```

## Docker Deployment

```
docker run -d -p THE_PORT:80 --name THE_NAME \
-e ORANGE_API_URL={ORANGE_API_URL} \
-e ORANGE_API_AVATAR_BASE_URL={ORANGE_API_AVATAR_BASE_URL} \
-e AUTH_MICROSERVICE_URL={AUTH_MICROSERVICE_URL} \
-e X_CLIENT_SECRET={X_CLIENT_SECRET} \
amidatech/orange-clinical
```

## Environment Variables

##### `ORANGE_API_URL`

The URL of the `orange-api`. Must not end in a trailing `/`.
- e.g. `https://the-orange-api-server.com/v1`

##### `ORANGE_API_AVATAR_BASE_URL`

The base URL of the orange api. Must not end in a trailing `/`.
- e.g. `https://the-orange-api-server.com`.

##### `AUTH_MICROSERVICE_URL`

The URL of the `amida-auth-microservice` API. Must not end in a trailing `/`.
- e.g. `https://the-amida-auth-microservice.com/api/v1`.

##### `X_CLIENT_SECRET`

Must match the `X_CLIENT_SECRET` defined by the Orange API.

## Contributing

Contributors are welcome. See issues https://github.com/amida-tech/orange-clinical/issues

## Release Notes

See release notes [here] (./RELEASENOTES.md)

## License

Licensed under [Apache 2.0](./LICENSE)
