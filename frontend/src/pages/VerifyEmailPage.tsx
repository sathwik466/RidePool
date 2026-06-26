import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import ErrorAlert from '../components/ErrorAlert';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState((location.state as { email?: string })?.email ?? '');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setError('');
    setMessage('');
    try {
      await authApi.sendEmailOtp(email);
      setMessage('OTP sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.verifyEmail(email, code);
      setMessage('Email verified! You can now login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 px-4">
      <div className="card w-full max-w-md">
        <div className="mb-4 flex items-center gap-2 text-brand-700">
          <Mail className="h-6 w-6" />
          <span className="text-lg font-bold">Verify Email</span>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          Enter the OTP sent to your email to activate your account.
        </p>

        {error && <div className="mb-4"><ErrorAlert message={error} /></div>}
        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">OTP Code</label>
            <input
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary flex-1" onClick={sendOtp}>
              Send OTP
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
