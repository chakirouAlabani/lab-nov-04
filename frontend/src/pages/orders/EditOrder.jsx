import { useEffect, useMemo, useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { updateOrder } from '../../services/orderService';
import { getProducts } from '../../services/productService';
import { getUsers } from '../../services/userService';

const initialItem = { product: '', quantity: 1, price: '' };
const initialShipping = { address: '', city: '', state: '', pincode: '' };

function EditOrder({ order, onCancel, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    user: '',
    products: [initialItem],
    totalAmount: '',
    status: 'pending',
    shippingAddress: initialShipping,
    paymentMethod: 'COD',
    paymentStatus: 'pending',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadReferenceData() {
      try {
        setLoading(true);
        const [usersResponse, productsResponse] = await Promise.all([getUsers(), getProducts()]);
        setUsers(Array.isArray(usersResponse?.data) ? usersResponse.data : []);
        setProducts(Array.isArray(productsResponse?.data) ? productsResponse.data : []);
      } catch (err) {
        setError(err.message || 'Unable to load users and products');
      } finally {
        setLoading(false);
      }
    }

    loadReferenceData();
  }, []);

  useEffect(() => {
    if (order) {
      setForm({
        user: order.user?._id || order.user || '',
        products: (order.products || []).map((item) => ({
          product: item.product?._id || item.product || '',
          quantity: item.quantity || 1,
          price: item.price ?? '',
        })),
        totalAmount: order.totalAmount ?? '',
        status: order.status || 'pending',
        shippingAddress: {
          address: order.shippingAddress?.address || '',
          city: order.shippingAddress?.city || '',
          state: order.shippingAddress?.state || '',
          pincode: order.shippingAddress?.pincode || '',
        },
        paymentMethod: order.paymentMethod || 'COD',
        paymentStatus: order.paymentStatus || 'pending',
      });
    }
  }, [order]);

  const calculatedTotal = useMemo(() => {
    return form.products.reduce((sum, item) => {
      const selectedProduct = products.find((product) => product._id === item.product);
      const price = item.price !== '' ? Number(item.price) : selectedProduct?.price ?? 0;
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0);
  }, [form.products, products]);

  useEffect(() => {
    setForm((current) => ({ ...current, totalAmount: String(calculatedTotal) }));
  }, [calculatedTotal]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleShippingChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, shippingAddress: { ...current.shippingAddress, [name]: value } }));
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      products: current.products.map((item, itemIndex) => (itemIndex === index ? { ...item, [name]: value } : item)),
    }));
  };

  const addItem = () => setForm((current) => ({ ...current, products: [...current.products, { ...initialItem }] }));
  const removeItem = (index) => setForm((current) => ({ ...current, products: current.products.filter((_, itemIndex) => itemIndex !== index) }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!form.user) throw new Error('Please select a user');
      if (!form.products.length) throw new Error('Add at least one product');
      setSubmitting(true);
      const payload = {
        user: form.user,
        products: form.products.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
          price: item.price !== '' ? Number(item.price) : (products.find((product) => product._id === item.product)?.price ?? 0),
        })),
        totalAmount: Number(calculatedTotal),
        status: form.status,
        shippingAddress: {
          address: form.shippingAddress.address.trim(),
          city: form.shippingAddress.city.trim(),
          state: form.shippingAddress.state.trim(),
          pincode: form.shippingAddress.pincode.trim(),
        },
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentStatus,
      };
      const response = await updateOrder(order._id, payload);
      setSuccess('Order updated successfully');
      if (onUpdated) onUpdated(response?.data);
    } catch (err) {
      setError(err.message || 'Unable to update order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading order form..." />;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Orders</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Edit order</h2>
        </div>
        <button type="button" onClick={onCancel} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">Cancel</button>
      </div>

      {success ? <AlertMessage type="success" title="Success" message={success} /> : null}
      {error ? <AlertMessage type="error" title="Validation error" message={error} /> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="edit-order-user" className="mb-2 block text-sm font-medium text-slate-200">Customer</label>
            <select id="edit-order-user" name="user" value={form.user} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
              <option value="">Select a user</option>
              {users.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.email})</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="edit-order-status" className="mb-2 block text-sm font-medium text-slate-200">Order status</label>
            <select id="edit-order-status" name="status" value={form.status} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Order items</h3>
            <button type="button" onClick={addItem} className="rounded-full border border-sky-500/40 px-3 py-2 text-sm font-medium text-sky-300 transition hover:bg-sky-500/10">+ Add item</button>
          </div>
          <div className="space-y-4">
            {form.products.map((item, index) => (
              <div key={`${item.product || 'new'}-${index}`} className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
                <div>
                  <label htmlFor={`edit-product-${index}`} className="mb-2 block text-sm font-medium text-slate-200">Product</label>
                  <select id={`edit-product-${index}`} name="product" value={item.product} onChange={(event) => handleItemChange(index, event)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
                    <option value="">Select a product</option>
                    {products.map((product) => <option key={product._id} value={product._id}>{product.name} • ₹{product.price} • stock {product.stock}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor={`edit-quantity-${index}`} className="mb-2 block text-sm font-medium text-slate-200">Quantity</label>
                  <input id={`edit-quantity-${index}`} name="quantity" type="number" min="1" value={item.quantity} onChange={(event) => handleItemChange(index, event)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
                </div>
                <div>
                  <label htmlFor={`edit-price-${index}`} className="mb-2 block text-sm font-medium text-slate-200">Price</label>
                  <input id={`edit-price-${index}`} name="price" type="number" min="0" step="0.01" value={item.price} onChange={(event) => handleItemChange(index, event)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" placeholder={products.find((prod) => prod._id === item.product)?.price ?? '0'} />
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={() => removeItem(index)} className="rounded-full border border-rose-500/40 px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Shipping details</h3>
            <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300">Total: ₹{calculatedTotal}</div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="edit-shipping-address" className="mb-2 block text-sm font-medium text-slate-200">Address</label>
              <input id="edit-shipping-address" name="address" value={form.shippingAddress.address} onChange={handleShippingChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
            </div>
            <div>
              <label htmlFor="edit-shipping-city" className="mb-2 block text-sm font-medium text-slate-200">City</label>
              <input id="edit-shipping-city" name="city" value={form.shippingAddress.city} onChange={handleShippingChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
            </div>
            <div>
              <label htmlFor="edit-shipping-state" className="mb-2 block text-sm font-medium text-slate-200">State</label>
              <input id="edit-shipping-state" name="state" value={form.shippingAddress.state} onChange={handleShippingChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
            </div>
            <div>
              <label htmlFor="edit-shipping-pincode" className="mb-2 block text-sm font-medium text-slate-200">Pincode</label>
              <input id="edit-shipping-pincode" name="pincode" value={form.shippingAddress.pincode} onChange={handleShippingChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
            </div>
            <div>
              <label htmlFor="edit-payment-method" className="mb-2 block text-sm font-medium text-slate-200">Payment method</label>
              <select id="edit-payment-method" name="paymentMethod" value={form.paymentMethod} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
                <option value="COD">COD</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-payment-status" className="mb-2 block text-sm font-medium text-slate-200">Payment status</label>
              <select id="edit-payment-status" name="paymentStatus" value={form.paymentStatus} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="failed">failed</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="inline-flex items-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
          {submitting ? <LoadingSpinner label="Updating order..." /> : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

export default EditOrder;
