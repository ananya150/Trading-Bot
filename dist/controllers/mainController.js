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
exports.MainController = void 0;
const exchangeInterface_1 = require("../interfaces/exchangeInterface");
const strategy_1 = require("../strategies/strategy");
const logger_1 = require("../loggers/logger");
class MainController {
    constructor() {
        this.binance = new exchangeInterface_1.BinanceInterface();
        this.kraken = new exchangeInterface_1.KrakenInterface();
        // Choose one exchange for the strategy
        this.strategy = new strategy_1.SimpleStrategy(this.binance, 'BTC', 'USD', 50000, 60000);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Run the strategy every minute
                setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.strategy.execute();
                }), 60 * 1000);
            }
            catch (error) {
                logger_1.logger.error(`Failed to run controller: ${error}`);
            }
        });
    }
}
exports.MainController = MainController;
