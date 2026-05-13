export default function CTA({ heading, description, primary_label, primary_url, secondary_label, secondary_url }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-2xl rounded bg-indigo-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">{heading}</h2>
        {description && <p className="mt-2 text-indigo-100">{description}</p>}
        <div className="mt-6 flex justify-center gap-3">
          {primary_url && (
            <a href={primary_url} className="rounded bg-white px-5 py-2 text-indigo-700 font-medium">
              {primary_label}
            </a>
          )}
          {secondary_url && (
            <a href={secondary_url} className="rounded border border-white px-5 py-2 text-white">
              {secondary_label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
