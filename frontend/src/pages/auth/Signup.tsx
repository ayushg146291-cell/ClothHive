import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    // OAuth handles both sign up and login, so redirect to login
    navigate('/auth/login', { replace: true });
  }, [navigate]);

  return null;
}
