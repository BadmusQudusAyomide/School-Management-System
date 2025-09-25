import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, School, Mail, Lock, Shield, Users, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@school.com', password: 'password123' },
    { role: 'Teacher', email: 'teacher@school.com', password: 'password123' },
    { role: 'Student', email: 'student@school.com', password: 'password123' },
    { role: 'Parent', email: 'parent@school.com', password: 'password123' },
    { role: 'Accountant', email: 'accountant@school.com', password: 'password123' }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Hero Panel (visible on large screens) */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
              <School className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EduManage</h1>
              <p className="text-white/60 text-sm">All-in-one School Management</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Manage your school with clarity and confidence
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              Streamline administration, boost teacher productivity, and empower students and parents with real-time insights.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-xl">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center mb-3">
                  <Shield className="text-white" size={18} />
                </div>
                <p className="text-white font-medium">Secure & Reliable</p>
                <p className="text-white/70 text-sm">Enterprise-grade security for your data.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center mb-3">
                  <Users className="text-white" size={18} />
                </div>
                <p className="text-white font-medium">All Roles Covered</p>
                <p className="text-white/70 text-sm">Admins, Teachers, Students, Parents.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center mb-3">
                  <BookOpen className="text-white" size={18} />
                </div>
                <p className="text-white font-medium">Academics First</p>
                <p className="text-white/70 text-sm">Grades, attendance, timetable.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center mb-3">
                  <CheckCircle className="text-white" size={18} />
                </div>
                <p className="text-white font-medium">Easy to Use</p>
                <p className="text-white/70 text-sm">Beautiful, modern and fast UI.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/70">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Trusted by 50+ schools
            </div>
          </div>

          {/* Footer */}
          <div className="text-white/50 text-sm">
            © {new Date().getFullYear()} EduManage. All rights reserved.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="mx-auto lg:mx-0 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-4">
                <School className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white">Welcome back</h2>
              <p className="mt-2 text-white/70">Sign in to access your dashboard</p>
            </div>

            {/* Social Logins (placeholders) */}
            <div className="card-glassmorphism">
              <div className="grid grid-cols-1 gap-3">
                <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  <span className="text-sm font-medium">Continue with Google</span>
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition">
                  <img src="https://www.svgrepo.com/show/303355/microsoft-logo.svg" alt="Microsoft" className="w-5 h-5" />
                  <span className="text-sm font-medium">Continue with Microsoft</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-black text-white/60 text-xs">or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-glassmorphism pl-10 w-full"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-glassmorphism pl-10 pr-10 w-full"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-white/60" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-white focus:ring-white border-white/20 bg-white/5 rounded"
                    />
                    <span className="text-sm text-white">Remember me</span>
                  </label>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-white hover:text-white/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  className="w-full btn-primary py-3 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <span className="inline-block h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></span>
                  )}
                  <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                  {!isLoading && <ArrowRight size={18} className="text-white/80" />}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-white/80 mb-3">Try demo accounts:</p>
                <div className="grid grid-cols-1 gap-2">
                  {demoCredentials.map((cred) => (
                    <button
                      key={cred.role}
                      onClick={() => fillDemoCredentials(cred.email, cred.password)}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-white"
                    >
                      <span className="font-medium">{cred.role}</span>
                      <span className="text-white/70">{cred.email}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-white">
                  Don't have a school account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-white hover:text-white/80"
                  >
                    Register your school
                  </Link>
                </p>
                <p className="text-xs text-white/50 mt-2">By signing in, you agree to our Terms and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
