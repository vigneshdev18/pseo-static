export default function Workflow({ heading, steps }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{heading ?? 'How to find verified B2B data?'}</h2>
        </div>
        <ol className="space-y-10">
          {steps?.map((s, i) => (
            <li key={i} className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {i + 1}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{s.heading}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{s.description}</p>
                {s.checklist?.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {s.checklist.map((c, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1 w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 inline-flex items-center justify-center text-[10px]">✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
