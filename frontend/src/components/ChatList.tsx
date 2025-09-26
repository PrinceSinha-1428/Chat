import { useChatStore } from '@store/useChatStore';
import React, { useEffect } from 'react';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import NoChatsFound from './NoChatsFound';

const ChatList: React.FC = () => {

  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();

  useEffect(() => {
    getMyChatPartners();
  },[getMyChatPartners]);

  if(isUsersLoading) return <UserLoadingSkeleton/>;
  if(chats.length === 0) return <NoChatsFound/>

  return (
    <>
      {chats.map(chat => (
        <div key={chat._id}
        className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
        onClick={() => setSelectedUser(chat)}
        >
         <div className='flex items-center gap-3'>
          <div className={`avatar avatar-online`}>
            <div className='size-12 rounded-full'>
              <img src={chat.profilePic || "/avatar.png"} alt={chat.name} />
            </div>
          </div>
            <h4 className='text-slate-200 font-medium truncate'>{chat.name}</h4>
         </div>
        </div>
      ))}
    </>
  )
}

export default ChatList
