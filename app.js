const e = require("express");
const express = require("express");
const WebSocket = require("ws");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

let data;

const Socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
Socket.onmessage = (e) => {
  data = e.data;
  //   data = JSON.parse(e.data);
  //   console.log(data);
};

app.get("/", (req, res) => {
  res.send();
});

app.get("/coin", (req, res) => {
  res.render("coin", { coin: data });
});

const port = 3111;
app.listen(port, () => {
  console.log(`${port}로 열림`);
});
