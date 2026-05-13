export default function Compliance({ heading, description, cards }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold">{heading}</h2>
          {description && <p className="mt-4 text-indigo-100 text-lg max-w-3xl mx-auto leading-relaxed">{description}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards?.map((c, i) => (
            <div key={i} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-4 flex items-center justify-center font-bold">✓</div>
              <h3 className="font-bold text-base">{c.title}</h3>
              <p className="mt-2 text-xs text-indigo-200 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
