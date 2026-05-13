export default function Features({ heading, subheading, items }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{heading ?? 'Built for B2B prospecting at scale'}</h2>
          {subheading && <p className="mt-4 text-slate-600 text-lg max-w-3xl mx-auto">{subheading}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((f, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-7 hover:shadow-lg hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 mb-5 flex items-center justify-center">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
