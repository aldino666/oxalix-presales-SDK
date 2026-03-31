'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { PRESALES_SMART_CONTRACT_PROGRAM_ADDRESS } from '../src/generated/programs';
import {
  instructionDefs,
  instructionKeys,
  parseArgs,
  stringifyBigInts,
  toHex,
  type InstructionKey,
} from '../src/next/simulator';

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: { toString: () => string };
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signMessage?: (message: Uint8Array, display?: 'utf8' | 'hex') => Promise<{ signature: Uint8Array }>;
  signAndSendTransaction?: (tx: Transaction) => Promise<{ signature: string }>;
};

type AccountField = {
  name: string;
  isSigner: boolean;
  isWritable: boolean;
  optional?: boolean;
  defaultValue?: string;
};

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

const SYS_PROGRAM = '11111111111111111111111111111111';
const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const ATA_PROGRAM = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
const CLOCK_SYSVAR = 'SysvarC1ock11111111111111111111111111111111';

const instructionAccounts: Record<InstructionKey, AccountField[]> = {
  createPresale: [
    { name: 'mint', isSigner: false, isWritable: true },
    { name: 'usdcMint', isSigner: false, isWritable: false },
    { name: 'admin', isSigner: false, isWritable: true },
    { name: 'owner', isSigner: true, isWritable: true },
    { name: 'presaleIndex', isSigner: false, isWritable: true },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleAta', isSigner: false, isWritable: true },
    { name: 'presaleVault', isSigner: false, isWritable: true },
    { name: 'presaleUsdcVaultAta', isSigner: false, isWritable: true },
    { name: 'ownerAta', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'splTokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'associatedTokenProgram', isSigner: false, isWritable: false, defaultValue: ATA_PROGRAM },
  ],
  updatePresale: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'owner', isSigner: true, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
  ],
  pausePresale: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'admin', isSigner: true, isWritable: false },
    { name: 'presaleIndex', isSigner: false, isWritable: true },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
  ],
  resumePresale: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'admin', isSigner: true, isWritable: false },
    { name: 'presaleIndex', isSigner: false, isWritable: true },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
  ],
  cancelPresale: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'owner', isSigner: true, isWritable: false },
    { name: 'presaleIndex', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleAta', isSigner: false, isWritable: true },
    { name: 'ownerAta', isSigner: false, isWritable: true },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
  ],
  buyTokensWithSol: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleVault', isSigner: false, isWritable: true },
    { name: 'buyerDetails', isSigner: false, isWritable: true },
    { name: 'buyer', isSigner: true, isWritable: true },
    { name: 'solUsdPriceUpdate', isSigner: false, isWritable: false },
    { name: 'clock', isSigner: false, isWritable: false, defaultValue: CLOCK_SYSVAR },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
  ],
  buyTokensWithUsdc: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'buyer', isSigner: true, isWritable: true },
    { name: 'usdcMint', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleVault', isSigner: false, isWritable: true },
    { name: 'presaleUsdcVaultAta', isSigner: false, isWritable: true },
    { name: 'buyerDetails', isSigner: false, isWritable: true },
    { name: 'buyerUsdcAta', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'splTokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'associatedTokenProgram', isSigner: false, isWritable: false, defaultValue: ATA_PROGRAM },
  ],
  claimTokens: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'buyer', isSigner: true, isWritable: true },
    { name: 'presaleIndex', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleAta', isSigner: false, isWritable: true },
    { name: 'buyerAta', isSigner: false, isWritable: true },
    { name: 'buyerDetails', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'associatedTokenProgram', isSigner: false, isWritable: false, defaultValue: ATA_PROGRAM },
  ],
  refundSolToBuyer: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'buyer', isSigner: true, isWritable: true },
    { name: 'presaleIndex', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleVault', isSigner: false, isWritable: true },
    { name: 'buyerDetails', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
  ],
  refundUsdcToBuyer: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'buyer', isSigner: true, isWritable: true },
    { name: 'usdcMint', isSigner: false, isWritable: false },
    { name: 'presaleIndex', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleVault', isSigner: false, isWritable: true },
    { name: 'presaleUsdcVaultAta', isSigner: false, isWritable: true },
    { name: 'buyerDetails', isSigner: false, isWritable: true },
    { name: 'buyerUsdcAta', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'splTokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'associatedTokenProgram', isSigner: false, isWritable: false, defaultValue: ATA_PROGRAM },
  ],
  withdrawSol: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'owner', isSigner: true, isWritable: false },
    { name: 'admin', isSigner: false, isWritable: false },
    { name: 'presaleIndex', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleVault', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
  ],
  withdrawUsdc: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'owner', isSigner: true, isWritable: false },
    { name: 'admin', isSigner: false, isWritable: false },
    { name: 'usdcMint', isSigner: false, isWritable: false },
    { name: 'presaleIndex', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleVault', isSigner: false, isWritable: true },
    { name: 'presaleUsdcVaultAta', isSigner: false, isWritable: true },
    { name: 'ownerUsdcAta', isSigner: false, isWritable: true },
    { name: 'adminUsdcAta', isSigner: false, isWritable: true },
    { name: 'systemProgram', isSigner: false, isWritable: false, defaultValue: SYS_PROGRAM },
    { name: 'splTokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
    { name: 'associatedTokenProgram', isSigner: false, isWritable: false, defaultValue: ATA_PROGRAM },
  ],
  withdrawTokens: [
    { name: 'mint', isSigner: false, isWritable: false },
    { name: 'owner', isSigner: true, isWritable: false },
    { name: 'presaleIndex', isSigner: false, isWritable: false },
    { name: 'presaleDetails', isSigner: false, isWritable: true },
    { name: 'presaleAta', isSigner: false, isWritable: true },
    { name: 'ownerAta', isSigner: false, isWritable: true },
    { name: 'tokenProgram', isSigner: false, isWritable: false, defaultValue: TOKEN_PROGRAM },
  ],
};

