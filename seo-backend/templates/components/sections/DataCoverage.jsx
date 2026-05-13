export default function DataCoverage({ stats }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats?.map((s, i) => (
          <div key={i} className="rounded border border-slate-200 p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600">{s.value}</div>
            <div className="mt-2 text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
