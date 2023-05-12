import { IExchangeInterface } from "../interfaces/exchangeInterface";
import { SimpleStrategy } from "../strategies/strategy";

interface Position {
    entry: number;
    amount: number;
  }

export class Backtest {
    private exchange: IExchangeInterface;
    private strategy: SimpleStrategy;
    private symbol: string;
    private timeframe: string;
    private initialBalance: number;
    private balance: number;
    private quantity: number = 0;
    private trades: {entry: number, exit: number, profit: number}[] = [];
    private position: Position | null = null;
    
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

            // Buy all
            this.quantity = this.balance / candle.close;
            // update the position
            this.position = { entry: ticker.last, amount: this.balance };
            // update the balnace
            this.balance = 0;
            console.log(`Bought at ${candle.close}`);

        } else if (action === 'sell' && this.quantity > 0 && this.position) {
          
            // sell all
            this.balance = this.quantity * candle.close; 
            // update quantity 
            this.quantity = 0;
            // Add the trade
            const profit = ticker.last - this.position?.entry;
            this.trades.push({entry: this.position?.entry , exit: ticker.last , profit: profit});
            this.position = null;

            console.log(`Sold at ${candle.close}`);
            
        }
      }
      
      const finalBalance = this.balance + this.quantity * ohlcv[ohlcv.length - 1].close;
      console.log(`Initial balance: ${this.initialBalance}`);
      this.calculateMetrics();
    }


    private calculateMetrics() {
        const totalReturn = (this.balance - this.initialBalance) / this.initialBalance;
        const winningTrades = this.trades.filter(trade => trade.profit > 0);
        const losingTrades = this.trades.filter(trade => trade.profit < 0);
        const winRate = winningTrades.length / this.trades.length;
        const averageWin = winningTrades.reduce((sum, trade) => sum + trade.profit, 0) / winningTrades.length;
        const averageLoss = losingTrades.reduce((sum, trade) => sum + trade.profit, 0) / losingTrades.length;
        const profitFactor = -averageWin / averageLoss;
        
        // Drawdown calculation requires a running balance, which is not currently tracked. 
    
        console.log(`Total Return: ${totalReturn * 100}%`);
        console.log(`Win Rate: ${winRate * 100}%`);
        console.log(`Average Win: ${averageWin}`);
        console.log(`Average Loss: ${averageLoss}`);
        console.log(`Profit Factor: ${profitFactor}`);
      }

  }
  