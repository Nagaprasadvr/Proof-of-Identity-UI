/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * Arguments used to create {@link DigitalIdentity}
 * @category Accounts
 * @category generated
 */
export type DigitalIdentityArgs = {
  name: string
  authority: web3.PublicKey
  contactNumber: string
  dob: string
  residenceAddress: string
  panNumber: string
  aadharNumber: string
  passportId: string
  passportAttached: boolean
  aadharAttached: boolean
  panAttached: boolean
  picAttached: boolean
}

export const digitalIdentityDiscriminator = [
  186, 112, 9, 139, 29, 139, 170, 255,
]
/**
 * Holds the data for the {@link DigitalIdentity} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class DigitalIdentity implements DigitalIdentityArgs {
  private constructor(
    readonly name: string,
    readonly authority: web3.PublicKey,
    readonly contactNumber: string,
    readonly dob: string,
    readonly residenceAddress: string,
    readonly panNumber: string,
    readonly aadharNumber: string,
    readonly passportId: string,
    readonly passportAttached: boolean,
    readonly aadharAttached: boolean,
    readonly panAttached: boolean,
    readonly picAttached: boolean
  ) {}

  /**
   * Creates a {@link DigitalIdentity} instance from the provided args.
   */
  static fromArgs(args: DigitalIdentityArgs) {
    return new DigitalIdentity(
      args.name,
      args.authority,
      args.contactNumber,
      args.dob,
      args.residenceAddress,
      args.panNumber,
      args.aadharNumber,
      args.passportId,
      args.passportAttached,
      args.aadharAttached,
      args.panAttached,
      args.picAttached
    )
  }

  /**
   * Deserializes the {@link DigitalIdentity} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [DigitalIdentity, number] {
    return DigitalIdentity.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link DigitalIdentity} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<DigitalIdentity> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find DigitalIdentity account at ${address}`)
    }
    return DigitalIdentity.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      '4M2YyMwXqtZYGzaMd7U8gciyQT5B4BN1wMXpA2nQDb6o'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, digitalIdentityBeet)
  }

  /**
   * Deserializes the {@link DigitalIdentity} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [DigitalIdentity, number] {
    return digitalIdentityBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link DigitalIdentity} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return digitalIdentityBeet.serialize({
      accountDiscriminator: digitalIdentityDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link DigitalIdentity} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: DigitalIdentityArgs) {
    const instance = DigitalIdentity.fromArgs(args)
    return digitalIdentityBeet.toFixedFromValue({
      accountDiscriminator: digitalIdentityDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link DigitalIdentity} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: DigitalIdentityArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      DigitalIdentity.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link DigitalIdentity} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      name: this.name,
      authority: this.authority.toBase58(),
      contactNumber: this.contactNumber,
      dob: this.dob,
      residenceAddress: this.residenceAddress,
      panNumber: this.panNumber,
      aadharNumber: this.aadharNumber,
      passportId: this.passportId,
      passportAttached: this.passportAttached,
      aadharAttached: this.aadharAttached,
      panAttached: this.panAttached,
      picAttached: this.picAttached,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const digitalIdentityBeet = new beet.FixableBeetStruct<
  DigitalIdentity,
  DigitalIdentityArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['name', beet.utf8String],
    ['authority', beetSolana.publicKey],
    ['contactNumber', beet.utf8String],
    ['dob', beet.utf8String],
    ['residenceAddress', beet.utf8String],
    ['panNumber', beet.utf8String],
    ['aadharNumber', beet.utf8String],
    ['passportId', beet.utf8String],
    ['passportAttached', beet.bool],
    ['aadharAttached', beet.bool],
    ['panAttached', beet.bool],
    ['picAttached', beet.bool],
  ],
  DigitalIdentity.fromArgs,
  'DigitalIdentity'
)