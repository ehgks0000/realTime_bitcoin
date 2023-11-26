import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Alchemy, Network, TokenBalance } from "alchemy-sdk";
import { ethers } from "ethers";
import "./style.css";

let api: string;
try {
  api = process.env.REACT_APP_ALCHMY_API;
} catch (error) {
  throw new Error(error);
}

const settings = {
  apiKey: api, // Replace with your Alchemy API key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

interface CoinData {
  c: string; // 가격
  p: string; // 가격 변동
  P: string; // 백분율
}

type MyCoins = {
  symbol: string;
  wallet: string;
  balance: string;
};

interface MyCoinContainerProps {
  coin: MyCoins;
}
interface CoinContainerProps {
  coin: string;
  onRemove: (...args: any) => void;
  data: CoinData;
}

const MyCoinContianer: React.FC<MyCoinContainerProps> = ({ coin }) => {
  return (
    <div className={`coin-container ${coin.wallet}`}>
      <span id="symbol">{coin.symbol}</span>
      <span id="coin-wallet">{coin.wallet}</span>
      <span id="balance">{coin.balance}</span>
    </div>
  );
};

const fetchCoinData = async (token: TokenBalance, alchemy: Alchemy) => {
  const md = await alchemy.core.getTokenMetadata(token.contractAddress);
  const balance = ethers.BigNumber.from(token.tokenBalance);
  const decimalValue = ethers.utils.formatUnits(balance, md.decimals);

  if (decimalValue === "0.0") {
    return null;
  }

  return {
    symbol: md.symbol,
    wallet: token.contractAddress,
    balance: decimalValue,
  };
};

const CoinContainer: React.FC<CoinContainerProps> = ({
  coin,
  data,
  onRemove,
}) => {
  return (
    <div className={`${coin} coin`}>
      <span id="coinName">{coin.toUpperCase()}</span>
      <span id="price">${data ? Number(data.c).toFixed(2) : "-"}</span>
      <span id="change">${data ? Number(data.p).toFixed(2) : "-"}</span>
      <span id="percent">{data ? Number(data.P).toFixed(2) + "%" : "-"}</span>
      <button onClick={() => onRemove(coin)}>제거</button>
    </div>
  );
};

const App: React.FC = () => {
  const [myCoins, setMyCoins] = useState<MyCoins[]>([]);
  const [myWallet, setMyWallet] = useState<string>("");
  const [showCoins, setShowCoins] = useState(true);

  const [coins, setCoins] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [inputMyWallet, setInputMyWallet] = useState("");
  const [coinData, setCoinData] = useState<{ [key: string]: CoinData | null }>(
    {}
  );
  const [errorMessage, setErrorMessage] = useState("");

  const toggleCoins = () => {
    setShowCoins(!showCoins);
  };
  const reset = () => {
    setMyWallet("");
    setMyCoins([]);
  };

  const setupWebSocket = (coinName: string) => {
    return new Promise((res, rej) => {
      if (!coins.includes(coinName)) {
        const socket = new WebSocket(
          `wss://stream.binance.com:9443/ws/${coinName}usdt@ticker`
        );

        socket.onopen = () => {
          // 실시간 데이터 수신 설정
          socket.onmessage = (event) => {
            const data: CoinData = JSON.parse(event.data);
            setCoinData((prevData) => ({ ...prevData, [coinName]: data }));
            res(true);
          };

          // 코인 리스트에 추가
        };

        socket.onerror = () => {
          setErrorMessage(`존재하지 않는 코인입니다.`);
          setTimeout(() => setErrorMessage(""), 1000);
          socket.close();
          rej(false);
        };
      }
    });
  };

  useEffect(() => {
    // Chrome 스토리지에서 코인 리스트 불러오기
    chrome.storage.sync.get(["coins"], function (result) {
      if (result.coins) {
        const uniqueCoins = Array.from(new Set(result.coins)) as string[];

        setCoins(uniqueCoins);
        for (const coin of uniqueCoins) {
          setupWebSocket(coin);
        }
      } else {
        // Default coin list
        const DEFAULT_COINS = ["btc", "eth", "etc", "xrp", "doge", "mtl"];
        setCoins(DEFAULT_COINS);
        for (const coin of DEFAULT_COINS) {
          setupWebSocket(coin);
        }
      }
    });
  }, []);

  useEffect(() => {
    // 코인 리스트 변경 시 저장
    chrome.storage.sync.set({ coins: Array.from(new Set(coins)) }, () => {
      console.log("Coins updated in storage");
    });
  }, [coins]);

  const addCoin = () => {
    if (input && !coins.includes(input)) {
      setupWebSocket(input).then((isTrue) => {
        if (isTrue) {
          setCoins((prevCoins) => [...new Set([...prevCoins, input])]);
        }
      });
    }
    setInput("");
  };

  const addMyWallet = () => {
    if (!inputMyWallet) {
      return;
    }
    const alchemy = new Alchemy(settings);
    setMyWallet(inputMyWallet);
    const setupMyWalletList = async () => {
      const balances = await alchemy.core.getTokenBalances(inputMyWallet);

      const myCoinsPromises = balances.tokenBalances.map((b) =>
        fetchCoinData(b, alchemy)
      );

      const myCoins = (await Promise.all(myCoinsPromises)).filter(
        (coin) => coin !== null
      );
      setMyCoins(myCoins);
    };

    setupMyWalletList();
    setInputMyWallet("");
  };

  const removeCoin = (coin: string) => {
    setCoins((preCoins) => preCoins.filter((c) => c !== coin));
  };
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.toLocaleLowerCase())}
      />
      <button onClick={addCoin}>코인 추가</button>

      <div id="coin-container">
        {coins.map((coin) => (
          <CoinContainer
            key={coin}
            coin={coin}
            data={coinData[coin]}
            onRemove={removeCoin}
          />
        ))}
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <h2>My Coins</h2>
      {myWallet && <h2>{myWallet}</h2>}
      <input
        type="text"
        value={inputMyWallet}
        onChange={(e) => setInputMyWallet(e.target.value)}
      />
      <button onClick={addMyWallet}>내 지갑주소 추가</button>
      <button onClick={toggleCoins}>{showCoins ? "접기" : "펼치기"}</button>
      <button onClick={reset}>초기화</button>
      {showCoins && (
        <div>
          <div>
            {myCoins.map((mc) => {
              return <MyCoinContianer key={mc.symbol + "1"} coin={mc} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
