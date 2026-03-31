'use client';

import { FormEvent, useMemo, useState } from 'react';
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
};

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export default function HomePage() {
  const [instruction, setInstruction] = useState<InstructionKey>('createPresale');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const base = instructionDefs.createPresale.fields;
    return Object.fromEntries(base.map((f) => [f.name, f.defaultValue]));
  });
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletError, setWalletError] = useState<string>('');
  const [signatureHex, setSignatureHex] = useState<string>('');
  const [lastPayloadHex, setLastPayloadHex] = useState<string>('');

  const current = useMemo(() => instructionDefs[instruction], [instruction]);

  const onInstructionChange = (next: InstructionKey) => {
    setInstruction(next);
    setResult('');
    setError('');
    setSignatureHex('');
    setLastPayloadHex('');
    const fields = instructionDefs[next].fields;
    setValues(Object.fromEntries(fields.map((f) => [f.name, f.defaultValue])));
  };

  const connectWallet = async () => {
    setWalletError('');
    try {
      if (!window.solana?.isPhantom) {
        throw new Error('Wallet Phantom non détecté. Installez Phantom ou ouvrez cette page dans un navigateur avec wallet injecté.');
      }
      const res = await window.solana.connect();
      setWalletAddress(res.publicKey.toString());
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : 'Impossible de connecter le wallet.');
    }
  };

  const disconnectWallet = async () => {
    setWalletError('');
    try {
      await window.solana?.disconnect();
      setWalletAddress('');
      setSignatureHex('');
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : 'Erreur lors de la déconnexion wallet.');
    }
  };

  const signSimulation = async () => {
    setWalletError('');
    setSignatureHex('');

    try {
      if (!walletAddress) throw new Error('Connectez votre wallet avant de signer.');
      if (!lastPayloadHex) throw new Error('Simulez une instruction avant de signer.');
      if (!window.solana?.signMessage) {
        throw new Error('Votre wallet ne supporte pas signMessage.');
      }

      const msg = new TextEncoder().encode(
        `Presale simulation\nInstruction: ${current.label}\nPayloadHex: ${lastPayloadHex}`,
      );

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
      const rendered = [
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
      ].join('\n');

      setLastPayloadHex(payloadHex);
      setResult(rendered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  return (
    <main className="page">
      <section className="panel header">
        <h1>Presale SDK Simulator</h1>
        <p>
          Interface Next.js pour simuler les instructions, connecter un wallet et signer
          la simulation. Pour exécuter on-chain toutes les instructions, il faut ensuite
          mapper tous les comptes requis (PDA/ATA/admin/owner/buyer) et construire les transactions.
        </p>
      </section>

      <section className="panel walletPanel">
        <div>
          <h2>Wallet</h2>
          <p className="hint">Connexion Phantom + signature de la simulation en cours.</p>
          <p>
            <strong>Adresse:</strong> {walletAddress || 'Non connecté'}
          </p>
        </div>
        <div className="walletActions">
          <button type="button" onClick={connectWallet}>Connecter Wallet</button>
          <button type="button" onClick={disconnectWallet} className="secondary">Déconnecter</button>
          <button type="button" onClick={signSimulation} className="secondary">Signer la simulation</button>
        </div>
        {walletError ? <p className="error"><strong>Wallet:</strong> {walletError}</p> : null}
        {signatureHex ? (
          <pre>
{`Signature (hex):\n${signatureHex}`}
          </pre>
        ) : null}
      </section>

      <section className="panel">
        <label htmlFor="instruction">Instruction</label>
        <select
          id="instruction"
          value={instruction}
          onChange={(e) => onInstructionChange(e.target.value as InstructionKey)}
        >
          {instructionKeys.map((key) => (
            <option key={key} value={key}>
              {instructionDefs[key].label}
            </option>
          ))}
        </select>
        <p className="hint">{current.description}</p>

        <form onSubmit={onSubmit} className="grid">
          {current.fields.map((field) => (
            <div key={field.name} className="field">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
              />
            </div>
          ))}
          <button type="submit">Simuler</button>
        </form>
      </section>

      <section className="panel">
        {error ? (
          <div className="error">
            <strong>Erreur:</strong> {error}
          </div>
        ) : (
          <pre>{result || 'Lancez une simulation pour afficher le résultat.'}</pre>
        )}
      </section>
    </main>
  );
}
