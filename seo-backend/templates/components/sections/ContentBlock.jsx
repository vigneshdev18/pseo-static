export default function ContentBlock({ blocks }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-white">
      <div className="mx-auto max-w-4xl space-y-16">
        {blocks?.map((b, i) => (
          <div key={i}>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">{b.heading}</h2>
            {b.para1 && <p className="text-slate-700 leading-relaxed text-lg mb-4">{b.para1}</p>}
            {b.para2 && <p className="text-slate-700 leading-relaxed text-lg mb-4">{b.para2}</p>}
            {b.bullets?.length > 0 && (
              <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {b.bullets.map((bul, j) => (
                  <li key={j} className="flex items-start gap-2 text-slate-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>{bul}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
