import { useEffect, useMemo, useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { deleteProduct, getProducts } from '../../services/productService';

function ProductsPage({ onSwitchView, onViewProduct, onEditProduct, onCreateProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(Array.isArray(response?.data) ? response.data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) => {
      const matchesQuery = `${product.name || ''} ${product.description || ''}`.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || product.category === category;
      const matchesAvailability = availability === 'all' || String(product.isavail) === availability;
      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [availability, category, products, search]);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category).filter(Boolean))), [products]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteProduct(deleteTarget._id);
      setSuccess(`Deleted ${deleteTarget.name}`);
      setDeleteTarget(null);
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Unable to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Products</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Product management</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => onSwitchView('products-list')} className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">All products</button>
            <button type="button" onClick={onCreateProduct} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">Create product</button>
          </div>
        </div>
      </div>

      {success ? <AlertMessage type="success" title="Success" message={success} /> : null}
      {error ? <AlertMessage type="error" title="Error" message={error} /> : null}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or description" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 lg:max-w-sm" />
          <div className="flex flex-wrap gap-3">
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
              <option value="all">All availability</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading products..." />
        ) : filteredProducts.length === 0 ? (
          <EmptyState title="No products found" message="Create a new product or adjust your filters." actionLabel="Create product" onAction={onCreateProduct} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Price</th>
                  <th className="px-3 py-3 font-medium">Stock</th>
                  <th className="px-3 py-3 font-medium">Availability</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="text-slate-300">
                    <td className="px-3 py-3">
                      <div className="font-medium text-white">{product.name}</div>
                      <div className="text-xs text-slate-400">{product.description}</div>
                    </td>
                    <td className="px-3 py-3">{product.category}</td>
                    <td className="px-3 py-3">₹{product.price}</td>
                    <td className="px-3 py-3">{product.stock}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.isavail ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                        {product.isavail ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => onViewProduct(product._id)} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800">View</button>
                        <button type="button" onClick={() => onEditProduct(product)} className="rounded-full border border-sky-500/40 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/10">Edit</button>
                        <button type="button" onClick={() => setDeleteTarget(product)} className="rounded-full border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete product"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this product'}?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default ProductsPage;
