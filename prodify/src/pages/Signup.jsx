import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SignupForm from '@/components/forms/SignupForm'
import authService from '@/appwrite/auth'
import { useDispatch } from 'react-redux'
import { authLogin } from '@/store/authSlice'

export default function Signup() {
  // enforce dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // local form state
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { fullName, email, password } = values;
      const accountResult = await authService.createAccount({
        name: fullName,
        email,
        password
      });

      if(accountResult){
        const userData = await authService.getCurrentUser()
        console.log("👤 currentUser:", userData);
        
        if(userData){
          dispatch(authLogin(userData))
          navigate("/");
        }
      }
    } catch (error) {
      console.log("Error while signing up the user to appwrite", error)
    }



    console.log('Signing up with', values)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create your account
        </h2>

        <SignupForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
