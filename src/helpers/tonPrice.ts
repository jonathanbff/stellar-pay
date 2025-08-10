export async function fetchTokenPrices(tokenAddresses: string[]): Promise<{ [address: string]: { USD: number, BRL: number } }> {
  const prices: { [address: string]: { USD: number, BRL: number } } = {};

  // TON price
  if (tokenAddresses.includes('ton')) {
    const res = await fetch('https://tonapi.io/v2/rates?tokens=ton');
    const data = await res.json();
    prices['ton'] = {
      USD: data.rates.ton.prices.USD,
      BRL: data.rates.ton.prices.BRL
    };
  }

  // Jettons price
  for (const address of tokenAddresses) {
    if (address !== 'ton') {
      const res = await fetch(`https://tonapi.io/v2/jettons/${address}`);
      const data = await res.json();
      prices[address] = {
        USD: data.price?.prices?.USD || 0,
        BRL: data.price?.prices?.BRL || 0
      };
    }
  }

  return prices;
} 