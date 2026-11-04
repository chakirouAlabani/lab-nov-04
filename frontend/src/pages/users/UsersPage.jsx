import { useEffect, useMemo, useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { deleteUser, getUsers } from '../../services/userService';

function UsersPage({ onSwitchView, onViewUser, onEditUser, onCreateUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(Array.isArray(response?.data) ? response.data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      const haystack = `${user.name || ''} ${user.email || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [search, users]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteUser(deleteTarget._id);
      setSuccess(`Deleted ${deleteTarget.name}`);
      setDeleteTarget(null);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Unable to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Users</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">User management</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onSwitchView('users-list')}
              className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              All users
            </button>
            <button
              type="button"
              onClick={onCreateUser}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Create user
            </button>
          </div>
        </div>
      </div>

      {success ? <AlertMessage type="success" title="Success" message={success} /> : null}
      {error ? <AlertMessage type="error" title="Error" message={error} /> : null}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 md:max-w-sm"
          />
          <p className="text-sm text-slate-400">{filteredUsers.length} users</p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading users..." />
        ) : filteredUsers.length === 0 ? (
          <EmptyState title="No users found" message="Create a new user or adjust your search." actionLabel="Create user" onAction={onCreateUser} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Age</th>
                  <th className="px-3 py-3 font-medium">Created</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="text-slate-300">
                    <td className="px-3 py-3 font-medium text-white">{user.name}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">{user.age ?? '—'}</td>
                    <td className="px-3 py-3">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => onViewUser(user._id)} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800">View</button>
                        <button type="button" onClick={() => onEditUser(user)} className="rounded-full border border-sky-500/40 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/10">Edit</button>
                        <button type="button" onClick={() => setDeleteTarget(user)} className="rounded-full border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10">Delete</button>
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
        title="Delete user"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this user'}?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default UsersPage;
