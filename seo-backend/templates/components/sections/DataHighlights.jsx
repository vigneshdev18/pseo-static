export default function DataHighlights({ heading, description, highlights }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{heading}</h2>
          {description && <p className="mt-4 text-slate-600 text-lg leading-relaxed">{description}</p>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {highlights?.map((h, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900">{h.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
