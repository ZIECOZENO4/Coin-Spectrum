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
    <div className="min-h-screen w-full flex items-center justify-center bg-black/95">
      <div className="w-full max-w-md p-8">
        <div id="login" className="bg-black/80 rounded-lg shadow-2xl border border-yellow-500/20">        
          <form className="text-yellow-500 p-6" onSubmit={handleSubmit}>
            <fieldset className="border-2 border-dotted border-yellow-500/50 p-6 rounded-md">
              <legend className="px-3 text-lg font-semibold italic text-center">
                Welcome Admin
              </legend>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1" htmlFor="adminId">
                    Admin ID 
                    <span className="text-red-500">*</span>
                  </label>     
                  <input 
                    className="w-full p-2.5 rounded-md bg-black/50 border border-yellow-500/30
                             focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                             transition-all duration-200 outline-none" 
                    type="text"
                    id="adminId"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                  />   
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1" htmlFor="password">
                    Password
                    <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full p-2.5 rounded-md bg-black/50 border border-yellow-500/30
                             focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                             transition-all duration-200 outline-none" 
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <a 
                  href={`mailto:${adminEmail}?subject=Admin Access Request`}
                  className="block text-right text-sm text-yellow-500/80 hover:text-yellow-400 
                           transition-colors duration-200"
                >
                  Contact Admin?
                </a>

                <button 
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-md bg-yellow-500 text-black font-semibold
                           hover:bg-yellow-400 active:bg-yellow-600 
                           transition-all duration-200 transform hover:scale-[1.02]
                           shadow-lg hover:shadow-yellow-500/25"
                >
                  Log In
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
