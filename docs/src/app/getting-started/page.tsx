export default function GettingStarted() {
  return (
    <div className="space-y-10 text-white">
      <h1 className="text-4xl font-bold">Getting Started</h1>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <pre className="bg-oxalix-card border border-oxalix-border p-4 rounded text-oxalix-light"><code>npm install @oxalix/js-client @solana/kit</code></pre>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Initialization</h2>
        <pre className="bg-oxalix-card border border-oxalix-border p-4 rounded text-gray-400"><code>{`const rpc = createSolanaRpc('...');\nconst program = presalesSmartContractProgram()(rpc);`}</code></pre>
      </section>
    </div>
  );
}
