import BorderAnimatedContainer from '@components/BorderAnimatedContainer'
import { LoaderIcon, Lock, Mail, MessageCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useAuthStore, type LoginData } from '@store/useAuthStore';
import { Link } from 'react-router';



const LoginPage: React.FC = () => {

  const [formData, setFormData] = useState<LoginData>({  email: "",password: "" });
  
    const {isLoggingIn, login} = useAuthStore();
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      login(formData);
    };

   return (
    <div className='w-full flex items-center justify-center p-4 bg-slate-900'>
      <div className='relative w-full max-w-6xl md:h-[800px] h-[650px]'>
        <BorderAnimatedContainer >
        <div className='w-full flex flex-col md:flex-row'>
          {/* form column */}
          <div className='md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30'>
            <div className='w-full max-w-md'>
              <div className='text-center mb-8'>
                <MessageCircleIcon className='size-12 mx-auto text-slate-400 mb-4'/>
                <h2 className='text-2xl font-bold text-slate-200 mb-2'>Welcome back</h2>
                <p className='text-slate-400'>Login to access your account</p>
              </div>
              {/* form */}
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label className='auth-input-label'>Email</label>
                  <div className='relative'>
                    <Mail className='auth-input-icon' />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}  className='input' placeholder='johndoe@gmail.com' />
                  </div>
                </div>
                <div>
                  <label className='auth-input-label'>Password</label>
                  <div className='relative'>
                    <Lock className='auth-input-icon' />
                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}  className='input' placeholder='**********' />
                  </div>
                </div>
                {/* submit button */}
                <button className='auth-btn' disabled={isLoggingIn} type='submit'>{isLoggingIn ? ( <LoaderIcon className='w-full h-5 animate-spin text-center' />) : "Login"}</button>
              </form>
              <div className='mt-6 text-center'>
                <Link to={"/signup"} className='auth-link'>
                Don&apos;t have an account? Sign Up
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">Connect anytime, anywhere</h3>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}

export default LoginPage
