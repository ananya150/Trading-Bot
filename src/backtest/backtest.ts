import { IExchangeInterface } from "../interfaces/exchangeInterface";
import { SimpleStrategy } from "../strategies/strategy";

export class Backtest {
    private exchange: IExchangeInterface;
    private strategy: SimpleStrategy;
    private symbol: string;
    private timeframe: string;
    private initialBalance: number;
    private balance: number;
    private quantity: number = 0;
    
    constructor(exchange: IExchangeInterface, strategy: SimpleStrategy, symbol: string, timeframe: string, initialBalance: number) {
      this.exchange = exchange;
      this.strategy = strategy;
      this.symbol = symbol;
      this.timeframe = timeframe;
      this.initialBalance = initialBalance;
      this.balance = initialBalance;
    }
  
    async run(since?: number, limit?: number): Promise<void> {
      const ohlcv = await this.exchange.fetchOHLCV(this.symbol, this.timeframe, since, limit);
      
      for (const candle of ohlcv) {
        const ticker: any = { last: candle.close };
        const action = await this.strategy.execute(ticker);
        
        if (action === 'buy' && this.balance > 0) {
          this.quantity = this.balance / candle.close;  // Buy as much as we can
          this.balance = 0;
          console.log(`Bought at ${candle.close}`);
        } else if (action === 'sell' && this.quantity > 0) {
          this.balance = this.quantity * candle.close;  // Sell all
          this.quantity = 0;
          console.log(`Sold at ${candle.close}`);
        }
      }
      
      const finalBalance = this.balance + this.quantity * ohlcv[ohlcv.length - 1].close;
      console.log(`Initial balance: ${this.initialBalance}`);
      console.log(`Final balance: ${finalBalance}`);
      console.log(`Return: ${(finalBalance - this.initialBalance) / this.initialBalance * 100}%`);
    }
  }
  