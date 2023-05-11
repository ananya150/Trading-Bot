import { IExchangeInterface } from '../interfaces/exchangeInterface';
import { logger } from '../loggers/logger';

export class SimpleStrategy {
    private exchange: IExchangeInterface;
    private baseCurrency: string;
    private quoteCurrency: string;
    private lowThreshold: number;
    private highThreshold: number;

    constructor(exchange: IExchangeInterface, baseCurrency: string, quoteCurrency: string, lowThreshold: number, highThreshold: number) {
        this.exchange = exchange;
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.lowThreshold = lowThreshold;
        this.highThreshold = highThreshold;
    }

    async execute() {
        
        try {
            const symbol = `${this.baseCurrency}/${this.quoteCurrency}`;
            const ticker = await this.exchange.fetchTicker(symbol);

            if (ticker.last < this.lowThreshold) {
                console.log(`Buying ${symbol} at ${ticker.last}`);
                // TODO: Determine the amount to buy
                await this.exchange.createOrder(symbol, 'buy', 1, ticker.last);
    
              } else if (ticker.last > this.highThreshold) {
    
                console.log(`Selling ${symbol} at ${ticker.last}`);
                // TODO: Determine the amount to sell
                await this.exchange.createOrder(symbol, 'sell', 1, ticker.last);
              }
            
        }catch (error) {
            logger.error(`Failed to execute strategy: ${error}`)
        }
    }      
}
