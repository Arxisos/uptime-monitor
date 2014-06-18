#!/usr/bin/env node

var util = require('util');
var os = require('os');
var request = require('request');
var nodemailer = require('nodemailer');
          
var config = require('./config.json');
require('./lib/config.js').validate(config);

function sendMail(subject, text) {
  var transport = nodemailer.createTransport('SMTP', {
    host: config.host,
    secureConnection: config.secureConnection,
    port: config.port,
    auth: {
      user: config.user,
      pass: config.password
    }
  });
  
  transport.sendMail({
    from: config.from,
    to: config.to,
    subject: subject,
    text: text
  }, function(error) {
    if(error) {
      console.error('Error while sending notification email:');
      console.error(error);
    }
  });
}

function notify(ctx) {
  if(ctx.down) {
    var subject = util.format('Alert: %s down', ctx.url);
    var text = util.format('%s discovered downtime of %s', os.hostname(), ctx.url);
    sendMail(subject, text);
  }
  else {
    var subject = util.format('Info: %s recovered', ctx.url);
    var text = util.format('%s discovered recovery of %s', os.hostname(), ctx.url);
    sendMail(subject, text);
  }
}

function processFailure(ctx) {
  if(!ctx.down) { 
    ctx.failures = ctx.failures + 1;
    
    if(ctx.failures > ctx.threshold) {
      ctx.down = true;
      ctx.failures = 0;
      notify(ctx);
    }
  }
  
  return ctx;
}

function processSuccess(ctx) {
  if(ctx.down) {
    ctx.down = false;
    notify(ctx);
  }
  
  return ctx;
}

function test(ctx, callback) {
  request(ctx.url, function(error, response, body) {
    if(error || response.statusCode != 200) {
      ctx = processFailure(ctx);
    }
    else {
      ctx = processSuccess(ctx);
    }

    callback(ctx);
  });
}

function daemonize(ctx, interval) {
  test(ctx, function(ctx) {
    setTimeout(function() {
      daemonize(ctx, interval);
    }, interval);
  });
}

function start(url, interval, threshold) {
  var ctx = {
    url: url,
    threshold: threshold,
    down: false,
    failures: 0
  };
  daemonize(ctx, interval);
}

config.url.forEach(function(url) {
  start(url, config.interval, config.threshold);
});