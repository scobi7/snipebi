SNIPING BOTTTTTT

0. Initialize NGROK to setup a live server. 
   Connect to Helius Webhook for live on-chain data
   ngrok http 3000 to start, then make sure the forwarding address is updated in your Helius Webhook

1. pull the following parameters of certain CA's:
    -signature
    -TVL (total value locked)
    -volume
    -holders
    -24hr trades
    -etc

Done with this for the most part. I cannot access most of the parameters.
Just the pricing and 24hr vol change. Need to figure out how to get more in order to train a model to decide on coins. Also I think Helius is just outputting most recent coins put on DEXSCREENER so I need some filtering

2. analyze data and find a coin to buy
    -could also use https://gmgn.ai/?chain=sol to verify wallet accuracy
    
    -check if token has a twitter or telegram
        a. check followers and support
        b. use NLM to see sentement is positive stigma or negative
        c. give it a rating score. can use maybe Vader or textblob then
            a telegram or twitter scraper
    
    -liquidity checks:
        a. holder amount?
        b. trading volume
        c. anti-rug (top holder <5%)
        d. locked liquidity



3. copying whales
    -identify whale wallets who can potentially give me insight to 
        new tokens to buy

