import { BinanceInterface } from '../../src/interfaces/exchangeInterface';

describe('BinanceInterface' , () => {
    let binance: BinanceInterface;

    beforeEach(() => {
        binance = new BinanceInterface();
      });

    test('fetchTicker' , async () => {
        const ticker = await binance.fetchTicker('BTC/USDT');
        expect (ticker).toHaveProperty('symbol' , 'BTC/USDT');
        expect(ticker).toHaveProperty('last');
        expect(ticker.last).toBeGreaterThan(0);
    })

})