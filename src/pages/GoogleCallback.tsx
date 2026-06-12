import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googleLogin } from '../api/auth';
import { connectEmail } from '../api/emails';
import Spinner from '../components/Spinner';

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = params.get('code');
    const state = params.get('state');

    if (!code) {
      navigate('/login');
      return;
    }

    if (state === 'gmail') {
      connectEmail(code)
        .then(() => navigate('/dashboard'))
        .catch(() => navigate('/dashboard'));
      return;
    }

    // state === 'auth' — exchange code for JWT
    googleLogin(code)
      .then((data) => {
        localStorage.setItem('token', data.accessToken);
        navigate('/dashboard');
      })
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">Completing sign-in…</p>
      </div>
    </div>
  );
}
