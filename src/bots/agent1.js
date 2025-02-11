import { displayBanner } from '../utils/bannerUtils.js';
import chalk from 'chalk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'

displayBanner();
console.log(chalk.green('> Starting Agent 1 (PROFESSOR) ...\n================================\n'));

class KiteAIBot {
    constructor() {
        this.firstEndpoint = process.env.FIRST_ENDPOINT_1;
        this.reportEndpoint = 'https://quests-usage-dev.prod.zettablock.com/api/report_usage';
        this.agentId = process.env.AGENT_ID_1;
        this.walletAddress = process.env.WALLET_ADDRESS;
    }

    async processStream(response) {
        let fullText = '';

        // Split the response by newlines to handle individual data chunks
        const lines = response.data.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const jsonStr = line.replace('data: ', '');

                    // Skip if the line is "[DONE]"
                    if (jsonStr.trim() === '[DONE]') {
                        continue;
                    }

                    const jsonData = JSON.parse(jsonStr);

                    // Check if there's content in the delta
                    if (jsonData.choices[0].delta.content) {
                        fullText += jsonData.choices[0].delta.content;
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
        }

        return fullText.trim();
    }

    async askQuestion(message) {
        try {
            // First request to get the AI response
            const mainResponse = await axios.post(this.firstEndpoint, {
                message,
                stream: true
            }, {
                responseType: 'text'
            });

            // Process the streamed response
            const responseText = await this.processStream(mainResponse);

            // Second request to report usage
            const reportResponse = await axios.post(this.reportEndpoint, {
                wallet_address: this.walletAddress,
                agent_id: this.agentId,
                request_text: message,
                response_text: responseText,
                request_metadata: {}
            });

            return {
                success: true,
                response: responseText,
                reportStatus: reportResponse.data
            };

        } catch (error) {
            console.error('Error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Function to read messages from messages.txt
function readMessages() {
    const filePath = path.join(process.cwd(), 'messages.txt');
    const messages = fs.readFileSync(filePath, 'utf-8').split('\n').filter(line => line.trim() !== '');
    return messages;
}

// Example usage
const bot = new KiteAIBot();
const messages = readMessages();

// Function to loop through messages indefinitely
async function runBot() {
    let index = 0;
    while (true) {
        const message = messages[index];
        console.log(`Asking: ${message}`);
        const result = await bot.askQuestion(message);
        console.log(result);

        // Move to the next message, or restart from the beginning
        index = (index + 1) % messages.length;

        // Optional: Add a delay between questions (e.g., 5 seconds)
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

// Start the bot
runBot();

export default KiteAIBot;