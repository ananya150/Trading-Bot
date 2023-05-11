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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KrakenInterface = exports.BinanceInterface = void 0;
const ccxt_1 = __importDefault(require("ccxt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class BinanceInterface {
    constructor() {
        this.exchange = new ccxt_1.default.binance({
            apiKey: process.env.BINANCE_API_KEY,
            secret: process.env.BINANCE_SECRET,
        });
    }
    fetchTicker(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exchange.fetchTicker(symbol);
        });
    }
    createOrder(symbol, side, amount, price) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.exchange.createOrder(symbol, 'limit', side, amount, price);
        });
    }
}
exports.BinanceInterface = BinanceInterface;
class KrakenInterface {
    constructor() {
        this.exchange = new ccxt_1.default.kraken({
            apiKey: process.env.KRAKEN_API_KEY,
            secret: process.env.KRAKEN_SECRET,
        });
    }
    fetchTicker(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exchange.fetchTicker(symbol);
        });
    }
    createOrder(symbol, side, amount, price) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.exchange.createOrder(symbol, 'limit', side, amount, price);
        });
    }
}
exports.KrakenInterface = KrakenInterface;
