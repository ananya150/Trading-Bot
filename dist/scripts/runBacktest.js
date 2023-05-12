"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backtest_1 = require("../backtest/backtest");
const exchangeInterface_1 = require("../interfaces/exchangeInterface");
const strategy_1 = require("../strategies/strategy");
const exchange = new exchangeInterface_1.BinanceInterface();
const strategy = new strategy_1.SimpleStrategy(exchange, 'BTC/USDT', 5, 20);
const backtest = new backtest_1.Backtest(exchange, strategy, 'BTC/USDT', '1h', 1000);
backtest.run().then(() => {
    console.log('Backtest completed');
}).catch(error => {
    console.error('An error occurred during the backtest:', error);
});
