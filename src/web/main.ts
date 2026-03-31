import * as presalesSmartContractClient from '../generated';

type InstructionKey =
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

type FieldDef = {
  name: string;
  label: string;
  placeholder?: string;
  signed?: boolean;
  defaultValue: string;
};

type InstructionDef = {
  label: string;
  description: string;
  fields: FieldDef[];
  encode: (args: Record<string, bigint>) => ArrayLike<number>;
  decode: (data: Uint8Array) => unknown;
};

const instructionDefs: Record<InstructionKey, InstructionDef> = {
  createPresale: {
    label: 'createPresale',
    description: 'Créer une nouvelle presale avec ses paramètres principaux.',
    fields: [
      { name: 'id', label: 'ID presale', defaultValue: '1' },
      { name: 'startingUnixTimestamp', label: 'Start timestamp', defaultValue: `${Math.floor(Date.now() / 1000)}`, signed: true },
      { name: 'endUnixTimestamp', label: 'End timestamp', defaultValue: `${Math.floor(Date.now() / 1000) + 7 * 86400}`, signed: true },
      { name: 'softCapAmount', label: 'Soft cap', defaultValue: '50000' },
      { name: 'hardCapAmount', label: 'Hard cap', defaultValue: '100000' },
      { name: 'minimumTokensPerAddress', label: 'Min tokens / wallet', defaultValue: '10' },
      { name: 'maximumTokensPerAddress', label: 'Max tokens / wallet', defaultValue: '1000' },
      { name: 'pricePerToken', label: 'Prix/token (u64)', defaultValue: '2' },
    ],
    encode: (args) => presalesSmartContractClient.getCreatePresaleInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getCreatePresaleInstructionDataDecoder().decode(data),
  },
  updatePresale: {
    label: 'updatePresale',
    description: 'Mettre à jour le prix et la date de fin de la presale.',
    fields: [
      { name: 'id', label: 'ID presale', defaultValue: '1' },
      { name: 'newPricePerToken', label: 'Nouveau prix/token', defaultValue: '3' },
      { name: 'newEndUnixTimestamp', label: 'Nouveau end timestamp', signed: true, defaultValue: `${Math.floor(Date.now() / 1000) + 14 * 86400}` },
    ],
    encode: (args) => presalesSmartContractClient.getUpdatePresaleInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getUpdatePresaleInstructionDataDecoder().decode(data),
  },
  pausePresale: {
    label: 'pausePresale',
    description: 'Mettre la presale en pause.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getPausePresaleInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getPausePresaleInstructionDataDecoder().decode(data),
  },
  resumePresale: {
    label: 'resumePresale',
    description: 'Reprendre une presale en pause.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getResumePresaleInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getResumePresaleInstructionDataDecoder().decode(data),
  },
  cancelPresale: {
    label: 'cancelPresale',
    description: 'Annuler une presale.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getCancelPresaleInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getCancelPresaleInstructionDataDecoder().decode(data),
  },
  buyTokensWithSol: {
    label: 'buyTokensWithSol',
    description: 'Simuler un achat de tokens avec SOL.',
    fields: [
      { name: 'id', label: 'ID presale', defaultValue: '1' },
      { name: 'tokensAmount', label: 'Montant de tokens', defaultValue: '250' },
    ],
    encode: (args) => presalesSmartContractClient.getBuyTokensWithSolInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getBuyTokensWithSolInstructionDataDecoder().decode(data),
  },
  buyTokensWithUsdc: {
    label: 'buyTokensWithUsdc',
    description: 'Simuler un achat de tokens avec USDC.',
    fields: [
      { name: 'id', label: 'ID presale', defaultValue: '1' },
      { name: 'tokensAmount', label: 'Montant de tokens', defaultValue: '250' },
    ],
    encode: (args) => presalesSmartContractClient.getBuyTokensWithUsdcInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getBuyTokensWithUsdcInstructionDataDecoder().decode(data),
  },
  claimTokens: {
    label: 'claimTokens',
    description: 'Simuler le claim de tokens après la vente.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getClaimTokensInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getClaimTokensInstructionDataDecoder().decode(data),
  },
  refundSolToBuyer: {
    label: 'refundSolToBuyer',
    description: 'Simuler un remboursement SOL.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getRefundSolToBuyerInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getRefundSolToBuyerInstructionDataDecoder().decode(data),
  },
  refundUsdcToBuyer: {
    label: 'refundUsdcToBuyer',
    description: 'Simuler un remboursement USDC.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getRefundUsdcToBuyerInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getRefundUsdcToBuyerInstructionDataDecoder().decode(data),
  },
  withdrawSol: {
    label: 'withdrawSol',
    description: 'Simuler le retrait SOL.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getWithdrawSolInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getWithdrawSolInstructionDataDecoder().decode(data),
  },
  withdrawUsdc: {
    label: 'withdrawUsdc',
    description: 'Simuler le retrait USDC.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getWithdrawUsdcInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getWithdrawUsdcInstructionDataDecoder().decode(data),
  },
  withdrawTokens: {
    label: 'withdrawTokens',
    description: 'Simuler le retrait des tokens restants.',
    fields: [{ name: 'id', label: 'ID presale', defaultValue: '1' }],
    encode: (args) => presalesSmartContractClient.getWithdrawTokensInstructionDataEncoder().encode(args as any),
    decode: (data) => presalesSmartContractClient.getWithdrawTokensInstructionDataDecoder().decode(data),
  },
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Impossible de charger l\'application web.');

