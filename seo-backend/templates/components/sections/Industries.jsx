export default function Industries({ items }) {
  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((i, idx) => (
          <div key={idx} className="rounded bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{i.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{i.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
