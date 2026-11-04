import { useEffect, useState } from 'react';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { getOrders } from '../services/orderService';
import { getProducts } from '../services/productService';
import { getUsers } from '../services/userService';

function Home({ onNavigate }) {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
          getUsers(),
          getProducts(),
          getOrders(),
        ]);

        setStats({
          users: Array.isArray(usersResponse?.data) ? usersResponse.data.length : 0,
          products: Array.isArray(productsResponse?.data) ? productsResponse.data.length : 0,
          orders: Array.isArray(ordersResponse?.data) ? ordersResponse.data.length : 0,
        });
      } catch (err) {
        setError(err.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-white/85 p-8 shadow-[0_20px_60px_rgba(120,53,15,0.08)] backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Overview</p>
        <h2 className="mt-3 text-3xl font-semibold text-stone-900">Manage users, products, and orders from one place.</h2>
        <p className="mt-4 max-w-2xl text-sm text-stone-600">
          This dashboard connects to your existing Express and MongoDB backend so you can create each resource with the same schema rules the server expects.
        </p>
      </div>

      {error ? <AlertMessage type="error" title="Connection issue" message={error} /> : null}

      {loading ? (
        <LoadingSpinner label="Loading dashboard summary..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Users', value: stats.users, action: () => onNavigate('users') },
            { label: 'Products', value: stats.products, action: () => onNavigate('products') },
            { label: 'Orders', value: stats.orders, action: () => onNavigate('orders') },
          ].map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={card.action}
              className="rounded-2xl border border-stone-200 bg-white/80 p-6 text-left transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-amber-950/5"
            >
              <p className="text-sm text-stone-500">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold text-stone-900">{card.value}</p>
              <p className="mt-3 text-sm text-stone-500">Open {card.label.toLowerCase()} form</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