app.innerHTML = `
  <main class="container">
    <h1>Simulation complète des instructions Presale</h1>
    <p class="muted">Toutes les instructions du SDK sont simulables via encodage des données d'instruction.</p>

    <section class="card">
      <label for="instructionSelect">Instruction</label>
      <select id="instructionSelect"></select>
      <p id="instructionDescription" class="muted"></p>
      <form id="instructionForm" class="grid"></form>
      <button id="simulateBtn" type="button">Encoder / Simuler</button>
    </section>

    <section class="card" id="result"></section>
  </main>
`;

const select = document.getElementById('instructionSelect') as HTMLSelectElement;
const form = document.getElementById('instructionForm') as HTMLFormElement;
const result = document.getElementById('result') as HTMLDivElement;
const description = document.getElementById('instructionDescription') as HTMLParagraphElement;
const simulateBtn = document.getElementById('simulateBtn') as HTMLButtonElement;

Object.keys(instructionDefs).forEach((key) => {
  const opt = document.createElement('option');
  opt.value = key;
  opt.textContent = instructionDefs[key as InstructionKey].label;
  select.appendChild(opt);
});

const toHex = (bytes: ArrayLike<number>) => Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

const renderFields = (instructionKey: InstructionKey) => {
  const def = instructionDefs[instructionKey];
  description.textContent = def.description;

  form.innerHTML = '';
  def.fields.forEach((field) => {
    const wrap = document.createElement('div');
    wrap.className = 'field';

    const label = document.createElement('label');
    label.htmlFor = `arg_${field.name}`;
    label.textContent = field.label;

    const input = document.createElement('input');
    input.id = `arg_${field.name}`;
    input.name = field.name;
    input.placeholder = field.placeholder ?? 'Entier';
    input.value = field.defaultValue;

    wrap.append(label, input);
    form.appendChild(wrap);
  });
};

const parseArgs = (instructionKey: InstructionKey): Record<string, bigint> => {
  const def = instructionDefs[instructionKey];
  const args: Record<string, bigint> = {};

  for (const field of def.fields) {
    const input = form.querySelector<HTMLInputElement>(`#arg_${field.name}`);
    if (!input) throw new Error(`Champ introuvable: ${field.name}`);
    const raw = input.value.trim();

    if (!raw) throw new Error(`Le champ "${field.label}" est requis.`);
    if (!/^-?\d+$/.test(raw)) throw new Error(`Le champ "${field.label}" doit être un entier.`);

    const value = BigInt(raw);
    if (!field.signed && value < 0n) {
      throw new Error(`Le champ "${field.label}" doit être >= 0.`);
    }

    args[field.name] = value;
  }

  return args;
};

const simulate = () => {
  result.innerHTML = '';
  const instructionKey = select.value as InstructionKey;
  const def = instructionDefs[instructionKey];

  try {
    const args = parseArgs(instructionKey);
    const encoded = def.encode(args);
    const encodedBytes = Uint8Array.from(encoded);
    const decoded = def.decode(encodedBytes);

    result.innerHTML = `
      <h2>Résultat: ${def.label}</h2>
      <p class="ok">✅ Encodage réussi.</p>
      <p><strong>Args:</strong><br /><code>${JSON.stringify(args, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</code></p>
      <p><strong>Payload hex:</strong><br /><code class="hex">${toHex(encodedBytes)}</code></p>
      <p><strong>Décodage de vérification:</strong><br /><code>${JSON.stringify(decoded, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</code></p>
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    result.innerHTML = `
      <h2>Résultat: ${def.label}</h2>
      <p class="error">❌ Erreur de simulation.</p>
      <p><strong>Détail:</strong> ${message}</p>
      <p class="muted">Vérifiez vos valeurs numériques (entiers uniquement, pas de champ vide).</p>
    `;
  }
};

select.addEventListener('change', () => {
  renderFields(select.value as InstructionKey);
  result.innerHTML = '';
});
simulateBtn.addEventListener('click', simulate);

select.value = 'createPresale';
renderFields('createPresale');
simulate();
