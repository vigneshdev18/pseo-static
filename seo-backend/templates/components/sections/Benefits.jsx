export default function Benefits({ heading, subtitle, items }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{heading}</h2>
          {subtitle && <p className="mt-4 text-slate-600 text-lg max-w-3xl mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items?.map((b, i) => (
            <div key={i} className="rounded-2xl bg-white p-8 shadow-sm border border-white">
              <div className="text-3xl font-bold text-indigo-600">0{i + 1}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{b.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
