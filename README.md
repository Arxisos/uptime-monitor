uptime-monitor
==============

Lightweight website monitoring and alerting without any external dependencies except of nodejs.

Features:
- Email downtime alert
- Email notification if URL has recovered
- Monitor multiple URLs at the same time

How to install
=============

`uptime-monitor` requires nodejs to run. You can either install 
nodejs from the [official website](http://nodejs.org/) or 
with the package manager of your system.

```
git clone https://github.com/Arxisos/uptime-monitor.git
cd uptime-monitor
npm install
```

Copy `config.json.example` to `config.json` and modify the settings according to your needs.

Run with `./index.js`.

Roadmap
=======

- more outputs: eg statsd / graphite integration
- response time tracking
- pattern matching (check for specific pattern in response body)
