import { ethers, BigNumber, Contract } from 'ethers';
import { useCall } from '@usedapp/core';

/**
 * Returns a balance of a given token for a given address.
 * @param tokenAddress address of a token contract.
 * @param abi abi of token contract.
 * @param amountIn amount of token contract want to swap.
 * @public
 * @returns a balance which is `BigNumber`, or `undefined` if address or token is `Falsy` or not connected.
 */

export function useSwapAmountOut(
  poolAddress: string,
  abi: ethers.utils.Interface,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: BigNumber | undefined
): BigNumber | undefined {
  const queryParams = poolAddress &&
    tokenInAddress &&
    tokenOutAddress &&
    amountIn && {
      contract: new Contract(poolAddress, abi),
      method: 'viewAmountOut',
      args: [tokenInAddress, tokenOutAddress, amountIn],
    };
  const { value, error } = useCall(queryParams) ?? {};
  if (error) {
    console.log(error.message);
  }
  return value?.[0];
}
