# speedcam
A rate limiting middleware for express which produces `X-RateLimit-*` headers

    X-RateLimit-Limit
    X-RateLimit-Remaining
    X-RateLimit-Reset


## Install
To install

		npm install speedcam


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
MIT
