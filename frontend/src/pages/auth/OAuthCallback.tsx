import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import { toast } from 'sonner';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');

      if (token && refreshToken) {
        // Save refresh token to localStorage
        localStorage.setItem('clothhive-refresh-token', refreshToken);

        try {
          // Fetch user profile
          const res = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setAuth(res.data, token);
          toast.success('Logged in successfully!');
          navigate('/', { replace: true });
        } catch (error) {
          toast.error('Failed to fetch user profile');
          navigate('/auth/login', { replace: true });
        }
      } else {
        toast.error('Authentication failed');
        navigate('/auth/login', { replace: true });
      }
    };

    handleAuth();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
