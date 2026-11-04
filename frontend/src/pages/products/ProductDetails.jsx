import { useEffect, useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getProductById } from '../../services/productService';

function ProductDetails({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const response = await getProductById(productId);
        setProduct(response?.data || null);
      } catch (err) {
        setError(err.message || 'Unable to load product');
      } finally {
        setLoading(false);
      }
    }

    if (productId) loadProduct();
  }, [productId]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Products</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Product details</h2>
        </div>
        <button type="button" onClick={onBack} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">Back</button>
      </div>

      {error ? <AlertMessage type="error" title="Error" message={error} /> : null}

      {loading ? (
        <LoadingSpinner label="Loading product details..." />
      ) : product ? (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-300">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-slate-400">Name</p>
              <p className="mt-1 font-semibold text-white">{product.name}</p>
            </div>
            <div>
              <p className="text-slate-400">Category</p>
              <p className="mt-1 font-semibold text-white">{product.category}</p>
            </div>
            <div>
              <p className="text-slate-400">Price</p>
              <p className="mt-1 font-semibold text-white">₹{product.price}</p>
            </div>
            <div>
              <p className="text-slate-400">Stock</p>
              <p className="mt-1 font-semibold text-white">{product.stock}</p>
            </div>
            <div>
              <p className="text-slate-400">Availability</p>
              <p className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.isavail ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>{product.isavail ? 'Available' : 'Unavailable'}</p>
            </div>
            <div>
              <p className="text-slate-400">Created</p>
              <p className="mt-1 font-semibold text-white">{product.createdAt ? new Date(product.createdAt).toLocaleString() : '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-slate-400">Description</p>
            <p className="mt-1 text-slate-300">{product.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProductDetails;
