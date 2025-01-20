// components/Auth.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

const Auth = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(adminId, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_CONTACT_EMAIL;

  return (
    <div id="login" className="w-64 h-80 bg-indigo-50 rounded shadow flex flex-col justify-between p-3">       
      <form className="text-indigo-500" onSubmit={handleSubmit}>
        <fieldset className="border-4 border-dotted border-indigo-500 p-5">
          <legend className="px-2 italic -mx-2">Welcome admin!</legend>
          <label className="text-xs font-bold after:content-['*'] after:text-red-400" htmlFor="adminId">
            Admin ID 
          </label>     
          <input 
            className="w-full p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-indigo-500" 
            type="text"
            id="adminId"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />   
          <label className="text-xs font-bold after:content-['*'] after:text-red-400" htmlFor="password">
            Password  
          </label>
          <input 
            className="w-full p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-indigo-500" 
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a 
            href={`mailto:${adminEmail}?subject=Admin Access Request`}
            className="block text-right text-xs text-yellow-500 text-right mb-4"
          >
            Contact Admin?
          </a>
          <button 
            type="submit"
            className="w-full rounded bg-indigo-500 text-indigo-50 p-2 text-center font-bold hover:bg-indigo-400"
          >
            Log In
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Auth;
