/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category VerifyIdentity
 * @category generated
 */
export const verifyIdentityStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'VerifyIdentityInstructionArgs'
)
/**
 * Accounts required by the _verifyIdentity_ instruction
 *
 * @property [] digIdentityAcc
 * @property [] authority
 * @category Instructions
 * @category VerifyIdentity
 * @category generated
 */
export type VerifyIdentityInstructionAccounts = {
  digIdentityAcc: web3.PublicKey
  authority: web3.PublicKey
}

export const verifyIdentityInstructionDiscriminator = [
  177, 162, 9, 111, 44, 84, 80, 21,
]

/**
 * Creates a _VerifyIdentity_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category VerifyIdentity
 * @category generated
 */
export function createVerifyIdentityInstruction(
  accounts: VerifyIdentityInstructionAccounts,
  programId = new web3.PublicKey('72K1fxmt2ZGRqT68uhwQBQU2Syjj9JzgWAfzpsxNUL1w')
) {
  const [data] = verifyIdentityStruct.serialize({
    instructionDiscriminator: verifyIdentityInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.digIdentityAcc,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
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
