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
class Backtest {
    constructor(exchange, strategy, symbol, timeframe, initialBalance) {
        this.quantity = 0;
        this.exchange = exchange;
        this.strategy = strategy;
        this.symbol = symbol;
        this.timeframe = timeframe;
        this.initialBalance = initialBalance;
        this.balance = initialBalance;
    }
    run(since, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const ohlcv = yield this.exchange.fetchOHLCV(this.symbol, this.timeframe, since, limit);
            for (const candle of ohlcv) {
                const ticker = { last: candle.close };
                const action = yield this.strategy.execute(ticker);
                if (action === 'buy' && this.balance > 0) {
                    this.quantity = this.balance / candle.close; // Buy as much as we can
                    this.balance = 0;
                    console.log(`Bought at ${candle.close}`);
                }
                else if (action === 'sell' && this.quantity > 0) {
                    this.balance = this.quantity * candle.close; // Sell all
                    this.quantity = 0;
                    console.log(`Sold at ${candle.close}`);
                }
            }
            const finalBalance = this.balance + this.quantity * ohlcv[ohlcv.length - 1].close;
            console.log(`Initial balance: ${this.initialBalance}`);
            console.log(`Final balance: ${finalBalance}`);
            console.log(`Return: ${(finalBalance - this.initialBalance) / this.initialBalance * 100}%`);
        });
    }
}
exports.Backtest = Backtest;
