# Markov-Chain-Telegram-Bot

A simple bot for Telegram that reproduces the Markov Chain. 
You can chat with him and he will respond based on your text. 
It is not a perfect interlocutor yet, but from time to time he can give you adequate answer.

## Content

- [Requirements](#requirements)
- [Production](#production)
- [Installation](#installation)
- [Deployment](#deployment)
- [Example](#example)
- [License](#license)

## Requirements

- [Node.js](https://nodejs.org)
- [Python 3.x](https://www.python.org/)
- [Git](https://git-scm.com)
- [Yarn](https://yarnpkg.com)
- [Curl](https://curl.haxx.se/)

Expected that all above software available as a global in terminal. 
Node.js available as a `node`, Python available as a `python3`.

If you want to host this server somewhere, then you need install additional software. See your host installation guide.

## Production

**This app is not intended for production!** This app is only for demonstrating the approach.

## Installation

All subsequent guidelines is about Unix systems (particular is about Linux). You may need make some changes on your own if you work on Windows.

1) Clone this repository.
```bash
git clone https://github.com/Amaimersion/Markov-Chain-Telegram-Bot.git
cd Markov-Chain-Telegram-Bot
git submodule update --init
```

2) Install packages and build.
```bash
yarn
```

3) Create pre-generated Markov Chain file and place that file in the `./src/markov-chain/generated-chains` directory. See [this](https://github.com/Amaimersion/markov-chain#installation) for details. 
Then open `./src/markov-chain/main.py` and change file path and window number.
```python
~20: chain.chain = extensions.file.json.read("<file path>")
~29: start_text = handle_input_text(start_text, <window number>)
```

Current `main.py` developed for JSON base. If you want to use another format, then you should make changes for this. See [this](https://github.com/Amaimersion/markov-chain#jsonpicklesqlite-file) for details.

4) Choose a way from these two how you want to use this server:

### Telegram Bot Usage

1) Create `.env` file and fill out it. See `.env.example` for example.

2) [Deploy the files on a PaaS platform](#deployment).

3) Make sure your deployed server is running. If not, then you can do that with that command (you should type in the deployed server console, not local)
```bash
yarn run start
```

4) [Set a webhook](https://core.telegram.org/bots/api#setwebhook)
```bash
curl --data "url=<your server url>" https://api.telegram.org/bot<your bot token>/setWebhook
```

**Russians users may need a proxy**
```bash
curl --data "url=<your server url>" --proxy <[protocol://][user:password@][proxyhost][:port]> https://api.telegram.org/bot<your bot token>/setWebhook
```

Make sure you specify a right url. For example, in current server configuration Telegram requests can be handled on `/telegram` url. So, you should specify something like this `--data "url=https://example.com/telegram".`

5) And now you can chat with your own friend!

### Local Usage

1) Start the server in development mode
```bash
yarn run watch-server
```

2) Open another terminal and `cd` in the server directory.

3) Give the permission
```bash
chmod +x ./tests/shell/test-message.sh
```

4) Send request to local server
```bash
./tests/shell/test-message.sh
```

5) In the first terminal you can see the generated message. And now you can chat with ownself!

## Deployment

For example i pick Heroku. 
However, on another PaaS platforms this actions almost similar.

### [Heroku](https://www.heroku.com)

1) Install [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

2) Make sure you in project directory. Create another branch
```bash
git checkout -b heroku
```

3) Create `.env` file if you didn't do that on the master branch.

4) In the `.gitignore` remove `src/markov-chain/generated-chains/*` and `.env`. This files is required.

4) Upload files on Heroku
```bash
git push heroku heroku:master
```

### [Now](https://zeit.co/now)

Now doesn't support `python3` out of the box. 
> In order to install native packages (non npm modules) in your deployment you need to use Docker. There you will be able to install both Node and Python 3 and run your application. - Sergio Xalambrí, Support Engineer at ZEIT

## Example

Try to speak with the bot [@MarkovChain_Bot](https://t.me/MarkovChain_Bot).
**For now this bot speaks only on Russian.**

## License

[MIT](https://github.com/Amaimersion/Markov-Chain-Telegram-Bot/blob/master/LICENSE).
