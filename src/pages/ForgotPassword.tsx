import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../api/auth';
import Button from '../components/Button';
import Input from '../components/Input';
import { apiError } from '../lib/errors';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  // The address the request was actually made for — `email` keeps changing if
  // the user edits the field, and the confirmation must quote what was sent.
  const [sentTo, setSentTo] = useState('');

  const mutation = useMutation({
    mutationFn: () => forgotPassword({ email }),
    onSuccess: () => setSentTo(email),
    onError: (err) => setError(apiError(err, "Couldn't send the email")),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">EmailOnText</Link>
          <p className="text-gray-500 mt-2 text-sm">
            {sentTo ? 'Check your inbox' : 'Reset your password'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-8">
          {sentTo ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-700">
                If an account exists for{' '}
                <span className="font-medium text-gray-900">{sentTo}</span>, we've
                sent it a temporary password.
              </p>
              <p className="text-sm text-gray-500">
                It expires in 30 minutes. Sign in with it, then set a password of
                your own from the Account page.
              </p>
              <Link to="/login" className="mt-2">
                <Button className="w-full">Back to sign in</Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Enter the email address on your account and we'll send you a
                temporary password to sign back in with.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" loading={mutation.isPending} className="w-full mt-1">
                  Send temporary password
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered it?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
