/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
export type DigiatProofsParam = {
  panUpload: string
  passportUpload: string
  pictureUpload: string
  aadharUpload: string
}

/**
 * @category userTypes
 * @category generated
 */
export const digiatProofsParamBeet =
  new beet.FixableBeetArgsStruct<DigiatProofsParam>(
    [
      ['panUpload', beet.utf8String],
      ['passportUpload', beet.utf8String],
      ['pictureUpload', beet.utf8String],
      ['aadharUpload', beet.utf8String],
    ],
    'DigiatProofsParam'
  )
