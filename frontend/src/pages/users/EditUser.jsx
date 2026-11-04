import { useEffect, useState } from 'react';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { updateUser } from '../../services/userService';

function EditUser({ user, onCancel, onUpdated }) {
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        age: user.age ?? '',
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!form.name.trim()) throw new Error('Name is required');
      if (!form.email.trim()) throw new Error('Email is required');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email)) throw new Error('Please enter a valid email address');
      if (form.age !== '') {
        const age = Number(form.age);
        if (!Number.isInteger(age) || age < 1) throw new Error('Age must be a positive whole number');
      }
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        ...(form.age !== '' ? { age: Number(form.age) } : {}),
      };
      const response = await updateUser(user._id, payload);
      setSuccess('User updated successfully');
      if (onUpdated) onUpdated(response?.data);
    } catch (err) {
      setError(err.message || 'Unable to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Users</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Edit user</h2>
        </div>
        <button type="button" onClick={onCancel} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">Cancel</button>
      </div>

      {success ? <AlertMessage type="success" title="Success" message={success} /> : null}
      {error ? <AlertMessage type="error" title="Validation error" message={error} /> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="edit-user-name" className="mb-2 block text-sm font-medium text-slate-200">Full name</label>
          <input id="edit-user-name" name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
        </div>
        <div>
          <label htmlFor="edit-user-email" className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
          <input id="edit-user-email" name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
        </div>
        <div>
          <label htmlFor="edit-user-age" className="mb-2 block text-sm font-medium text-slate-200">Age</label>
          <input id="edit-user-age" name="age" type="number" min="1" value={form.age} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500" />
        </div>
        <button type="submit" disabled={loading} className="inline-flex items-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? <LoadingSpinner label="Updating user..." /> : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

export default EditUser;
