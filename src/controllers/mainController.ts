import { BinanceInterface, KrakenInterface } from '../interfaces/exchangeInterface';
import { SimpleStrategy } from '../strategies/strategy';
import { logger } from '../loggers/logger';

export class MainController {
    private binance: BinanceInterface;
    private kraken: KrakenInterface;
    private strategy: SimpleStrategy;

    constructor() {
        this.binance = new BinanceInterface();
        this.kraken = new KrakenInterface();
        // Choose one exchange for the strategy
        this.strategy = new SimpleStrategy(this.binance, 'BTC', 'USD', 50000, 60000);
      }
 
      async run() {
        try{
            // Run the strategy every minute
            setInterval(async () => {
              await this.strategy.execute();
            }, 60 * 1000);
          } catch (error) {
            logger.error(`Failed to run controller: ${error}`);
          }    
        }  
      
}