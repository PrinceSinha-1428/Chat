import ActiveTabSwitch from '@components/ActiveTabSwitch';
import BorderAnimatedContainer from '@components/BorderAnimatedContainer'
import ChatContainer from '@components/ChatContainer';
import ChatList from '@components/ChatList';
import ContactList from '@components/ContactList';
import NoChatContainer from '@components/NoChatContainer';
import ProfileHeader from '@components/ProfileHeader';
import { useChatStore } from '@store/useChatStore';
import React from 'react'

const ChatPage: React.FC = () => {

  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className='relative w-full max-w-6xl h-[800px]  '>
      <BorderAnimatedContainer>
        {/* side bar */}
        <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
        <ProfileHeader/>
        <ActiveTabSwitch/>
        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {activeTab === "chats" ? <ChatList/> : <ContactList/> }
        </div>
        </div>
        {/* right side */}
        <div className='flex flex-1 flex-col bg-slate-900/50 backdrop-blur-sm'>
        {selectedUser ? <ChatContainer/> : <NoChatContainer/>}
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage
