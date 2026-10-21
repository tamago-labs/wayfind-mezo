import { JsonRpcProvider, Wallet, Contract } from "ethers";
import type { ChainData } from "./chain-data";

const ERC20_TRANSFER_ABI = ["function transfer(address to, uint256 amount) returns (bool)"];

export async function sendEvmToken(
  privateKey: string,
  rpcUrl: string,
  chainData: ChainData,
  token: string,
  amount: string,
  recipient: string
) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const isNative = token.toUpperCase() === chainData.nativeCurrency.symbol.toUpperCase();

  if (isNative) {
    const tx = await wallet.sendTransaction({
      to: recipient,
      value: BigInt(amount),
    });
    const receipt = await tx.wait();
    return {
      signature: receipt?.hash,
      chain: chainData.chain,
      token,
      amount,
      recipient,
    };
  }

  const tokenInfo = chainData.tokens.find((t) => t.symbol.toUpperCase() === token.toUpperCase());
  const tokenAddress = tokenInfo?.address || token;
  const contract = new Contract(tokenAddress, ERC20_TRANSFER_ABI, wallet);
  const tx = await contract.transfer(recipient, BigInt(amount));
  const receipt = await tx.wait();

  return {
    signature: receipt?.hash,
    chain: chainData.chain,
    token,
    amount,
    recipient,
  };
}
