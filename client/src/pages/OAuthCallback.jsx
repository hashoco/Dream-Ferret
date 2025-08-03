import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);

      setUser(decoded);
    }

    navigate('/');
  }, [navigate, setUser]);

  
  return (
    <div className="flex justify-center items-center h-screen text-lg">
      로그인 처리 중입니다...
    </div>
  );
}
