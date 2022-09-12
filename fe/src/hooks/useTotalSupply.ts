import { ethers, BigNumber, Contract } from 'ethers';
import { useCall } from '@usedapp/core';

/**
 * Returns a balance of a given token for a given address.
 * @param poolAddress address of a pool token contract.
 * @param abi abi of pool token contract.
 * @public
 * @returns a balance which is `BigNumber`, or `undefined` if address or token is `Falsy` or not connected.
 */

export function useTotalSupply(
  poolAddress: string,
  abi: ethers.utils.Interface
): BigNumber | undefined {
  const queryParams = poolAddress && {
    contract: new Contract(poolAddress, abi),
    method: 'totalSupply',
    args: [],
  };
  const { value, error } = useCall(queryParams) ?? {};
  if (error) {
    console.log(error.message);
  }
  return value?.[0];
}