export default function HomePage() {
  const [instruction, setInstruction] = useState<InstructionKey>('createPresale');
  const [rpcEndpoint, setRpcEndpoint] = useState<string>('https://api.devnet.solana.com');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const base = instructionDefs.createPresale.fields;
    return Object.fromEntries(base.map((f) => [f.name, f.defaultValue]));
  });
  const [accounts, setAccounts] = useState<Record<string, string>>(() => {
    const base = instructionAccounts.createPresale;
    return Object.fromEntries(base.map((f) => [f.name, f.defaultValue ?? '']));
  });
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletError, setWalletError] = useState<string>('');
  const [signatureHex, setSignatureHex] = useState<string>('');
  const [lastPayloadHex, setLastPayloadHex] = useState<string>('');
  const [txSignature, setTxSignature] = useState<string>('');

  const current = useMemo(() => instructionDefs[instruction], [instruction]);
  const currentAccounts = useMemo(() => instructionAccounts[instruction], [instruction]);

  const onInstructionChange = (next: InstructionKey) => {
    setInstruction(next);
    setResult('');
    setError('');
    setSignatureHex('');
    setLastPayloadHex('');
    setTxSignature('');
    const fields = instructionDefs[next].fields;
    const accountFields = instructionAccounts[next];
    setValues(Object.fromEntries(fields.map((f) => [f.name, f.defaultValue])));
    setAccounts(Object.fromEntries(accountFields.map((f) => [f.name, f.defaultValue ?? ''])));
  };

  const connectWallet = async () => {
    setWalletError('');
    try {
      if (!window.solana?.isPhantom) throw new Error('Wallet Phantom non détecté.');
      const res = await window.solana.connect();
      setWalletAddress(res.publicKey.toString());
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : 'Impossible de connecter le wallet.');
    }
  };

  const signSimulation = async () => {
    setWalletError('');
    setSignatureHex('');
    try {
      if (!walletAddress) throw new Error('Connectez votre wallet avant de signer.');
      if (!lastPayloadHex) throw new Error('Simulez une instruction avant de signer.');
      if (!window.solana?.signMessage) throw new Error('Votre wallet ne supporte pas signMessage.');
      const msg = new TextEncoder().encode(`Presale simulation\nInstruction: ${current.label}\nPayloadHex: ${lastPayloadHex}`);
      const signed = await window.solana.signMessage(msg, 'utf8');
      setSignatureHex(toHex(signed.signature));
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : 'Erreur de signature.');
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      const args = parseArgs(values, current.fields);
      const payload = current.encode(args);
      const payloadHex = toHex(payload);
      const decoded = current.decode(payload);
      setLastPayloadHex(payloadHex);
      setResult([
        `Instruction: ${current.label}`,
        '',
        'Args:',
        stringifyBigInts(args),
        '',
        'Payload HEX:',
        payloadHex,
        '',
        'Decoded:',
        stringifyBigInts(decoded),
      ].join('\n'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  const executeOnChain = async () => {
    setWalletError('');
    setTxSignature('');
    try {
      if (!walletAddress) throw new Error('Connectez votre wallet pour exécuter on-chain.');
      if (!window.solana?.signAndSendTransaction) throw new Error('Votre wallet ne supporte pas signAndSendTransaction.');

      const args = parseArgs(values, current.fields);
      const data = current.encode(args);

      const keys = currentAccounts.map((a) => {
        const value = accounts[a.name]?.trim();
        if (!value) throw new Error(`Compte requis manquant: ${a.name}`);
        return {
          pubkey: new PublicKey(value),
          isSigner: a.isSigner,
          isWritable: a.isWritable,
        };
      });

      const ix = new TransactionInstruction({
        programId: new PublicKey(PRESALES_SMART_CONTRACT_PROGRAM_ADDRESS),
        keys,
        data,
      });

      const connection = new Connection(rpcEndpoint, 'confirmed');
      const { blockhash } = await connection.getLatestBlockhash('confirmed');

      const tx = new Transaction({ feePayer: new PublicKey(walletAddress), recentBlockhash: blockhash }).add(ix);
      const sent = await window.solana.signAndSendTransaction(tx);
      setTxSignature(sent.signature);
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : 'Erreur exécution on-chain.');
    }
  };

  return (
    <main className="page">
      <section className="panel header">
        <h1>Presale SDK Simulator + Exécution on-chain</h1>
        <p>
          Mode complet: simulation encode/decode + connexion wallet + signature + envoi transaction.
          Renseignez les comptes de l'instruction choisie (admin/owner/buyer/PDA/ATA) puis cliquez
          “Exécuter on-chain”.
        </p>
      </section>

      <section className="panel walletPanel">
        <h2>Wallet & Réseau</h2>
        <label htmlFor="rpc">RPC Endpoint</label>
        <input id="rpc" value={rpcEndpoint} onChange={(e) => setRpcEndpoint(e.target.value)} />
        <p><strong>Wallet:</strong> {walletAddress || 'Non connecté'}</p>
        <div className="walletActions">
          <button type="button" onClick={connectWallet}>Connecter Wallet</button>
          <button type="button" className="secondary" onClick={signSimulation}>Signer la simulation</button>
          <button type="button" className="secondary" onClick={executeOnChain}>Exécuter on-chain</button>
        </div>
        {walletError ? <p className="error"><strong>Wallet:</strong> {walletError}</p> : null}
        {signatureHex ? <pre>{`Signature (hex):\n${signatureHex}`}</pre> : null}
        {txSignature ? <pre>{`Tx Signature:\n${txSignature}`}</pre> : null}
      </section>

      <section className="panel">
        <label htmlFor="instruction">Instruction</label>
        <select id="instruction" value={instruction} onChange={(e) => onInstructionChange(e.target.value as InstructionKey)}>
          {instructionKeys.map((key) => <option key={key} value={key}>{instructionDefs[key].label}</option>)}
        </select>
        <p className="hint">{current.description}</p>

        <form onSubmit={onSubmit} className="grid">
          {current.fields.map((field) => (
            <div key={field.name} className="field">
              <label htmlFor={field.name}>{field.label}</label>
              <input id={field.name} value={values[field.name] ?? ''} onChange={(e) => setValues((p) => ({ ...p, [field.name]: e.target.value }))} />
            </div>
          ))}
          <button type="submit">Simuler</button>
        </form>
      </section>

      <section className="panel">
        <h2>Comptes pour transaction on-chain</h2>
        <p className="hint">Tous ces comptes sont exigés pour l'instruction sélectionnée.</p>
        <div className="grid">
          {currentAccounts.map((a) => (
            <div key={a.name} className="field">
              <label htmlFor={`acc_${a.name}`}>
                {a.name} {a.isSigner ? '(signer)' : ''} {a.isWritable ? '(writable)' : ''}
              </label>
              <input
                id={`acc_${a.name}`}
                value={accounts[a.name] ?? ''}
                onChange={(e) => setAccounts((p) => ({ ...p, [a.name]: e.target.value }))}
                placeholder="Base58 address"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        {error ? <div className="error"><strong>Erreur:</strong> {error}</div> : <pre>{result || 'Lancez une simulation pour afficher le résultat.'}</pre>}
      </section>
    </main>
  );
}
