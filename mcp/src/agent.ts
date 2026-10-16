import { ethers } from "ethers";
import { createEthersAdapterFromPrivateKey } from "@circle-fin/adapter-ethers-v6";
import { loadArcConfig, getCircleChainName, type ArcConfig } from "./config";
import tokens from "./data/arc-tokens.json";

export interface ArcToken {
  symbol: string;
  name: string;
  decimals: number;
  coingeckoId: string;
  addresses: {
    mainnet: string | null;
    testnet: string | null;
  };
}

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export class Agent {
  public walletAddress: string;
  public config: ArcConfig;
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private tokens: ArcToken[];

  private constructor(config: ArcConfig, provider: ethers.JsonRpcProvider, signer: ethers.Wallet) {
    this.config = config;
    this.provider = provider;
    this.signer = signer;
    this.walletAddress = signer.address;
    this.tokens = tokens as ArcToken[];
  }

  static async create(): Promise<Agent> {
    const config = loadArcConfig();
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const signer = new ethers.Wallet(config.privateKey, provider);
    return new Agent(config, provider, signer);
  }

  private getToken(symbol: string): ArcToken | undefined {
    return this.tokens.find((t) => t.symbol.toUpperCase() === symbol.toUpperCase());
  }

  private getTokenAddress(symbol: string): string | null {
    const token = this.getToken(symbol);
    if (!token) return null;
    return this.config.chain === "testnet" ? token.addresses.testnet : token.addresses.mainnet;
  }

  private async getAdapter() {
    return createEthersAdapterFromPrivateKey({
      privateKey: this.config.privateKey,
    });
  }

  async getBalance(): Promise<any> {
    const result: any = {
      walletAddress: this.walletAddress,
      chain: this.config.chain,
      tokens: [],
    };

    for (const token of this.tokens) {
      const address = this.getTokenAddress(token.symbol);
      if (!address) continue;

      try {
        const contract = new ethers.Contract(address, ERC20_ABI, this.provider);
        const balance = await contract.balanceOf(this.walletAddress);
        const formatted = ethers.formatUnits(balance, token.decimals);
        (result.tokens as any[]).push({
          symbol: token.symbol,
          address,
          balance: formatted,
          decimals: token.decimals,
          isNative: token.symbol === "USDC",
        });
      } catch {
        // skip token if error
      }
    }

    return result;
  }

  getPriceSymbols(): string[] {
    return this.tokens.map((t) => t.symbol);
  }

  async getUnifiedBalance(): Promise<any> {
    const adapter = await this.getAdapter();
    const { createUnifiedBalanceKitContext, getBalances } = await import("@circle-fin/unified-balance-kit");
    const context = createUnifiedBalanceKitContext();

    const networkType = this.config.chain === "testnet" ? "testnet" : "mainnet";

    const result = await getBalances(context, {
      sources: [{ adapter }],
      networkType,
      includePending: true,
    });

    return result;
  }

  async sendTokens(symbol: string, to: string, amount: string): Promise<any> {
    const token = this.getToken(symbol);
    if (!token) throw new Error(`Unknown token: ${symbol}`);

    const address = this.getTokenAddress(symbol);
    if (!address) throw new Error(`Token ${symbol} not available on ${this.config.chain}`);

    const contract = new ethers.Contract(address, ERC20_ABI, this.signer);
    const parsedAmount = ethers.parseUnits(amount, token.decimals);
    const tx = await contract.transfer(to, parsedAmount);
    const receipt = await tx.wait();

    return {
      txHash: tx.hash,
      explorer: `${this.config.explorerUrl}/tx/${tx.hash}`,
      symbol,
      to,
      amount,
      blockNumber: receipt?.blockNumber,
    };
  }

  async getSupportedChains(): Promise<any> {
    const balance = await this.getUnifiedBalance();
    const chains: Array<{ chain: string; confirmed: string; pending: string }> = [];
    if (balance.breakdown) {
      for (const group of balance.breakdown) {
        if (group.breakdown) {
          for (const item of group.breakdown) {
            chains.push({
              chain: item.chain,
              confirmed: item.confirmedBalance ?? "0",
              pending: item.pendingBalance ?? "0",
            });
          }
        }
      }
    }
    return {
      token: balance.token,
      totalConfirmed: balance.totalConfirmedBalance ?? "0",
      totalPending: balance.totalPendingBalance ?? "0",
      chains,
    };
  }

  async depositUnifiedBalance(amount: string): Promise<any> {
    const adapter = await this.getAdapter();
    const { createUnifiedBalanceKitContext, deposit } = await import("@circle-fin/unified-balance-kit");
    const context = createUnifiedBalanceKitContext();

    const result = await deposit(context, {
      from: { adapter, chain: getCircleChainName(this.config) },
      amount,
      token: "USDC",
    });

    return result;
  }

  async spendUnifiedBalance(amount: string, recipient?: string, targetChain?: string): Promise<any> {
    const adapter = await this.getAdapter();
    const { createUnifiedBalanceKitContext, spend } = await import("@circle-fin/unified-balance-kit");
    const context = createUnifiedBalanceKitContext();

    const to: any = {
      adapter,
      chain: getCircleChainName(this.config),
    };
    if (recipient) to.recipientAddress = recipient;

    const params: any = {
      amount,
      token: "USDC",
      from: [{ adapter }],
      to,
    };
    if (targetChain) to.chain = targetChain;

    const result = await spend(context, params);
    return result;
  }

  async getPrices(symbols: string[]): Promise<any> {
    const ids = symbols
      .map((s) => {
        const token = this.getToken(s);
        return token?.coingeckoId;
      })
      .filter(Boolean)
      .join(",");

    if (!ids) return { error: "No valid symbols" };

    const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("ids", ids);
    url.searchParams.set("price_change_percentage", "24h,7d,30d");

    const res = await fetch(url.toString());
    const data = await res.json();

    const prices: Record<string, any> = {};
    for (const coin of data) {
      const symbol = this.tokens.find((t) => t.coingeckoId === coin.id)?.symbol || coin.symbol?.toUpperCase();
      prices[symbol] = {
        price: coin.current_price ?? 0,
        marketCap: coin.market_cap ?? 0,
        volume24h: coin.total_volume ?? 0,
        percentChange24h: coin.price_change_percentage_24h_in_currency ?? 0,
        percentChange7d: coin.price_change_percentage_7d_in_currency ?? 0,
        percentChange30d: coin.price_change_percentage_30d_in_currency ?? 0,
      };
    }

    return prices;
  }

  async listEarnVaults(symbol?: string): Promise<any> {
    const { createEarnKitContext, exploreVaults } = await import("@circle-fin/earn-kit");
    const context = createEarnKitContext();

    const result = await exploreVaults(context, {
      chain: getCircleChainName(this.config),
      sortBy: "apy",
    });

    const vaults = (result.vaults || []).map((v: any) => ({
      vaultAddress: v.vaultAddress,
      name: v.name,
      protocol: v.protocol,
      asset: v.asset,
      currentApy: v.currentApy ?? 0,
      status: v.status,
      totalDeposits: v.totalDeposits ?? "0",
      liquidity: v.liquidity ?? "0",
    }));

    if (symbol) {
      return vaults.filter((v: any) => v.asset.toLowerCase() === symbol.toLowerCase());
    }
    return vaults;
  }

  async getEarnPosition(vaultAddress: string): Promise<any> {
    const adapter = await this.getAdapter();
    const { createEarnKitContext, getPosition } = await import("@circle-fin/earn-kit");
    const context = createEarnKitContext();

    const pos = await getPosition(context, {
      from: { adapter, chain: getCircleChainName(this.config) },
      vaultAddress,
    });

    if (!pos) return null;

    return {
      vaultAddress,
      currentBalance: pos.currentBalance ?? "0",
      shares: pos.shares ?? "0",
      principalDeposited: pos.pnl?.status === "available" ? pos.pnl.principalDeposited : "0",
      totalYieldEarned: pos.pnl?.status === "available" ? pos.pnl.totalYieldEarned : "0",
    };
  }

  async swapTokens(fromSymbol: string, toSymbol: string, amount: string, slippagePercent: string = "0.5"): Promise<any> {
    const adapter = await this.getAdapter();
    const { createSwapKitContext, swap } = await import("@circle-fin/swap-kit");
    const context = createSwapKitContext();

    const result = await swap(context, {
      from: { adapter, chain: getCircleChainName(this.config) },
      fromSymbol,
      toSymbol,
      amount,
      slippagePercent,
    });

    return result;
  }

  async earnDeposit(amount: string, vaultAddress: string): Promise<any> {
    const adapter = await this.getAdapter();
    const { createEarnKitContext, deposit } = await import("@circle-fin/earn-kit");
    const context = createEarnKitContext();

    const result = await deposit(context, {
      from: { adapter, chain: getCircleChainName(this.config) },
      vaultAddress,
      amount,
    });

    return result;
  }

  async earnWithdraw(amount: string, vaultAddress: string): Promise<any> {
    const adapter = await this.getAdapter();
    const { createEarnKitContext, withdraw } = await import("@circle-fin/earn-kit");
    const context = createEarnKitContext();

    const result = await withdraw(context, {
      from: { adapter, chain: getCircleChainName(this.config), address: this.walletAddress },
      vaultAddress,
      amount,
    });
    return result;
  }
}
