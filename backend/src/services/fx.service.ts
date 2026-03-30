import fetch from 'node-fetch';

const EXCHANGE_RATES_CACHE_KEY = 'exchange_rates';
const EXCHANGE_RATES_TTL = 3600; // 1 hour

interface ExchangeRates {
  [currency: string]: number; // Exchange rate to USD
}

class FxService {
  private static instance: FxService;
  private rates: ExchangeRates = {};
  private lastUpdated: number = 0;

  private constructor() {}

  public static getInstance(): FxService {
    if (!FxService.instance) {
      FxService.instance = new FxService();
    }
    return FxService.instance;
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const now = Date.now();
    
    // Refresh rates if more than TTL
    if (now - this.lastUpdated > EXCHANGE_RATES_TTL * 1000) {
      await this.refreshRates();
    }

    const fromRate = this.rates[fromCurrency.toUpperCase()];
    const toRate = this.rates[toCurrency.toUpperCase()];

    if (!fromRate || !toRate) {
      throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }

    return toRate / fromRate;
  }

  async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
      return amount;
    }

    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  }

  private async refreshRates(): Promise<void> {
    try {
      // Use ECB Euro foreign exchange reference rates (free, no API key)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();

      if (data.rates) {
        this.rates = data.rates;
        this.rates['USD'] = 1.0; // Ensure USD is always present
        this.lastUpdated = Date.now();
        console.log('Exchange rates updated successfully');
      }
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    }
  }
}

export default FxService.getInstance();