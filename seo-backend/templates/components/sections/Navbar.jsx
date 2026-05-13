export default function Navbar({ links }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 px-6 lg:px-24 py-4 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600" />
        <span className="text-lg font-bold tracking-tight">Zintlr</span>
      </a>
      <ul className="hidden lg:flex items-center gap-7 text-sm text-slate-700">
        {(links ?? ['Products', 'Pricing', 'Customers', 'Resources', 'Company']).map((l) => (
          <li key={l}><a href="#" className="hover:text-indigo-600">{l}</a></li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <a href="/login" className="text-sm text-slate-700 hover:text-indigo-600">Sign in</a>
        <a href="/signup" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Get started</a>
      </div>
    </nav>
  );
}
