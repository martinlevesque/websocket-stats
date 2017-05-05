'use strict'

const websocketStats = require("./index");
const expect = require('expect.js');
const http = require('http');
const express = require("express");
const WebSocketServer = require('websocket').server;
const WebSocket = require('ws');
const url = require("url");

describe('handle ws stats properly', function() {

  let server = null;

  beforeEach(done => {
    const httpApp = express();
    server = http.createServer(httpApp);

    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
      const location = url.parse(ws.upgradeReq.url, true);

      ws.on('message', function incoming(message) {
        //
        if (message == "two-way-special") {
          ws.send("two-way-special-ack");
        }
      });

    });

    server.listen(8000, function listening() {

    });

    done();
  });


  it("should have init stats on start", function(done) {

    websocketStats(server, null, (stats) => {
      if (stats.type == "init") {
        expect(stats.bytesRead).to.be.greaterThan(0);
        expect(stats.bytesWritten).to.be.greaterThan(0);
        expect(stats.error).to.be.equal(null);
        expect(stats.host).to.contain("127.0.0.1");
        done();
      }
    });

    let ws = new WebSocket('ws://127.0.0.1:8000');

    ws.on('open', function open() {
      ws.send("test 123");
    });

  });

  it("should have data stats on client-to-server", function(done) {

    websocketStats(server, null, (stats) => {
      if (stats.type == "data") {
        expect(stats.bytesRead).to.be.greaterThan(String("test 123").length);
        expect(stats.bytesWritten).to.be.equal(0);
        expect(stats.error).to.be.equal(null);
        expect(stats.host).to.contain("127.0.0.1");
        done();
      }
    });

    let ws = new WebSocket('ws://127.0.0.1:8000');

    ws.on('open', function open() {
      ws.send("test 123");
    });

  });

  it("should have data stats on server-to-client when server sends data", function(done) {

    websocketStats(server, null, (stats) => {
      if (stats.type == "data") {

        if (stats.bytesWritten > String("two-way-special-ack").length) {
          done();
        }

      }
    });

    let ws = new WebSocket('ws://127.0.0.1:8000');

    ws.on('open', function open() {
      ws.send("two-way-special");
    });

  });

  it("should have only data stats if require only data stats", function(done) {

    websocketStats(server, ["data"], (stats) => {
      expect(stats.type).to.be.equal("data");
      done();
    });

    let ws = new WebSocket('ws://127.0.0.1:8000');

    ws.on('open', function open() {
      ws.send("one msg");
    });

  });

  it("should have data and init stats", function(done) {
    let cnt = 0;

    websocketStats(server, ["init", "data"], (stats) => {
      if (cnt == 0) {
        expect(stats.type).to.be.equal("init");
      }
      else if (cnt == 1) {
        expect(stats.type).to.be.equal("data");
        done();
      }
      ++cnt;
    });

    let ws = new WebSocket('ws://127.0.0.1:8000');

    ws.on('open', function open() {
      ws.send("one msg");
    });

  });

  afterEach(done => {
    server.close();
    done();
  });
});
