const axios = require('axios');
const secrets = require('./dontshow.json');

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
            return response.data.data;
        } else {
            console.error("Failed to fetch token price. Status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error while calling Birdeye API:", error.message);
        return null;
    }
}

module.exports = { getTokenPrice };
