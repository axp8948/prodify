import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignupForm from '@/components/Forms/SignupForm';
import authService from '@/appwrite/auth';
import { useDispatch } from 'react-redux';
import { authLogin } from '@/store/authSlice';

export default function Signup() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (values.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { fullName, email, password } = values;
      const accountResult = await authService.createAccount({
        name: fullName,
        email,
        password
      });

      if (accountResult) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin(userData));
          navigate('/');
        }
      }
    } catch (err) {
      setError('Signup failed. Please check your details or try again later.');
      console.error('Error while signing up:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1013] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create your account
        </h2>

        <SignupForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
