var rateLimitHeader = require("rate-limit-headers");

function ipUserUrl(req) {
  return [
    req.ip,
    (req.user ? (req.user.id || "") : ""),
    req.url
  ].join(":");
}

module.exports = function(opts) {
  var counts = {};
  var resets = {};

  var limit      = opts.limit;
  var timeWindow = opts.window;
  var reqIdFn    = opts.reqIdFn || ipUserUrl;

  if(!limit) {
    throw new Error("Missing param 'limit'");
  }

  if(!timeWindow) {
    throw new Error("Missing param 'window'");
  }

  // The router;
  return function(req, res, next) {
    // Get the request uniq identifier.
    var uuid = reqIdFn(req);

    resets[uuid] = resets[uuid] || Date.now() + timeWindow;

    if(resets[uuid] < Date.now()) {
      resets[uuid] = Date.now();
    }

    counts[uuid] = counts[uuid] || 0;
    counts[uuid]++;

    var remaining = limit - counts[uuid];

    var headers = rateLimitHeader.unparse({
      limit: limit,
      remaining: Math.max(remaining, 0),
      reset: resets[uuid]
    })

    // Merge in headers.
    for(var k in headers) {
      if(headers.hasOwnProperty(k)) {
        res.setHeader(k, headers[k]);
      }
    }

    if(counts[uuid] > limit) {
      res.send(429, "Too Many Requests");
    } else {
      next();
    }
  }
};
