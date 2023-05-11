import ccxt from 'ccxt';
import dotenv from 'dotenv';

dotenv.config();

export interface IExchangeInterface {
    fetchTicker: (symbol: string) => Promise<any>;
    createOrder: (symbol: string, side: 'buy' | 'sell', amount: number, price: number) => Promise<void>;
}

export class BinanceInterface implements IExchangeInterface {

    private exchange: any;

    constructor() {
        this.exchange = new ccxt.binance({
            apiKey: process.env.BINANCE_API_KEY,
            secret: process.env.BINANCE_SECRET,  
        })
    }

    async fetchTicker(symbol: string) : Promise<any> {
        return this.exchange.fetchTicker(symbol);
    }

    async createOrder(symbol: string, side: 'buy' | 'sell', amount: number, price: number): Promise<void> {
        await this.exchange.createOrder(symbol, 'limit', side, amount, price);
    }
} 

export class KrakenInterface implements IExchangeInterface {
    private exchange: any;
  
    constructor() {
      this.exchange = new ccxt.kraken({
        apiKey: process.env.KRAKEN_API_KEY,
        secret: process.env.KRAKEN_SECRET,
      });
    }
  
    async fetchTicker(symbol: string): Promise<any> {
      return this.exchange.fetchTicker(symbol);
    }
  
    async createOrder(symbol: string, side: 'buy' | 'sell', amount: number, price: number): Promise<void> {
      await this.exchange.createOrder(symbol, 'limit', side, amount, price);
    }
  }
  