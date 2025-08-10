export async function fetchTonBalance(address: string): Promise<number> {
  const res = await fetch(`https://tonapi.io/v2/accounts/${address}`);
  const data = await res.json();
  return data.balance ? Number(data.balance) / 1e9 : 0;
}

export async function fetchJettonBalances(address: string): Promise<{ [jettonAddress: string]: number }> {
  const res = await fetch(`https://tonapi.io/v2/accounts/${address}/jettons`);
  const data = await res.json();
  const balances: { [jettonAddress: string]: number } = {};
  if (data.balances) {
    for (const jetton of data.balances) {
      balances[jetton.jetton.address] = Number(jetton.balance) / Math.pow(10, jetton.jetton.decimals || 9);
    }
  }
  return balances;
} 