import { useEffect, useState } from 'react';
import { fetchTokenPrices } from '../helpers/tonPrice';

export function useTonTokenPrices(tokenAddresses: string[]) {
  const [prices, setPrices] = useState<{ [address: string]: { USD: number, BRL: number } }>({});

  useEffect(() => {
    async function fetchPrices() {
      const result = await fetchTokenPrices(tokenAddresses);
      setPrices(result);
    }
    fetchPrices();
  }, [tokenAddresses]);

  return prices;
} 