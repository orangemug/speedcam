# speedcam
A rate limiting middleware for express which produces `X-RateLimit-*` headers

[![stability-experimental](https://img.shields.io/badge/stability-experimental-green.svg)][stability]
[![circleci](https://circleci.com/gh/orangemug/speedcam.png?style=shield)][circleci]
[![Dependency Status](https://david-dm.org/orangemug/speedcam.svg)][dm-prod]
[![Dev Dependency Status](https://david-dm.org/orangemug/speedcam/dev-status.svg)][dm-dev]

[stability]: https://github.com/orangemug/stability-badges#experimental
[circleci]:  https://circleci.com/gh/orangemug/speedcam
[dm-prod]:   https://david-dm.org/orangemug/speedcam
[dm-dev]:    https://david-dm.org/orangemug/speedcam#info=devDependencies

The following headers are produced as outlined <https://developer.github.com/v3/#rate-limiting>

    X-RateLimit-Limit
    X-RateLimit-Remaining
    X-RateLimit-Reset


## Install
To install

    npm install git://github.com/teamguideio/speedcam.git --save


## Usage
To use in nodejs

```js
var speedcam = require("speedcam");
var got      = require("got");
var express  = require("express");
var app      = express();

// Create the middleware
var middleware = speedcam({
  limit: 1000,
  window: 15000
});

// Mount the middleware
app.get("/", middleware, function (req, res) {
  res.send("Hello World!");
});

var server = app.listen(0, function () {
  var port = server.address().port;

  // Make a request to the server
  got("localhost:"+port, function(err, body, res) {
    assert.ifError(err);
    assert.equal(res.headers["x-ratelimit-limit"], 1000)
    assert.equal(res.headers["x-ratelimit-remaining"], 1)
    assert("x-ratelimit-reset")
    server.close();
  });
});
```

## License
[MIT](LICENSE)
