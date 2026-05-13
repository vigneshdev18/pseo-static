export default function Reviews({ heading, subtitle, items }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{heading}</h2>
          {subtitle && <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items?.map((r, i) => (
            <figure key={i} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)}
                <span className="ml-2 text-sm text-slate-500">{r.rating ?? 5}</span>
              </div>
              <blockquote className="text-slate-700 leading-relaxed">"{r.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
