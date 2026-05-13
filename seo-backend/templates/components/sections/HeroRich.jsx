export default function HeroRich({ tagTitle, title, subheading, ctaLabel, ctaUrl, trustBadges, animatedText, rotatingItems }) {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 px-6 lg:px-24 py-20">
      <div className="mx-auto max-w-5xl text-center">
        {tagTitle && (
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            {tagTitle}
          </span>
        )}
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>
        {animatedText && (
          <p className="mt-6 text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {animatedText}
          </p>
        )}
        {subheading && (
          <p className="mt-6 text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {subheading}
          </p>
        )}
        {rotatingItems?.length > 0 && (
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            {rotatingItems.map((r, i) => (
              <li key={i} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{r}</li>
            ))}
          </ul>
        )}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your work email"
            className="w-full sm:w-auto px-5 py-3 rounded-lg border border-slate-300 focus:border-indigo-600 focus:outline-none min-w-[300px]"
          />
          <a
            href={ctaUrl ?? '/signup'}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-white font-semibold hover:opacity-90 shadow-lg"
          >
            {ctaLabel ?? 'Get Started'}
          </a>
        </div>
        {trustBadges?.length > 0 && (
          <ul className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            {trustBadges.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
