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
const technicalindicators_1 = require("technicalindicators");
class SimpleStrategy {
    constructor(exchange, symbol, shortPeriod, longPeriod) {
        this.exchange = exchange;
        this.symbol = symbol;
        this.shortPeriod = shortPeriod;
        this.longPeriod = longPeriod;
        this.priceHistory = [];
        this.shortSMA = new technicalindicators_1.SMA({ period: this.shortPeriod, values: [] });
        this.longSMA = new technicalindicators_1.SMA({ period: this.longPeriod, values: [] });
    }
    execute(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ticker) {
                ticker = yield this.exchange.fetchTicker(this.symbol);
            }
            this.priceHistory.push(ticker.last);
            if (this.priceHistory.length > this.longPeriod) {
                this.priceHistory.shift(); // remove oldest price
            }
            const shortSMAValue = this.shortSMA.nextValue(ticker.last);
            const longSMAValue = this.longSMA.nextValue(ticker.last);
            if (shortSMAValue && longSMAValue) {
                if (shortSMAValue > longSMAValue) {
                    // console.log('BUY signal', ticker.last);
                    return 'buy';
                }
                else if (shortSMAValue < longSMAValue) {
                    // console.log('SELL signal', ticker.last);
                    return 'sell';
                }
            }
            return 'hold';
        });
    }
}
exports.SimpleStrategy = SimpleStrategy;
