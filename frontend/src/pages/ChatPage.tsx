import { useAuthStore } from '@store/useAuthStore'
import React from 'react'

const ChatPage: React.FC = () => {
  const { logout} = useAuthStore();
  return (
    <div className='flex justify-center items-center min-h-screen gap-6 z-10'>
      <button className='px-6 py-3 rounded-md bg-red-500 cursor-pointer' onClick={logout}>Logout</button>
    </div>
  )
}

export default ChatPage
