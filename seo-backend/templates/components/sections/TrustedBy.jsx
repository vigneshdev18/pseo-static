export default function TrustedBy({ label, logos }) {
  const fallback = ['MSI', 'PointBank', 'Hindware', 'IGT', 'AMP', 'Capgemini', 'Sequel'];
  return (
    <section className="border-y border-slate-200 px-6 lg:px-24 py-12 bg-white">
      <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider">
        {label ?? 'Trusted by high-growth companies'}
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {(logos ?? fallback).map((l) => (
          <li key={l} className="text-xl font-bold text-slate-400">{l}</li>
        ))}
      </ul>
    </section>
  );
}
