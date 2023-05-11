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
exports.SimpleStrategy = void 0;
const logger_1 = require("../loggers/logger");
class SimpleStrategy {
    constructor(exchange, baseCurrency, quoteCurrency, lowThreshold, highThreshold) {
        this.exchange = exchange;
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.lowThreshold = lowThreshold;
        this.highThreshold = highThreshold;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const symbol = `${this.baseCurrency}/${this.quoteCurrency}`;
                const ticker = yield this.exchange.fetchTicker(symbol);
                if (ticker.last < this.lowThreshold) {
                    console.log(`Buying ${symbol} at ${ticker.last}`);
                    // TODO: Determine the amount to buy
                    yield this.exchange.createOrder(symbol, 'buy', 1, ticker.last);
                }
                else if (ticker.last > this.highThreshold) {
                    console.log(`Selling ${symbol} at ${ticker.last}`);
                    // TODO: Determine the amount to sell
                    yield this.exchange.createOrder(symbol, 'sell', 1, ticker.last);
                }
            }
            catch (error) {
                logger_1.logger.error(`Failed to execute strategy: ${error}`);
            }
        });
    }
}
exports.SimpleStrategy = SimpleStrategy;
