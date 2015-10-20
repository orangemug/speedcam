# speedcam
A rate limiting middleware for express which produces the correct headers.


## Install
To install

		npm install speedcam


## Node usage

		var speedcam = require("speedcam");

		app.get(
			"/foo",
			speedcam({
				limit: 1000,
				window: 15000
			}),
			function(req, res) {
			}
		);


## CLI usage
For a test server you can use a forwarding app

		./bin/speedcam-server --limit 60 --window 60000 --forward http://localhost:5000


## License
MIT
