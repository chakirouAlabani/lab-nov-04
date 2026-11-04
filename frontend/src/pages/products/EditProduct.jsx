import { useEffect, useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { updateProduct } from '../../services/productService';

function EditProduct({ product, onCancel, onUpdated }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', isavail: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        category: product.category || '',
        stock: product.stock ?? '',
        isavail: Boolean(product.isavail),
      });
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!form.name.trim()) throw new Error('Product name is required');
      if (!form.description.trim()) throw new Error('Description is required');
      if (!form.category.trim()) throw new Error('Category is required');
      const price = Number(form.price);
      if (Number.isNaN(price) || price < 0) throw new Error('Price must be zero or greater');
      const stock = Number(form.stock);
      if (Number.isNaN(stock) || stock < 0) throw new Error('Stock must be zero or greater');
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: Number(form.stock),
        isavail: form.isavail,
      };
      const response = await updateProduct(product._id, payload);
      setSuccess('Product updated successfully');
      if (onUpdated) onUpdated(response?.data);
    } catch (err) {
      setError(err.message || 'Unable to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Products</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Edit product</h2>
        </div>
        <button type="button" onClick={onCancel} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">Cancel</button>
      </div>
      {success ? <AlertMessage type="success" title="Success" message={success} /> : null}
      {error ? <AlertMessage type="error" title="Validation error" message={error} /> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="edit-product-name" className="mb-2 block text-sm font-medium text-slate-200">Product name</label>
          <input id="edit-product-name" name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
        </div>
        <div>
          <label htmlFor="edit-product-description" className="mb-2 block text-sm font-medium text-slate-200">Description</label>
          <textarea id="edit-product-description" name="description" value={form.description} onChange={handleChange} rows="4" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="edit-product-price" className="mb-2 block text-sm font-medium text-slate-200">Price</label>
            <input id="edit-product-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
          </div>
          <div>
            <label htmlFor="edit-product-category" className="mb-2 block text-sm font-medium text-slate-200">Category</label>
            <input id="edit-product-category" name="category" value={form.category} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="edit-product-stock" className="mb-2 block text-sm font-medium text-slate-200">Stock</label>
            <input id="edit-product-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-200">
            <span>Available</span>
            <input name="isavail" type="checkbox" checked={form.isavail} onChange={handleChange} className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-sky-500" />
          </label>
        </div>
        <button type="submit" disabled={loading} className="inline-flex items-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? <LoadingSpinner label="Updating product..." /> : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
