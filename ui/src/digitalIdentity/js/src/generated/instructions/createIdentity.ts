/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  DigitalIdentityParam,
  digitalIdentityParamBeet,
} from '../types/DigitalIdentityParam'

/**
 * @category Instructions
 * @category CreateIdentity
 * @category generated
 */
export type CreateIdentityInstructionArgs = {
  createIdentityParams: DigitalIdentityParam
}
/**
 * @category Instructions
 * @category CreateIdentity
 * @category generated
 */
export const createIdentityStruct = new beet.FixableBeetArgsStruct<
  CreateIdentityInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['createIdentityParams', digitalIdentityParamBeet],
  ],
  'CreateIdentityInstructionArgs'
)
/**
 * Accounts required by the _createIdentity_ instruction
 *
 * @property [_writable_] digIdentityAcc
 * @property [_writable_, **signer**] authority
 * @category Instructions
 * @category CreateIdentity
 * @category generated
 */
export type CreateIdentityInstructionAccounts = {
  digIdentityAcc: web3.PublicKey
  authority: web3.PublicKey
  systemProgram?: web3.PublicKey
}

export const createIdentityInstructionDiscriminator = [
  12, 253, 209, 41, 176, 51, 195, 179,
]

/**
 * Creates a _CreateIdentity_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateIdentity
 * @category generated
 */
export function createCreateIdentityInstruction(
  accounts: CreateIdentityInstructionAccounts,
  args: CreateIdentityInstructionArgs,
  programId = new web3.PublicKey('4M2YyMwXqtZYGzaMd7U8gciyQT5B4BN1wMXpA2nQDb6o')
) {
  const [data] = createIdentityStruct.serialize({
    instructionDiscriminator: createIdentityInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.digIdentityAcc,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}