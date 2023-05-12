import { Backtest } from "../backtest/backtest";
import { BinanceInterface } from "../interfaces/exchangeInterface";
import { SimpleStrategy } from "../strategies/strategy";

const exchange = new BinanceInterface();
const strategy = new SimpleStrategy(exchange, 'BTC/USDT', 5, 20);
const backtest = new Backtest(exchange, strategy, 'BTC/USDT', '1h', 1000);

backtest.run().then(() => {
    console.log('Backtest completed');
  }).catch(error => {
    console.error('An error occurred during the backtest:', error);
  });
  