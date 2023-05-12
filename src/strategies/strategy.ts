import { IExchangeInterface  } from '../interfaces/exchangeInterface';
import { SMA } from 'technicalindicators';
import { logger } from '../loggers/logger';

export class SimpleStrategy {
    private exchange: IExchangeInterface;
    private symbol: string;
    // private period: number;
    private shortPeriod: number;
    private longPeriod: number;
    private priceHistory: number[];
    private shortSMA: SMA;
    private longSMA: SMA;

    constructor(exchange: IExchangeInterface, symbol: string, shortPeriod: number, longPeriod: number) {
        this.exchange = exchange;
        this.symbol = symbol;
        this.shortPeriod = shortPeriod;
        this.longPeriod = longPeriod;
        this.priceHistory = [];
        this.shortSMA = new SMA({ period: this.shortPeriod, values: [] });
        this.longSMA = new SMA({ period: this.longPeriod, values: [] });
      }

      async execute(): Promise<void> {
        
        const ticker: any = await this.exchange.fetchTicker(this.symbol);
        this.priceHistory.push(ticker.last);
    
        if (this.priceHistory.length > this.longPeriod) {
          this.priceHistory.shift();  // remove oldest price
        }
    
        const shortSMAValue = this.shortSMA.nextValue(ticker.last);
        const longSMAValue = this.longSMA.nextValue(ticker.last);
    
        if (shortSMAValue && longSMAValue) {
          if (shortSMAValue > longSMAValue) {
            console.log('BUY signal', ticker.last);
            // Here you would add the code to place a buy order
          } else if (shortSMAValue < longSMAValue) {
            console.log('SELL signal', ticker.last);
            // Here you would add the code to place a sell order
          }
        }
      }
    

}
