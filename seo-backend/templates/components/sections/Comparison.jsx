export default function Comparison({ competitor, rows }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-center">Zintlr vs {competitor}</h2>
        <table className="mt-8 w-full border border-slate-200 text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Feature</th>
              <th className="p-3">Zintlr</th>
              <th className="p-3">{competitor}</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((r, i) => (
              <tr key={i} className="border-t border-slate-200">
                <td className="p-3">{r.feature}</td>
                <td className="p-3">{r.us}</td>
                <td className="p-3">{r.them}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
