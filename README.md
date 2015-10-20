# speedcam
A rate limiting middleware for express which produces `X-RateLimit-*` headers

![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg)
[![circleci](https://circleci.com/gh/teamguideio/speedcam.png?style=shield)](https://circleci.com/gh/teamguideio/speedcam)
[![Dependency Status](https://david-dm.org/teamguideio/speedcam.svg)](https://david-dm.org/teamguideio/speedcam)
[![Dev Dependency Status](https://david-dm.org/teamguideio/speedcam/dev-status.svg)](https://david-dm.org/teamguideio/speedcam#info=devDependencies)

The following headers are produced as outlined <https://developer.github.com/v3/#rate-limiting>

    X-RateLimit-Limit
    X-RateLimit-Remaining
    X-RateLimit-Reset


## Install
To install

    npm install git://github.com/teamguideio/speedcam.git --save


## Usage
To use in nodejs

    var speedcam = require("speedcam");

    app.get(
      "/foo",
      speedcam({
        limit: 1000,
        window: 15000
      }),
      function(req, res) {
        res.send("foo");
      }
    );


## License
[MIT](LICENSE)
