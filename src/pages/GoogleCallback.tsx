import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googleLogin } from '../api/auth';
import { connectEmail } from '../api/emails';
import { buildGmailConnectUrl } from '../lib/googleOauth';
import Spinner from '../components/Spinner';

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);
  const [error, setError] = useState('');
  const [isGmailConnect, setIsGmailConnect] = useState(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = params.get('code');
    const state = params.get('state');

    if (!code) {
      navigate('/login');
      return;
    }

    if (state === 'gmail' || state === 'gmail_addset') {
      setIsGmailConnect(true);
      // Hand the new emailId back so the reopened modal can select it.
      connectEmail(code)
        .then((em) =>
          navigate(
            state === 'gmail_addset' ? `/dashboard?addSet=1&emailId=${em.emailId}` : '/dashboard',
          ),
        )
        .catch((e) => {
          const msg = e?.response?.data?.message ?? e?.message ?? 'Failed to connect Gmail';
          setError(msg);
        });
      return;
    }

    // state === 'auth' — exchange code for JWT
    googleLogin(code)
      .then((data) => {
        localStorage.setItem('token', data.accessToken);
        navigate('/dashboard');
      })
      .catch((e) => {
        const msg = e?.response?.data?.message ?? e?.message ?? 'Google sign-in failed';
        setError(msg);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center px-4">
          <p className="text-red-600 font-medium">
            {isGmailConnect ? "Couldn't connect Gmail" : 'Google sign-in failed'}
          </p>
          <p className="text-sm text-gray-500">{error}</p>
          {isGmailConnect && (
            <p className="text-xs text-gray-400 leading-relaxed">
              On Google's screen, scroll down and check the box that grants access to your
              Gmail. If the checkbox no longer appears, remove SMSMail at{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-gray-600"
              >
                myaccount.google.com/permissions
              </a>
              , then reconnect.
            </p>
          )}
          <div className="flex items-center gap-4">
            {isGmailConnect && (
              <button
                onClick={() => { window.location.href = buildGmailConnectUrl(); }}
                className="text-sm underline text-gray-600 hover:text-gray-900"
              >
                Try again
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm underline text-gray-600 hover:text-gray-900"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">Completing sign-in…</p>
      </div>
    </div>
  );
}
