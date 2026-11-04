import { useState } from 'react';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { createUser } from '../services/api';

const initialState = {
  name: '',
  email: '',
  age: '',
};

function CreateUser() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      throw new Error('Name is required');
    }
    if (!form.email.trim()) {
      throw new Error('Email is required');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      throw new Error('Please enter a valid email address');
    }

    if (form.age !== '') {
      const age = Number(form.age);
      if (!Number.isInteger(age) || age < 1) {
        throw new Error('Age must be a positive whole number');
      }
    }
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
        email: form.email.trim().toLowerCase(),
        ...(form.age !== '' ? { age: Number(form.age) } : {}),
      };

      const response = await createUser(payload);
      setSuccess(`User created successfully with id ${response?.data?._id || 'unknown'}`);
      setForm(initialState);
    } catch (err) {
      setError(err.message || 'Unable to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Users</p>
        <h2 className="text-2xl font-semibold text-white">Create a new user</h2>
        <p className="text-sm text-slate-300">The form matches the backend user schema requirements.</p>
      </div>

      {success ? <AlertMessage type="success" title="Success" message={success} /> : null}
      {error ? <AlertMessage type="error" title="Validation error" message={error} /> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="user-name">
            Full name
          </label>
          <input
            id="user-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-sky-500"
            placeholder="jaswanth"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="user-email">
            Email address
          </label>
          <input
            id="user-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
            placeholder="jaswanthbadipati@gmail.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="user-age">
            Age
          </label>
          <input
            id="user-age"
            name="age"
            type="number"
            min="1"
            value={form.age}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
            placeholder="25"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <LoadingSpinner label="Creating user..." /> : 'Create user'}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
