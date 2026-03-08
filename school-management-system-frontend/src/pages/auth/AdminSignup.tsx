import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Globe2, Lock, Mail, MapPin, Phone, School, User } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import type { SchoolSignupForm } from '../../types';

const initialForm: SchoolSignupForm = {
  schoolName: '',
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  password: '',
  confirmPassword: '',
  schoolAddress: '',
  schoolPhone: '',
  timezone: 'Africa/Lagos',
  currency: 'NGN',
};

const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const { signupAdmin } = useAuth();
  const [form, setForm] = useState<SchoolSignupForm>(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof SchoolSignupForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await signupAdmin(form);
      if (success) {
        navigate('/dashboard', { replace: true });
        return;
      }

      setError('Unable to create the school account. Check the form values and try again.');
    } catch (_error) {
      setError('An unexpected error occurred during signup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-gradient-to-b from-white/5 to-transparent p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <School className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EduManage</h1>
              <p className="text-sm text-white/60">School onboarding</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
              Create your school workspace and first admin account
            </h2>
            <p className="max-w-xl text-lg text-white/80">
              One form sets up the school record, creates the first administrator, and signs you in immediately.
            </p>

            <div className="grid max-w-xl grid-cols-2 gap-4">
              {[
                ['School profile', 'Create the school workspace with timezone and currency.'],
                ['Admin access', 'Provision the first admin account automatically.'],
                ['Secure auth', 'JWT session starts immediately after signup.'],
                ['Ready to manage', 'Go straight to the dashboard after setup.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">{title}</p>
                  <p className="mt-2 text-sm text-white/70">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-white/50">
            {new Date().getFullYear()} EduManage
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 lg:mx-0">
                <Building2 className="text-white" size={30} />
              </div>
              <h2 className="text-3xl font-bold text-white">Register your school</h2>
              <p className="mt-2 text-white/70">Set up the school profile and create the first admin account.</p>
            </div>

            <div className="card-glassmorphism">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white">School name</label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        value={form.schoolName}
                        onChange={(event) => updateField('schoolName', event.target.value)}
                        required
                        className="input-glassmorphism w-full pl-10"
                        placeholder="Greenfield High School"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">Admin first name</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        value={form.adminFirstName}
                        onChange={(event) => updateField('adminFirstName', event.target.value)}
                        required
                        className="input-glassmorphism w-full pl-10"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">Admin last name</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        value={form.adminLastName}
                        onChange={(event) => updateField('adminLastName', event.target.value)}
                        required
                        className="input-glassmorphism w-full pl-10"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">Admin email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        type="email"
                        value={form.adminEmail}
                        onChange={(event) => updateField('adminEmail', event.target.value)}
                        required
                        className="input-glassmorphism w-full pl-10"
                        placeholder="admin@school.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">School phone</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        value={form.schoolPhone}
                        onChange={(event) => updateField('schoolPhone', event.target.value)}
                        required
                        className="input-glassmorphism w-full pl-10"
                        placeholder="+2348000000000"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white">School address</label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-4 text-white/60" size={18} />
                      <textarea
                        value={form.schoolAddress}
                        onChange={(event) => updateField('schoolAddress', event.target.value)}
                        required
                        className="input-glassmorphism min-h-24 w-full pl-10"
                        placeholder="School address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">Timezone</label>
                    <div className="relative">
                      <Globe2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <select
                        value={form.timezone}
                        onChange={(event) => updateField('timezone', event.target.value)}
                        className="input-glassmorphism w-full pl-10"
                      >
                        {['Africa/Lagos', 'UTC', 'Europe/London', 'America/New_York'].map((timezone) => (
                          <option key={timezone} value={timezone} className="bg-gray-900">
                            {timezone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">Currency</label>
                    <div className="relative">
                      <Globe2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <select
                        value={form.currency}
                        onChange={(event) => updateField('currency', event.target.value)}
                        className="input-glassmorphism w-full pl-10"
                      >
                        {['NGN', 'USD', 'GBP', 'EUR'].map((currency) => (
                          <option key={currency} value={currency} className="bg-gray-900">
                            {currency}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        type="password"
                        value={form.password}
                        onChange={(event) => updateField('password', event.target.value)}
                        required
                        className="input-glassmorphism w-full pl-10"
                        placeholder="At least 8 characters"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">Confirm password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(event) => updateField('confirmPassword', event.target.value)}
                        required
                        className="input-glassmorphism w-full pl-10"
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Creating school...' : 'Create School Account'}</span>
                  {!isSubmitting ? <ArrowRight size={18} className="text-white/80" /> : null}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-white">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-white hover:text-white/80">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
