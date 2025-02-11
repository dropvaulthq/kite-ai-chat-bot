# KITE AI CHAT BOT
Kite AI Bot is a Node.js bot designed to interact with two API endpoints. It will send a request to the first endpoint, collect the response, and then send a report to the second endpoint. It also comes with a retry mechanism to handle rate limits.

## Features
- Sends a POST request to the first endpoint with a specified payload.
- Collects the response from the first endpoint in the form of a stream.
- Sends a report to the second endpoint with the collected data.
- Handles rate limit with retry mechanism.
- Runs iteratively with configurable delay.

## Prerequisites
- Node.js v20 or higher
- NPM (Node Package Manager)
- Wallet Address

## Configuration
Copy `.env-example` to `.env`

1. Login to [Kite AI Website](https://testnet.gokite.ai?r=bA3F7p34)
2. Scroll down and click "Interact", and you will be redirected to another page.
![alt text](image.png)

3. `ctrl` + `shift` + `c` to open inspect element.
4. Click "Network" tab (1).
5. On the left sidebar, you can select an agent. There are 2 agents that we have created to interact automatically. They are:
    - `Agent 1`: Proffesor
    - `Agent 2`: Sharelock
6. Click the agent (2).
7. Click the quick chat button (3).
8. Click "main" request (4).
9. Copy "Request URL" and store it in the `FIRST_ENDPOINT_<?>` (`.env`) variable that has been customised with the agent selected from the website. (5).
![alt text](image-1.png)
10. Click "report_usage" request (1)
11. Click "Payload" tab (2).
12. Copy your "agent_id" and store it in the `AGENT_ID_<?>` (`.env`) variable that has been customised with the agent selected from the website..
![alt text](image-2.png)
13. Paste your wallet address into the `WALLET_ADDRESS` (`.env`) variable.
14. ✅ Done!

## Installation
1. Clone this repository
```
git clone https://github.com/dropvaulthq/kite-ai-chat-bot
cd kite-ai-chat-bot
```

2. Install dependencies:
```
npm install
```

3. Usage
```bash
npm run start:agent1 # to run agent 1
npm run start:agent2 # to run agent 2
```

## Donations
If you would like to support the development of this project, you can make a donation using the following addresses:


- **Solana**: `AyqspD9yMBWNTq7jv8dUx9YLgvctsaGdVGN8oGmZn2np`
- **EVM**: `0xFFc3448Fb50d9B053e7Ae03B72f45c85fC0EfC56`

## Licence

[MIT License](./LICENSE)