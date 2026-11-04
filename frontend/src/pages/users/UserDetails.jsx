import { useEffect, useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUserById } from '../../services/userService';

function UserDetails({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const response = await getUserById(userId);
        setUser(response?.data || null);
      } catch (err) {
        setError(err.message || 'Unable to load user');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadUser();
    }
  }, [userId]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Users</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">User details</h2>
        </div>
        <button type="button" onClick={onBack} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">Back</button>
      </div>

      {error ? <AlertMessage type="error" title="Error" message={error} /> : null}

      {loading ? (
        <LoadingSpinner label="Loading user details..." />
      ) : user ? (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-300">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-slate-400">Name</p>
              <p className="mt-1 font-semibold text-white">{user.name}</p>
            </div>
            <div>
              <p className="text-slate-400">Email</p>
              <p className="mt-1 font-semibold text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-slate-400">Age</p>
              <p className="mt-1 font-semibold text-white">{user.age ?? '—'}</p>
            </div>
            <div>
              <p className="text-slate-400">Created</p>
              <p className="mt-1 font-semibold text-white">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UserDetails;
