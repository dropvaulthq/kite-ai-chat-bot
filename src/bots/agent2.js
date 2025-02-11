import { displayBanner } from '../utils/bannerUtils.js';
import chalk from 'chalk';
import axios from 'axios';
import 'dotenv/config';

displayBanner();
console.log(chalk.green('> Starting Model 2 ...\n================================\n'));

class KiteAIBot {
    constructor() {
        this.firstEndpoint = process.env.FIRST_ENDPOINT_2;
        this.agentId = process.env.AGENT_ID_2;
        this.walletAddress = process.env.WALLET_ADDRESS;
        this.reportEndpoint = "https://quests-usage-dev.prod.zettablock.com/api/report_usage";
        this.requestDelay = 60000; // 60 seconds
        this.firstPayload = {
            message: 'What do you think of this transaction? 0x252c02bded9a24426219248c9c1b065b752d3cf8bedf4902ed62245ab950895b',
            stream: true
        };
    }

    // Method to post to the first endpoint
    async postToFirstEndpoint() {
        try {
            const response = await axios.post(this.firstEndpoint, this.firstPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Agent-ID': this.agentId
                },
                responseType: 'stream'
            });

            let responseText = '';

            // Collecting responses from streams
            response.data.on('data', (chunk) => {
                const chunkStr = chunk.toString();
                if (chunkStr.trim() === 'data: [DONE]') {
                    // If stream is complete, send report
                    this.sendReport(responseText);
                } else {
                    const data = JSON.parse(chunkStr.replace('data: ', ''));
                    if (data.choices && data.choices[0].delta.content) {
                        responseText += data.choices[0].delta.content;
                    }
                }
            });

        } catch (error) {
            console.error('Error posting to first endpoint:', error);
        }
    }

    // Method to send report to the second endpoint with retry mechanism
    async sendReport(responseText, retryCount = 3) {
        const reportPayload = {
            wallet_address: this.walletAddress,
            agent_id: this.agentId,
            request_text: this.firstPayload.message,
            response_text: responseText,
            request_metadata: {}
        };

        try {
            const response = await axios.post(this.reportEndpoint, reportPayload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Report sent successfully:', response.data);
        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount > 0) {
                // If rate limit is exceeded, retry after delay
                console.log(`Rate limit exceeded. Retrying in ${this.requestDelay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, this.requestDelay));
                await this.sendReport(responseText, retryCount - 1); // Retry
            } else {
                console.error('Error sending report:', error);
            }
        }
    }

    // Method to run the bot repeatedly
    async run() {
        while (true) {
            await this.postToFirstEndpoint();
            console.log('Waiting for the next request...');
            await new Promise(resolve => setTimeout(resolve, this.requestDelay)); // Delay between requests
        }
    }
}

export default KiteAIBot;