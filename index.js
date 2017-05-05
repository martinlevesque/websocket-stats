'use strict'

let notify = (type, req, socket, head, prevStats, callback, error) => {
		let stats = {};
		stats.bytesRead = socket.bytesRead - prevStats.bytesRead;
		stats.bytesWritten = socket.bytesWritten - prevStats.bytesWritten;
		prevStats.bytesRead = socket.bytesRead;
		prevStats.bytesWritten = socket.bytesWritten;
		stats.host = req.headers.host;
		stats.type = type;
		stats.error = error;
		stats.remoteAddr = socket.remoteAddress;

		callback(stats);
};

let shouldNotify = (eventType, includeOnlyEvents) => {
  return ! includeOnlyEvents || includeOnlyEvents.indexOf(eventType) >= 0;
}

// server: http/https server
// includeOnlyEvents: init, data, error, end, connect, lookup, timeout, drain, close
// callback(stats): callback response with the stats info
let handle = (server, includeOnlyEvents, callback) => {

  server.on('upgrade', function (req, socket, head) {

		let previousStats = {
			"bytesRead": 0,
			"bytesWritten": 0,
			"host": ""
		};

    if (shouldNotify("init", includeOnlyEvents)) {
	    notify("init", req, socket, head, previousStats, callback, null);
    }

    if (shouldNotify("data", includeOnlyEvents)) {
  		socket.on("data", (/* data */) => {
  			notify("data", req, socket, head, previousStats, callback, null);
  		});
    }

    if (shouldNotify("error", includeOnlyEvents)) {
  		socket.on("error", (err) => {
  			notify("error", req, socket, head, previousStats, callback, err);
  		});
    }

    if (shouldNotify("end", includeOnlyEvents)) {
  		socket.on("end", () => {
  			notify("end", req, socket, head, previousStats, callback, null);
  		});
    }

    if (shouldNotify("connect", includeOnlyEvents)) {
  		socket.on("connect", () => {
  			notify("connect", req, socket, head, previousStats, callback, null);
  		});
    }

    if (shouldNotify("lookup", includeOnlyEvents)) {
  		socket.on("lookup", () => {
  			notify("lookup", req, socket, head, previousStats, callback, null);
  		});
    }

    if (shouldNotify("timeout", includeOnlyEvents)) {
  		socket.on("timeout", () => {
  			notify("timeout", req, socket, head, previousStats, callback, null);
  		});
    }

    if (shouldNotify("drain", includeOnlyEvents)) {
  		socket.on("drain", () => {
  			notify("drain", req, socket, head, previousStats, callback, null);
  		});
    }

    if (shouldNotify("close", includeOnlyEvents)) {
  		socket.on("close", () => {
  			notify("close", req, socket, head, previousStats, callback, null);
  		});
    }
  });
};


module.exports = handle
