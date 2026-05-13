export default function FAQ({ items }) {
  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-center">FAQ</h2>
        <div className="mt-8 space-y-4">
          {items?.map((it, i) => (
            <details key={i} className="rounded border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-medium">{it.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
