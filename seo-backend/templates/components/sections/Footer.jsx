export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 px-6 lg:px-24 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600" />
              <span className="text-xl font-bold text-white">Zintlr</span>
            </div>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              The world's most accurate B2B contact intelligence platform. Find, verify, and reach decision-makers across 60+ countries.
            </p>
            <ul className="mt-6 flex gap-3">
              {['LinkedIn', 'Twitter', 'YouTube'].map((s) => (
                <li key={s}><a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 inline-flex items-center justify-center text-xs">{s[0]}</a></li>
              ))}
            </ul>
          </div>
          {[
            { h: 'Product', items: ['Database', 'Chrome Extension', 'API', 'Integrations', 'Pricing'] },
            { h: 'Use Cases', items: ['Sales prospecting', 'Recruiting', 'Marketing', 'B2B research', 'Account-based selling'] },
            { h: 'Company', items: ['About', 'Customers', 'Careers', 'Press', 'Contact'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold mb-4">{col.h}</h4>
              <ul className="space-y-2 text-sm">
                {col.items.map((it) => <li key={it}><a href="#" className="hover:text-white">{it}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Zintlr. All rights reserved.</p>
          <ul className="flex gap-6">
            <li><a href="#" className="hover:text-white">Privacy</a></li>
            <li><a href="#" className="hover:text-white">Terms</a></li>
            <li><a href="#" className="hover:text-white">GDPR</a></li>
            <li><a href="#" className="hover:text-white">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
