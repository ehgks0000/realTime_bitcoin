function createContainer(coin) {
  let socketURL = `wss://stream.binance.com:9443/ws/${coin}usdt@ticker`;
  const socket = new WebSocket(socketURL);
  let data;

  const coinContainer = document.getElementById("coin-container");

  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", coin);

  const newH1 = document.createElement("h1");
  newH1.innerText = "new";

  const priceH1 = document.createElement("h1");
  priceH1.setAttribute("id", coin + "-price");

  const changeH1 = document.createElement("h1");
  changeH1.setAttribute("id", coin + "-change");

  const percentH1 = document.createElement("h1");
  percentH1.setAttribute("id", coin + "-percent");

  socket.onmessage = (e) => {
    data = JSON.parse(e.data);
    newH1.innerText = `${coin} 가격`;
    priceH1.innerText = data.c;
    changeH1.innerText = data.p;
    percentH1.innerText = data.P + "%";
  };
  newDiv.appendChild(newH1);
  newDiv.appendChild(priceH1);
  newDiv.appendChild(changeH1);
  newDiv.appendChild(percentH1);

  coinContainer.appendChild(newDiv);
}

createContainer("btc");
createContainer("eth");
createContainer("etc");
createContainer("xrp");
createContainer("doge");
createContainer("mtl");
