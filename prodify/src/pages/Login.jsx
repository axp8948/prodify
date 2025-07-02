import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '@/components/Forms/LoginForm';
import { authLogin } from '@/store/authSlice';
import authService from '@/appwrite/auth';
import { useDispatch, useSelector } from 'react-redux';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [values, setValues] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const session = await authService.login(values);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin(userData));
          navigate('/');
        }
      }
    } catch (err) {
      if (err?.message?.toLowerCase().includes("invalid credentials") || err?.code === 401) {
        setError("Incorrect email or password.");
      } else {
        setError("Failed to sign in. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen bg-[#0d1013] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Sign in to your account
        </h2>

        <LoginForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <p className="mt-4 text-sm text-center text-gray-400">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
