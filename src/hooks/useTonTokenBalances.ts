import { useEffect, useState } from 'react';
import { fetchTonBalance, fetchJettonBalances } from '../helpers/tonApi';

export function useTonTokenBalances(address: string | null, tokens: { symbol: string, address: string | null }[]) {
  const [balances, setBalances] = useState<{ [symbol: string]: number } | null>(null);

  useEffect(() => {
    if (!address) return;
    let isMounted = true;
    async function fetchBalances() {
      const result: { [symbol: string]: number } = {};
      // TON nativo
      const tonToken = tokens.find(t => t.symbol === 'TON');
      if (tonToken && typeof address === 'string') {
        result['TON'] = await fetchTonBalance(address);
      }
      // Jettons
      const jettons = tokens.filter(t => t.address && t.symbol !== 'TON');
      if (jettons.length > 0 && typeof address === 'string') {
        const jettonBalances = await fetchJettonBalances(address);
        for (const token of jettons) {
          result[token.symbol] = jettonBalances[token.address!] || 0;
        }
      }
      if (isMounted) setBalances(result);
    }
    fetchBalances();
    return () => { isMounted = false; };
  }, [address, tokens]);

  return balances;
} 