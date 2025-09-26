import { useChatStore } from '@store/useChatStore';
import React, { useEffect } from 'react'
import UserLoadingSkeleton from './UserLoadingSkeleton';
import NoChatContainer from './NoChatContainer';

const ContactList: React.FC = () => {

  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } = useChatStore();

  useEffect(() => {
    getAllContacts();
  },[getAllContacts]);

  if(isUsersLoading) return <UserLoadingSkeleton/>;
  if(allContacts.length === 0) return <NoChatContainer/>
  return (
   <>
      {allContacts.map(allContact => (
        <div key={allContact._id}
        className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
        onClick={() => setSelectedUser(allContact)}
        >
         <div className='flex items-center gap-3'>
          <div className={`avatar avatar-online`}>
            <div className='size-12 rounded-full'>
              <img src={allContact.profilePic || "/avatar.png"} alt={allContact.name} />
            </div>
          </div>
            <h4 className='text-slate-200 font-medium truncate'>{allContact.name}</h4>
         </div>
        </div>
      ))}
    </>
  )
}

export default ContactList
