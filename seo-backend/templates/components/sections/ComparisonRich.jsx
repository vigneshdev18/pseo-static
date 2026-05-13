export default function ComparisonRich({ heading, competitors }) {
  const features = [
    'Verified contact data',
    'Real-time email validation',
    'AI buyer intent signals',
    'CRM integrations',
    'Free zone / regional coverage',
    'GDPR + local compliance',
    'Price per contact',
    'API access',
  ];
  return (
    <section className="px-6 lg:px-24 py-20 bg-slate-50">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-12">{heading}</h2>
        <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="p-4 text-sm font-semibold">Feature</th>
                <th className="p-4 text-sm font-semibold">Zintlr</th>
                {competitors?.map((c, i) => <th key={i} className="p-4 text-sm font-semibold">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="p-4 text-sm text-slate-700 font-medium">{f}</td>
                  <td className="p-4 text-sm text-emerald-600 font-semibold">✓ Yes</td>
                  {competitors?.map((_, j) => (
                    <td key={j} className="p-4 text-sm text-slate-500">{i < 2 ? 'Limited' : i < 4 ? 'Partial' : '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
