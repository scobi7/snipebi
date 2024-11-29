const express = require('express');
const axios = require('axios');
const secrets = require('./dontshow.json'); 

const app = express();
const port = 3000;
const tokenLogs = [];

app.use(express.json());
// Helper function to fetch token price from Birdeye API
async function getTokenPrice(tokenData1) {
    if (!tokenData1 || !tokenData1.mint) {
        console.error("Invalid tokenData1 or missing mint address");
        return null;
    }

    const options = {
        method: 'GET',
        url: 'https://public-api.birdeye.so/defi/price',
        params: { address: tokenData1.mint },
        headers: {
            accept: 'application/json',
            'X-API-KEY': secrets['X-API-KEY'] 
        }
    };

    try {
        const response = await axios.request(options);
        if (response.status === 200 && response.data) {
            return response.data.data; // Return the price data object
        } else {
            console.error("Failed to fetch token price. Status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error while calling Birdeye API:", error.message);
        return null;
    }
}
// Webhook endpoint to process incoming transactions (sniping)
app.post('/webhook', async (request, response) => {
        const requestBody = request.body;
        const signature = requestBody[0]?.signature;

        let tokenData1 = requestBody[0]?.tokenTransfers?.[1]; // Usually the token
        let tokenData2 = requestBody[0]?.tokenTransfers?.[0]; // Usually SOL

        // Handle case where SOL is the first token
        if (requestBody[0]?.tokenTransfers?.[0]?.mint === "So11111111111111111111111111111111111111112") {
            tokenData1 = requestBody[0]?.tokenTransfers?.[1];
            tokenData2 = requestBody[0]?.tokenTransfers?.[0];
        }

        // Check for duplicate transactions
        if (tokenLogs.some(log => log.signature === signature)) {
            return response.send("Duplicate transaction, ignoring.");
        }

        // Ignore trades involving Solana native token
        if (tokenData1.mint === "So11111111111111111111111111111111111111112") {
            console.log("Ignoring trade involving native SOL token.");
            return response.send("Ignored trade involving SOL.");
        }

        tokenLogs.push({ signature, ...tokenData1 });

        console.log("************************************************************************************");
        console.log(`Signature: https://solscan.io/tx/${signature}`);
        console.log("Mint: ", tokenData1.mint);
        console.log("Sol Invested by DEV: ", tokenData2.tokenAmount);
        console.log(`Dexscreener: https://dexscreener.com/solana/${tokenData1.mint}`);

        // Fetch and log token price data
        const priceData = await getTokenPrice(tokenData1);
        if (priceData) {
            console.log(`Price: ${priceData.value || "Unknown"}`);
            //console.log(`24h Price Change: ${priceData.priceChange24h || "Unknown"}`);
        } else {
            console.log("No price data available for this token.");
        }

        console.log("************************************************************************************");

        response.send("Webhook processed");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is successfully running on port ${port}`);
});
