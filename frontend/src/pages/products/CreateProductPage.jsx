import { useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { createProduct } from '../../services/productService';

const initialState = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  isavail: true,
};

function CreateProductPage({ onBack, onCreated }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim()) throw new Error('Product name is required');
    if (!form.description.trim()) throw new Error('Description is required');
    if (!form.category.trim()) throw new Error('Category is required');
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) throw new Error('Price must be zero or greater');
    const stock = Number(form.stock);
    if (Number.isNaN(stock) || stock < 0) throw new Error('Stock must be zero or greater');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      validate();
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: Number(form.stock),
        isavail: form.isavail,
      };
      const response = await createProduct(payload);
      setSuccess(`Product created successfully with id ${response?.data?._id || 'unknown'}`);
      setForm(initialState);
      if (onCreated) onCreated(response?.data);
    } catch (err) {
      setError(err.message || 'Unable to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Products</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Create product</h2>
        </div>
        {onBack ? <button type="button" onClick={onBack} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">Back</button> : null}
      </div>

      {success ? <AlertMessage type="success" title="Success" message={success} /> : null}
      {error ? <AlertMessage type="error" title="Validation error" message={error} /> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="product-name" className="mb-2 block text-sm font-medium text-slate-200">Product name</label>
          <input id="product-name" name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Wireless Headphones" />
        </div>
        <div>
          <label htmlFor="product-description" className="mb-2 block text-sm font-medium text-slate-200">Description</label>
          <textarea id="product-description" name="description" value={form.description} onChange={handleChange} rows="4" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Describe the product" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-slate-200">Price</label>
            <input id="product-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" placeholder="499" />
          </div>
          <div>
            <label htmlFor="product-category" className="mb-2 block text-sm font-medium text-slate-200">Category</label>
            <input id="product-category" name="category" value={form.category} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Electronics" />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="product-stock" className="mb-2 block text-sm font-medium text-slate-200">Stock</label>
            <input id="product-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" placeholder="20" />
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-200">
            <span>Available</span>
            <input name="isavail" type="checkbox" checked={form.isavail} onChange={handleChange} className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-sky-500" />
          </label>
        </div>
        <button type="submit" disabled={loading} className="inline-flex items-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? <LoadingSpinner label="Creating product..." /> : 'Create product'}
        </button>
      </form>
    </div>
  );
}

export default CreateProductPage;
