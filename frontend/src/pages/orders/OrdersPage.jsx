import { useEffect, useMemo, useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { deleteOrder, getOrders } from '../../services/orderService';

function OrdersPage({ onSwitchView, onViewOrder, onEditOrder, onCreateOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(Array.isArray(response?.data) ? response.data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      const customerName = order?.user?.name || '';
      const matchesQuery = `${order._id || ''} ${customerName}`.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || order.status === status;
      const matchesPayment = paymentStatus === 'all' || order.paymentStatus === paymentStatus;
      return matchesQuery && matchesStatus && matchesPayment;
    });
  }, [orders, paymentStatus, search, status]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteOrder(deleteTarget._id);
      setSuccess(`Deleted order ${deleteTarget._id.slice(-6)}`);
      setDeleteTarget(null);
      await loadOrders();
    } catch (err) {
      setError(err.message || 'Unable to delete order');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Orders</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Order management</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => onSwitchView('orders-list')} className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">All orders</button>
            <button type="button" onClick={onCreateOrder} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">Create order</button>
          </div>
        </div>
      </div>

      {success ? <AlertMessage type="success" title="Success" message={success} /> : null}
      {error ? <AlertMessage type="error" title="Error" message={error} /> : null}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order ID or customer" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 lg:max-w-sm" />
          <div className="flex flex-wrap gap-3">
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
              <option value="all">All statuses</option>
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
            <select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500">
              <option value="all">All payments</option>
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="failed">failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading orders..." />
        ) : filteredOrders.length === 0 ? (
          <EmptyState title="No orders found" message="Create a new order or adjust your filters." actionLabel="Create order" onAction={onCreateOrder} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="px-3 py-3 font-medium">Order ID</th>
                  <th className="px-3 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Items</th>
                  <th className="px-3 py-3 font-medium">Total</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Payment</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="text-slate-300">
                    <td className="px-3 py-3 font-medium text-white">{order._id?.slice(-6)}</td>
                    <td className="px-3 py-3">{order.user?.name || order.user || '—'}</td>
                    <td className="px-3 py-3">{order.products?.length || 0}</td>
                    <td className="px-3 py-3">₹{order.totalAmount}</td>
                    <td className="px-3 py-3">{order.status}</td>
                    <td className="px-3 py-3">{order.paymentStatus}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => onViewOrder(order._id)} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800">View</button>
                        <button type="button" onClick={() => onEditOrder(order)} className="rounded-full border border-sky-500/40 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/10">Edit</button>
                        <button type="button" onClick={() => setDeleteTarget(order)} className="rounded-full border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10">Delete</button>
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
        title="Delete order"
        message={`Are you sure you want to delete order ${deleteTarget?._id?.slice(-6) || ''}?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default OrdersPage;
