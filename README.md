# Eobot-api - a Node.js implementation with telegram for access Eobot public API

![Eobot API](https://www.eobot.com/eobotlogo.png "Eobot.com")

This is a implementation from original node modulefor the API of the Cloud mining and Bitcoin mining [Eobot.com](https://www.eobot.com/)   


## API Implementation

I edited a API listed in the developers page and from [polilluminato/eobot-api](https://github.com/polilluminato/eobot-api) .

I used supertest as fake browser to request GET paramenters required by Eobot to be used with [node-telgram-bot-api](https://github.com/yagop/node-telegram-bot-api)

```shell
git clone https://www.github.com/lunhg/telegram-eobot-api.git
cd telegram-eobot-api
npm install
```

create a .env file with the following contents

```
EOBOT_USER_ID=<YOUR ID>
EOBOT_USER_EMAIL='<YOUR EMAIL>'
EOBOT_USER_API_KEY='<YOUR EOBOT API KEY>'
```

edit the `eobot-cron` file to fits your needs


## Commands

  - `/start` - show all commands
  - `/balances` - show all balances
  - `/balance <COIN>` - show the <COIN> balances
  - `/speed` - show the account speed
  - `/estimate <AMOUNT> <COIN> to <COIN2>` - estimate exchange between two coins (where <AMOUN> is a number in floating point format and <COIN> is the asset to be exchanged by another currency, <COIN2>)
  - `/exchange <AMOUNT> <COIN> to <COIN2>` - exchange between two coins (where <AMOUN> is a number in floating point format and <COIN> is the asset to be exchanged by another currency, <COIN2>)
  - `/mining` - show the current mining mode
  - `/mining_mode <COIN | DIVERSIFY>` - set the current mining mode (where <COIN> is the manual way to set one mining mode and <DIVERSIFY> is a strategy defined in `strategy.js` file)

## Donation

Help mantain this project:

  - BTC: `386CjsgCMSXpXmfwPGmN25KqcgcNSdLjds`
  - BCC: `bitcoincash:qrwfzjkk2wer8l5729uz0ujlufeexqd4mygmu9247z`
  - ETH: `0x5b4cfd9ccaf7c17b06ecb24edb458950af8e27ea`
  - LTC: `LUBzwebftpaUxRoxUB4AsgVnW1W8JaDRvs`
  - DASH: `Xtk4rsa1sXcY1GocfKmqTPf5WkzpddHH6P`
  - DOGE: `DKaHofqMYra47Em23vYsoWJuLwBffMACCG`
  - XMR: `44gY6Wmw1hUWZ9sky6JRXAEgxnvA9cUfr8Je24urPSzs8Uo9pJp9vR3WbwaVe4vUMveKAzAiA4j8xgUi29TpKXpm42r5Dy1`