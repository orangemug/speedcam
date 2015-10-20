var counts = {};
var resets = {};

function ipUserUrl(req) {
  return [
    req.ip,
    req.user.id,
    req.url
  ].join(":");
}

module.exports = function(opts) {
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

    // Set the rate limit headers
    res.headers["X-RateLimit-Limit"]     = limit;
    res.headers["X-RateLimit-Remaining"] = counts[uuid] || 0;
    res.headers["X-RateLimit-Reset"]     = resets[uuid];

    if(counts[uuid] > limit) {
      res.send(429, "Too Many Requests");
    } else {
      next();
    }
  }
};