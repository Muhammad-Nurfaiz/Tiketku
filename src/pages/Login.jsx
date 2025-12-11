import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useToast } from '@/components/common/Toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // If already authenticated redirect to dashboard
  if (isAuthenticated) return <Navigate to="/superadmin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      addToast('Email dan password wajib diisi', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      addToast('Login berhasil', 'success');
      const from = location.state?.from?.pathname || '/superadmin/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err?.message || 'Gagal login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
