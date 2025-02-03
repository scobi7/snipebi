const axios = require('axios');
const cheerio = require('cheerio'); // Web scraping library

async function getDexScreenerData(tokenMint) {
    const url = `https://dexscreener.com/solana/${tokenMint}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let liquidity = $('div:contains("Liquidity")').next().text();
        let volume24h = $('div:contains("24H Volume")').next().text();
        let buys = $('div:contains("Buys")').next().text();
        let sells = $('div:contains("Sells")').next().text();

        liquidity = liquidity.replace(/\$|,/g, '') || "0"; // Convert to number
        volume24h = volume24h.replace(/\$|,/g, '') || "0"; // Convert to number
        buys = parseInt(buys) || 0;
        sells = parseInt(sells) || 0;

        return {
            liquidity: parseFloat(liquidity),
            volume24h: parseFloat(volume24h),
            buys,
            sells
        };
    } catch (error) {
        console.error("Failed to fetch DexScreener data:", error.message);
        return null;
    }
}

module.exports = { getDexScreenerData };
