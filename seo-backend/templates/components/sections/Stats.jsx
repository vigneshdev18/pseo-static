export default function Stats({ heading, description, stats }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-slate-50">
      <div className="mx-auto max-w-6xl">
        {heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{heading}</h2>
            {description && <p className="mt-4 text-slate-600 text-lg max-w-3xl mx-auto">{description}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{s.value}</div>
              <div className="mt-3 text-sm text-slate-600 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
