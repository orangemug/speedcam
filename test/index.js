var assert       = require("assert");
var lodash       = require("lodash");
var sinon        = require("sinon");
var speedcam     = require("../");
var readmeTester = require("readme-tester");


function setHeader(k, v) {
  this.headers[k.toLowerCase()] = v;
}

function nullFn() {}


describe("speedcam", function() {

  it("should error if no 'window' passed", function() {
    var err;
    try {
      speedcam({window: 1000});
    } catch(_err) {
      err = _err;
    }

    assert.equal(err.message, "Missing param 'limit'");
  });

  it("should error if no 'limit' passed", function() {
    var err;
    try {
      speedcam({limit: 1000});
    } catch(_err) {
      err = _err;
    }

    assert.equal(err.message, "Missing param 'window'");
  });

  it("should error with 429 once limit is reached", function() {
    var middleware = speedcam({
      limit: 10,
      window: 60*1000
    });

    var req = {
      ip: "127.0.0.1",
      user: {
        id: 1
      },
      url: "/foo"
    };

    var next = sinon.spy();
    var res = {
			setHeader: setHeader,
      headers: {},
      send: sinon.spy()
    };

    for(var i=0; i<12; i++) {
      middleware(req, res, next);
    }

    assert.equal(res.headers["x-ratelimit-limit"], 10);
    assert.equal(res.headers["x-ratelimit-remaining"], 0);
    assert(res.headers["x-ratelimit-reset"]);
    assert.equal(next.callCount, 10);
    assert.equal(res.send.callCount, 2);
    assert(res.send.calledWith(429, "Too Many Requests"));
  });

  it("should error with 429 with another 'reqIdfn'", function() {
    var middleware = speedcam({
      limit: 10,
      window: 60*1000,
      reqIdFn: function(req) {
        return req.headers.uid;
      }
    });

    var req = {
      headers: {
        uid: 1
      }
    };

    var next = sinon.spy();
    var res = {
			setHeader: setHeader,
      headers: {},
      send: sinon.spy()
    };

    for(var i=0; i<12; i++) {
      middleware(lodash.assign(req, {url: "/foo/"+i}), res, next);
    }

    assert.equal(res.headers["x-ratelimit-limit"], 10);
    assert.equal(res.headers["x-ratelimit-remaining"], 0);
    assert(res.headers["x-ratelimit-reset"]);
    assert.equal(next.callCount, 10);
    assert.equal(res.send.callCount, 2);
    assert(res.send.calledWith(429, "Too Many Requests"));
  });

  it("should reduce x-ratelimit-remaining by 1 on each call", function() {
    var middleware = speedcam({
      limit: 10,
      window: 60*1000,
      reqIdFn: function(req) {
        return req.headers.uid;
      }
    });

    var req = {
      headers: {
        uid: 1
      }
    };

    var next = sinon.spy();
    var res = {
			setHeader: setHeader,
      headers: {},
      send: sinon.spy()
    };

    middleware(lodash.assign(req, {url: "/foo/"}), res, nullFn);

    assert.equal(res.headers["x-ratelimit-limit"], 10);
    assert.equal(res.headers["x-ratelimit-remaining"], 9);
    assert(res.headers["x-ratelimit-reset"]);

    middleware(lodash.assign(req, {url: "/foo/"}), res, nullFn);
    assert.equal(res.headers["x-ratelimit-limit"], 10);
    assert.equal(res.headers["x-ratelimit-remaining"], 8);
    assert(res.headers["x-ratelimit-reset"]);
  });

	it("README should show no errors", function(done) {
		readmeTester(__dirname+"/../", function(err) {
			assert.ifError(err);
			done();
		});
	});

});
