const links = [
  { id: 'home', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
];

function Navbar({ activeView, onNavigate }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-stone-200 bg-white/85 backdrop-blur-xl shadow-sm shadow-amber-950/5">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">MERN Studio</p>
          <h1 className="text-xl font-semibold text-stone-900">Admin dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigate(link.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === link.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
