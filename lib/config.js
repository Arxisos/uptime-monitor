module.exports.validate = function(config) {
  console.assert(config.host, 'host required');
  console.assert(config.port, 'port required');
  console.assert(config.user, 'user required');
  console.assert(config.password, 'password required');
  console.assert(config.to, 'to required');
  console.assert(config.from, 'from required');
  console.assert(typeof config.secureConnection != 'undefined', 'secureConnection required');
  console.assert(config.interval, 'interval is required and must be higher than 0');
  console.assert(!isNaN(config.threshold), 'threshold must be a number');
  console.assert(config.url instanceof Array, 'url has to be an array');
  console.assert(config.url.length, 'url array must not be empty');
  config.url.forEach(function(val) {
    console.assert(typeof val == 'string' && val != '', 'url array must not contain empty values');
  });
}