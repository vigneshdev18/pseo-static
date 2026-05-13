export default function TrialCTA({ heading, description, ctaLabel }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-white">
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-10 lg:p-16 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-slate-900">{heading}</h2>
        {description && <p className="mt-5 text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">{description}</p>}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Work email"
            className="px-5 py-3 rounded-lg border border-slate-300 bg-white min-w-[280px]"
          />
          <a href="/signup" className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-white font-semibold shadow-lg hover:opacity-90">
            {ctaLabel ?? 'Get a call back'}
          </a>
        </div>
      </div>
    </section>
  );
}
