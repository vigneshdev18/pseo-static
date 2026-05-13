export default function Hero({ title, subtext, cta_primary_label, cta_primary_url, trust_badges }) {
  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtext && <p className="mt-4 text-lg text-slate-600">{subtext}</p>}
        {cta_primary_url && (
          <a
            href={cta_primary_url}
            className="mt-8 inline-block rounded bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700"
          >
            {cta_primary_label}
          </a>
        )}
        {trust_badges?.length > 0 && (
          <ul className="mt-8 flex justify-center gap-4 text-sm text-slate-500">
            {trust_badges.map((b) => (
              <li key={b} className="rounded border border-slate-300 px-3 py-1">
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
