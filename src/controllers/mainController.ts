import { BinanceInterface, KrakenInterface } from '../interfaces/exchangeInterface';
import { SimpleStrategy } from '../strategies/strategy';

export class MainController {
    private binance: BinanceInterface;
    private kraken: KrakenInterface;
    private strategy: SimpleStrategy;

    constructor() {
        this.binance = new BinanceInterface();
        this.kraken = new KrakenInterface();
        // Choose one exchange for the strategy
        this.strategy = new SimpleStrategy(this.binance, 'BTC', 'USD', 30000, 40000);
      }
 
      async run() {
        // Run the strategy every minute
        setInterval(async () => {
          await this.strategy.execute();
        }, 60 * 1000);
      }    
      
}