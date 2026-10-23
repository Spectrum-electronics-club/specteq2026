import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, KeyRound, Mail, AlertCircle, Loader2, ShieldCheck, RefreshCw, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── OTP Input Component ──────────────────────────────────────────────────────
const OtpInput = ({ value, onChange, disabled }) => {
  const inputs = useRef([]);
  const digits = value.split('');

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const newDigits = [...digits];
      if (newDigits[idx]) {
        newDigits[idx] = '';
        onChange(newDigits.join(''));
      } else if (idx > 0) {
        newDigits[idx - 1] = '';
        onChange(newDigits.join(''));
        inputs.current[idx - 1]?.focus();
      }
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = val;
    onChange(newDigits.join(''));
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          disabled={disabled}
          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl
                     border-slate-300 focus:border-brand-secondary focus:ring-4
                     focus:ring-brand-secondary/20 focus:outline-none transition-all
                     disabled:opacity-50 disabled:bg-slate-50"
        />
      ))}
    </div>
  );
};

// ─── Main Login/Register Component ───────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState('student');

  // step: 'form' | 'otp' | 'success'
  const [step, setStep] = useState('form');

  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // ── Step 1: Login or Send OTP ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Normal login flow
        const res = await fetch(`${API}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password, loginRole }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        localStorage.setItem('specteq_token', data.token);
        localStorage.setItem('specteq_user', JSON.stringify(data.user));

        if (data.user.role === 'professional' || (data.user.role === 'admin' && loginRole === 'professional')) {
          navigate('/member-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Registration: send OTP first
        const res = await fetch(`${API}/api/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

        setStep('otp');
        setResendCooldown(60);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return setError('Please enter all 6 digits.');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      localStorage.setItem('specteq_token', data.token);
      localStorage.setItem('specteq_user', JSON.stringify(data.user));

      setStep('success');
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setError(err.message);
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOtp('');
      setResendCooldown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render: Success ───────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={42} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-brand-primary mb-2">Registration Complete!</h2>
            <p className="text-slate-500 text-sm mb-4">
              Welcome to Specteq 2026, <strong>{formData.fullName}</strong>!<br/>
              A confirmation email has been sent to <strong>{formData.email}</strong>.
            </p>
            <p className="text-slate-400 text-xs">Redirecting to your dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: OTP Step ─────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <Helmet>
          <title>Verify Email | Specteq Competition Platform</title>
        </Helmet>
        <div className="w-full max-w-md">
          <button
            onClick={() => { setStep('form'); setOtp(''); setError(null); }}
            className="inline-flex items-center text-slate-500 hover:text-brand-primary font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Registration
          </button>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} className="text-sky-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-brand-primary mb-2">Verify Your Email</h2>
              <p className="text-slate-500 text-sm">
                We sent a 6-digit code to<br/>
                <strong className="text-brand-primary">{formData.email}</strong>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-600 text-sm">
                <AlertCircle size={18} className="mr-2 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-brand-primary mb-4 text-center">
                  Enter OTP
                </label>
                <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full flex items-center justify-center py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md transition-all disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                Verify & Create Account
              </button>
            </form>

            {/* Resend */}
            <div className="mt-6 text-center text-sm text-slate-500">
              <p>Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || isLoading}
                className="mt-1 inline-flex items-center gap-1.5 font-bold text-brand-secondary hover:underline disabled:opacity-50 disabled:no-underline focus:outline-none"
              >
                <RefreshCw size={14} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Login / Register Form ────────────────────────────────────────
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
                    type="radio" name="loginRole" value="student"
                    checked={loginRole === 'student'} onChange={(e) => setLoginRole(e.target.value)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm font-semibold text-slate-700">Student</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio" name="loginRole" value="professional"
                    checked={loginRole === 'professional'} onChange={(e) => setLoginRole(e.target.value)}
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
                  type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all"
                  placeholder="John Doe" required={!isLogin} disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-brand-primary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all"
                  placeholder="you@university.edu" required disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-primary mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all"
                  placeholder="••••••••" required disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-sky-400" />
                We'll send a one-time verification code to your email.
              </p>
            )}

            <button
              type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 mt-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              {isLogin ? 'Log In' : 'Send Verification Code'}
            </button>
          </form>

          {!(isLogin && loginRole === 'professional') && (
            <div className="mt-8 text-center text-sm text-slate-500">
              <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  className="ml-2 font-bold text-brand-secondary hover:underline focus:outline-none"
                  onClick={() => { setIsLogin(!isLogin); setError(null); }}
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
