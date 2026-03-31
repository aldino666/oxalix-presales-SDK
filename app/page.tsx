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

export default function HomePage() {
  const [instruction, setInstruction] = useState<InstructionKey>('createPresale');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const base = instructionDefs.createPresale.fields;
    return Object.fromEntries(base.map((f) => [f.name, f.defaultValue]));
  });
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const current = useMemo(() => instructionDefs[instruction], [instruction]);

  const onInstructionChange = (next: InstructionKey) => {
    setInstruction(next);
    setResult('');
    setError('');
    const fields = instructionDefs[next].fields;
    setValues(Object.fromEntries(fields.map((f) => [f.name, f.defaultValue])));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      const args = parseArgs(values, current.fields);
      const payload = current.encode(args);
      const decoded = current.decode(payload);
      const rendered = [
        `Instruction: ${current.label}`,
        '',
        'Args:',
        stringifyBigInts(args),
        '',
        'Payload HEX:',
        toHex(payload),
        '',
        'Decoded:',
        stringifyBigInts(decoded),
      ].join('\n');

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
          Interface Next.js pour simuler toutes les instructions générées par Castway,
          avec validation des champs et vérification encode/decode.
        </p>
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
