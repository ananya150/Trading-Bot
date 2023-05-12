"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backtest = void 0;
const logger_1 = require("../loggers/logger");
class Backtest {
    constructor(exchange, strategy, symbol, timeframe, initialBalance) {
        this.quantity = 0;
        this.trades = [];
        this.position = null;
        this.exchange = exchange;
        this.strategy = strategy;
        this.symbol = symbol;
        this.timeframe = timeframe;
        this.initialBalance = initialBalance;
        this.balance = initialBalance;
    }
    run(since, limit) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const ohlcv = yield this.exchange.fetchOHLCV(this.symbol, this.timeframe, since, limit);
            for (const candle of ohlcv) {
                const ticker = { last: candle.close };
                const action = yield this.strategy.execute(ticker);
                if (action === 'buy' && this.balance > 0) {
                    // Buy all
                    this.quantity = this.balance / candle.close;
                    // update the position
                    this.position = { entry: ticker.last, amount: this.balance };
                    // update the balnace
                    this.balance = 0;
                    logger_1.logger.info(`Bought at ${candle.close}`);
                }
                else if (action === 'sell' && this.quantity > 0 && this.position) {
                    // sell all
                    this.balance = this.quantity * candle.close;
                    // update quantity 
                    this.quantity = 0;
                    // Add the trade
                    const profit = ticker.last - ((_a = this.position) === null || _a === void 0 ? void 0 : _a.entry);
                    this.trades.push({ entry: (_b = this.position) === null || _b === void 0 ? void 0 : _b.entry, exit: ticker.last, profit: profit });
                    this.position = null;
                    logger_1.logger.info(`Sold at ${candle.close}`);
                }
            }
            const finalBalance = this.balance + this.quantity * ohlcv[ohlcv.length - 1].close;
            console.log(`Initial balance: ${this.initialBalance}`);
            this.calculateMetrics();
        });
    }
    calculateMetrics() {
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
exports.Backtest = Backtest;
