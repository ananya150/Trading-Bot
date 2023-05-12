import ccxt from 'ccxt';
import dotenv from 'dotenv';

dotenv.config();

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}


export interface IExchangeInterface {
    fetchTicker: (symbol: string) => Promise<any>;
    createOrder: (symbol: string, side: 'buy' | 'sell', amount: number, price: number) => Promise<void>;
    fetchOHLCV(symbol: string, timeframe: string, since?: number, limit?: number): Promise<OHLCV[]>;
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

    async fetchOHLCV(symbol: string, timeframe: string, since?: number, limit: number = 100): Promise<OHLCV[]> {
      const ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe, since, limit);
      return ohlcv.map(([timestamp, open, high, low, close, volume]:number[]) => ({ timestamp, open, high, low, close, volume }));
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

    async fetchOHLCV(symbol: string, timeframe: string, since?: number, limit: number = 100): Promise<OHLCV[]> {
      const ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe, since, limit);
      return ohlcv.map(([timestamp, open, high, low, close, volume]:number[]) => ({ timestamp, open, high, low, close, volume }));
    }
    
  }
  