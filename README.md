# Blum Payload Generator

This helps you to generate blum encrypted payload without WebAssembly. You already have example for implenting in `python` and `node`. Ask AI to generate similar code in other language if you want.

```jsonc
{
  "version": 1.2, //This may change if they update web assembly
  "gameId": "abcd-efghi-jklmno-292ddhdjh", //Game Id
  "challenge": {
    "nonce": 69000,
    "hash": "0000690000000000000000000000aed"
  },
  "earnedPoints": { "BP": { "amount": 143 } },
  "assetClicks": {
    "BOMB": { "clicks": 0 }, //💣 bomb
    "CLOVER": { "clicks": 143 }, //🍀 clover
    "FREEZE": { "clicks": 2 } //❄️ freeze
  },
  "isNode": false //Keep it false for safety
}
```
