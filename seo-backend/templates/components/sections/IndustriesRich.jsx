export default function IndustriesRich({ heading, items }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-slate-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{heading ?? 'Find Your Next Customer'}</h2>
          <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">Industry-targeted contact data for every B2B vertical.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items?.map((ind, i) => (
            <a key={i} href="#" className="group rounded-2xl bg-white border border-slate-200 p-7 hover:border-indigo-300 hover:shadow-md transition-all block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">{ind.name}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{ind.description}</p>
              <div className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-600">
                Explore <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
