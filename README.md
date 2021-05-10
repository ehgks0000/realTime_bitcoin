# 비트코인 실시간 가격으로

# 크롬 익스텐션 만들어보기

## 바이낸스 webSocket을 이용한 실시간 가격 반영

- api : wss://stream.binance.com:9443/ws/btcusdt@trade

- payload

```
Received Payload:


{
  "stream": "allTickers",
  "data": [
    {
      "e": "24hrTicker",  // Event type
      "E": 123456789,     // Event time
      "s": "ABC_0DX-BNB",      // Symbol
      "p": "0.0015",      // Price change
      "P": "250.00",      // Price change percent
      "w": "0.0018",      // Weighted average price
      "x": "0.0009",      // Previous day's close price
      "c": "0.0025",      // Current day's close price
      "Q": "10",          // Close trade's quantity
      "b": "0.0024",      // Best bid price
      "B": "10",          // Best bid quantity
      "a": "0.0026",      // Best ask price
      "A": "100",         // Best ask quantity
      "o": "0.0010",      // Open price
      "h": "0.0025",      // High price
      "l": "0.0010",      // Low price
      "v": "10000",       // Total traded base asset volume
      "q": "18",          // Total traded quote asset volume
      "O": 0,             // Statistics open time
      "C": 86400000,      // Statistics close time
      "F": "0",           // First trade ID
      "L": "18150",       // Last trade Id
      "n": 18151          // Total number of trades
    },
    {
      ...
    }]
}
```

주소 : https://docs.binance.org/api-reference/dex-api/ws-streams.html
