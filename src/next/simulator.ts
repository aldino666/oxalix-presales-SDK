import * as client from '../generated';

export type InstructionKey =
  | 'createPresale'
  | 'updatePresale'
  | 'pausePresale'
  | 'resumePresale'
  | 'cancelPresale'
  | 'buyTokensWithSol'
  | 'buyTokensWithUsdc'
  | 'claimTokens'
  | 'refundSolToBuyer'
  | 'refundUsdcToBuyer'
  | 'withdrawSol'
  | 'withdrawUsdc'
  | 'withdrawTokens';

export type FieldDef = {
  name: string;
  label: string;
  signed?: boolean;
  defaultValue: string;
};

export type InstructionDef = {
  label: string;
  description: string;
  fields: FieldDef[];
  encode: (args: Record<string, bigint>) => Uint8Array;
  decode: (data: Uint8Array) => unknown;
};

const now = Math.floor(Date.now() / 1000);

const toBytes = (input: ArrayLike<number>) => Uint8Array.from(input);

export const instructionDefs: Record<InstructionKey, InstructionDef> = {
  createPresale: {
    label: 'Create Presale',
    description: 'Créer une nouvelle presale avec dates et caps.',
    fields: [
      { name: 'id', label: 'ID Presale', defaultValue: '1' },
      { name: 'startingUnixTimestamp', label: 'Début (unix)', signed: true, defaultValue: String(now) },
      { name: 'endUnixTimestamp', label: 'Fin (unix)', signed: true, defaultValue: String(now + 7 * 86400) },
      { name: 'softCapAmount', label: 'Soft cap', defaultValue: '50000' },
      { name: 'hardCapAmount', label: 'Hard cap', defaultValue: '100000' },
      { name: 'minimumTokensPerAddress', label: 'Min / wallet', defaultValue: '10' },
      { name: 'maximumTokensPerAddress', label: 'Max / wallet', defaultValue: '1000' },
      { name: 'pricePerToken', label: 'Prix / token', defaultValue: '2' },
    ],
    encode: (args) => toBytes(client.getCreatePresaleInstructionDataEncoder().encode(args as any)),
    decode: (data) => client.getCreatePresaleInstructionDataDecoder().decode(data),
  },
  updatePresale: {
    label: 'Update Presale',
    description: 'Mettre à jour prix et date de fin.',
    fields: [
      { name: 'id', label: 'ID Presale', defaultValue: '1' },
      { name: 'newPricePerToken', label: 'Nouveau prix', defaultValue: '3' },
      { name: 'newEndUnixTimestamp', label: 'Nouvelle fin (unix)', signed: true, defaultValue: String(now + 14 * 86400) },
    ],
    encode: (args) => toBytes(client.getUpdatePresaleInstructionDataEncoder().encode(args as any)),
    decode: (data) => client.getUpdatePresaleInstructionDataDecoder().decode(data),
  },
  pausePresale: { label: 'Pause Presale', description: 'Mettre la presale en pause.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getPausePresaleInstructionDataEncoder().encode(args as any)), decode: (data) => client.getPausePresaleInstructionDataDecoder().decode(data) },
  resumePresale: { label: 'Resume Presale', description: 'Reprendre la presale.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getResumePresaleInstructionDataEncoder().encode(args as any)), decode: (data) => client.getResumePresaleInstructionDataDecoder().decode(data) },
  cancelPresale: { label: 'Cancel Presale', description: 'Annuler la presale.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getCancelPresaleInstructionDataEncoder().encode(args as any)), decode: (data) => client.getCancelPresaleInstructionDataDecoder().decode(data) },
  buyTokensWithSol: { label: 'Buy Tokens With SOL', description: 'Achat de tokens avec SOL.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }, { name: 'tokensAmount', label: 'Tokens', defaultValue: '250' }], encode: (args) => toBytes(client.getBuyTokensWithSolInstructionDataEncoder().encode(args as any)), decode: (data) => client.getBuyTokensWithSolInstructionDataDecoder().decode(data) },
  buyTokensWithUsdc: { label: 'Buy Tokens With USDC', description: 'Achat de tokens avec USDC.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }, { name: 'tokensAmount', label: 'Tokens', defaultValue: '250' }], encode: (args) => toBytes(client.getBuyTokensWithUsdcInstructionDataEncoder().encode(args as any)), decode: (data) => client.getBuyTokensWithUsdcInstructionDataDecoder().decode(data) },
  claimTokens: { label: 'Claim Tokens', description: 'Claim des tokens.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getClaimTokensInstructionDataEncoder().encode(args as any)), decode: (data) => client.getClaimTokensInstructionDataDecoder().decode(data) },
  refundSolToBuyer: { label: 'Refund SOL To Buyer', description: 'Remboursement SOL.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getRefundSolToBuyerInstructionDataEncoder().encode(args as any)), decode: (data) => client.getRefundSolToBuyerInstructionDataDecoder().decode(data) },
  refundUsdcToBuyer: { label: 'Refund USDC To Buyer', description: 'Remboursement USDC.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getRefundUsdcToBuyerInstructionDataEncoder().encode(args as any)), decode: (data) => client.getRefundUsdcToBuyerInstructionDataDecoder().decode(data) },
  withdrawSol: { label: 'Withdraw SOL', description: 'Retrait des SOL levés.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getWithdrawSolInstructionDataEncoder().encode(args as any)), decode: (data) => client.getWithdrawSolInstructionDataDecoder().decode(data) },
  withdrawUsdc: { label: 'Withdraw USDC', description: 'Retrait des USDC levés.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getWithdrawUsdcInstructionDataEncoder().encode(args as any)), decode: (data) => client.getWithdrawUsdcInstructionDataDecoder().decode(data) },
  withdrawTokens: { label: 'Withdraw Tokens', description: 'Retrait des tokens restants.', fields: [{ name: 'id', label: 'ID Presale', defaultValue: '1' }], encode: (args) => toBytes(client.getWithdrawTokensInstructionDataEncoder().encode(args as any)), decode: (data) => client.getWithdrawTokensInstructionDataDecoder().decode(data) },
};

export const instructionKeys = Object.keys(instructionDefs) as InstructionKey[];

export const toHex = (bytes: Uint8Array) => Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

export const parseArgs = (values: Record<string, string>, fields: FieldDef[]) => {
  const args: Record<string, bigint> = {};
  for (const field of fields) {
    const raw = (values[field.name] ?? '').trim();
    if (!raw) throw new Error(`Le champ "${field.label}" est requis.`);
    if (!/^-?\d+$/.test(raw)) throw new Error(`Le champ "${field.label}" doit être un entier.`);
    const value = BigInt(raw);
    if (!field.signed && value < 0n) throw new Error(`Le champ "${field.label}" doit être >= 0.`);
    args[field.name] = value;
  }
  return args;
};

export const stringifyBigInts = (v: unknown) => JSON.stringify(v, (_, x) => (typeof x === 'bigint' ? x.toString() : x), 2);
