# websocket-stats

[![Build status](https://travis-ci.org/martinlevesque/websocket-stats.svg?branch=master)](https://travis-ci.org/martinlevesque/websocket-stats)

Get stats on your Node HTTP(S) Websocket server messages.

Emit events for each upgraded HTTP/HTTPs socket message in a convenient manner.

## Installation

```
npm install websocket-stats --save
```

## Examples usage

Get stats for each websocket message:

```javascript
const websocketStats = require('websocket-stats');
var server = http.createServer(...);

websocketStats(server, null, function (stats) {
  console.log(stats);
})
```

Get stats only for normal data (not error/init/states/end) messages:

```javascript
const websocketStats = require('websocket-stats');
var server = http.createServer(...);

websocketStats(server, ["data"], function (stats) {
  console.log(stats);
})
```

## API

### Constructor

#### `websocketStats(server, eventTypes, callback)`

Attach websocket-stats to a HTTP or HTTPS server. `eventTypes` is a list (or null object) of string types to monitor. When `eventTypes` is set to null, all types will be monitored. When an message occur, the callback method is called.

## Response stats object

```javascript
{
  remoteAddr: "...",    // socket IP remote address
  host: "...",          // HTTP(S) host from the header
  type: "...",          // type of message/event
  bytesRead: "...",     // bytes read during the message/event
  bytesWritten: "...",  // bytes written during the message/event
  error: error          // error object if an error has occured, null otherwise
}
```

## License

ISC
