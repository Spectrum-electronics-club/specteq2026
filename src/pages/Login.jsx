import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, KeyRound, Mail, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState('student'); // 'student' or 'professional'
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/register';

    const payload = isLogin 
      ? { email: formData.email, password: formData.password, loginRole }
      : { fullName: formData.fullName, email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        throw new Error(`Server returned an invalid response (Status ${response.status}). Is the server running?`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      // Save JWT token and user info to local storage
      localStorage.setItem('specteq_token', data.token);
      localStorage.setItem('specteq_user', JSON.stringify(data.user));

      // Redirect to dashboard based on role
      if (data.user.role === 'professional' || (data.user.role === 'admin' && loginRole === 'professional')) {
        navigate('/member-dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Helmet>
        <title>{isLogin ? 'Login' : 'Register'} | Specteq Competition Platform</title>
      </Helmet>
      
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-brand-primary font-medium mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-brand-primary mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Log in to access your dashboard' : 'Join the competition platform'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-600 text-sm">
              <AlertCircle size={18} className="mr-2 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {isLogin && (
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="loginRole" 
                    value="student" 
                    checked={loginRole === 'student'} 
                    onChange={(e) => setLoginRole(e.target.value)} 
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm font-semibold text-slate-700">Student</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="loginRole" 
                    value="professional" 
                    checked={loginRole === 'professional'} 
                    onChange={(e) => setLoginRole(e.target.value)} 
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm font-semibold text-slate-700">Evaluator / Member</span>
                </label>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-brand-primary mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all" 
                  placeholder="John Doe" 
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-brand-primary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all" 
                  placeholder="you@university.edu" 
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-primary mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all" 
                  placeholder="••••••••" 
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 mt-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          {!(isLogin && loginRole === 'professional') && (
            <div className="mt-8 text-center text-sm text-slate-500">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button"
                  className="ml-2 font-bold text-brand-secondary hover:underline focus:outline-none" 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                >
                  {isLogin ? 'Register now' : 'Log in here'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
