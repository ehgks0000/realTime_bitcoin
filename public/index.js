function createContainer(coin) {
  let socketURL = `wss://stream.binance.com:9443/ws/${coin}usdt@ticker`;
  const socket = new WebSocket(socketURL);
  let data;

  const coinContainer = document.getElementById("coin-container");

  const newDiv = document.createElement("div");
  newDiv.setAttribute("class", `${coin} coin`);

  const newH1 = document.createElement("span");
  newH1.setAttribute("id", "coinName");

  const priceH1 = document.createElement("span");
  priceH1.setAttribute("id", "price");

  const changeH1 = document.createElement("span");
  changeH1.setAttribute("id", "change");

  const percentH1 = document.createElement("span");
  percentH1.setAttribute("id", "percent");

  socket.onmessage = (e) => {
    data = JSON.parse(e.data);
    newH1.innerText = `${coin}`;

    let price = Number(data.c);
    let change = Number(data.p);
    let percent = Number(data.P);

    priceH1.innerText = "$ " + price.toFixed(2);
    // priceH1.innerText = data.c;
    changeH1.innerText = "$ " + change.toFixed(2);
    percentH1.innerText = percent.toFixed(2) + " %";
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
