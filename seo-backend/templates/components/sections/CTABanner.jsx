export default function CTABanner({ heading, description, primaryLabel, primaryUrl, secondaryLabel, secondaryUrl }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-white">
      <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-900 p-12 lg:p-16 text-center text-white shadow-2xl">
        <h2 className="text-3xl lg:text-5xl font-bold leading-tight">{heading}</h2>
        {description && <p className="mt-5 text-indigo-100 text-lg max-w-2xl mx-auto leading-relaxed">{description}</p>}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={primaryUrl ?? '/signup'} className="rounded-lg bg-white px-8 py-3.5 text-indigo-700 font-semibold hover:bg-indigo-50 shadow-lg">
            {primaryLabel ?? 'Start Free Trial'}
          </a>
          {secondaryLabel && (
            <a href={secondaryUrl ?? '/demo'} className="rounded-lg border-2 border-white px-8 py-3 text-white font-semibold hover:bg-white/10">
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
