export default function Testimonials({ items }) {
  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {items?.map((t, i) => (
          <figure key={i} className="rounded bg-white p-6 shadow-sm">
            <blockquote className="text-slate-700 text-sm">"{t.text}"</blockquote>
            <figcaption className="mt-3 text-xs text-slate-500">
              {t.name} — {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
