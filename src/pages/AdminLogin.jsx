import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // If successful, save token
      localStorage.setItem('specteq_token', data.token);
      localStorage.setItem('specteq_user', JSON.stringify(data.user));

      // Verify if user is actually an admin
      if (data.user.role !== 'admin') {
        localStorage.removeItem('specteq_token');
        localStorage.removeItem('specteq_user');
        throw new Error('Access Denied. You do not have administrator privileges.');
      }

      // Redirect to admin panel
      navigate('/admin');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Admin Login | Specteq</title>
      </Helmet>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-brand-accent mb-4">
          <Shield size={48} />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          Admin Gateway for Specteq
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Restricted access for authorized personnel only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-700">

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-start text-red-200">
              <AlertCircle className="mr-2 shrink-0 mt-0.5" size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Admin Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-slate-600 rounded-lg shadow-sm bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
                  placeholder="admin@specteq.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-slate-600 rounded-lg shadow-sm bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-accent hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
