export default function FAQRich({ heading, items }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-slate-50">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-10">{heading ?? 'Frequently asked questions'}</h2>
        <div className="space-y-4">
          {items?.map((it, i) => (
            <details key={i} className="rounded-2xl border border-slate-200 bg-white p-6 group">
              <summary className="cursor-pointer text-lg font-semibold text-slate-900 flex justify-between items-center">
                {it.q}
                <span className="text-2xl text-indigo-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-slate-700 leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
