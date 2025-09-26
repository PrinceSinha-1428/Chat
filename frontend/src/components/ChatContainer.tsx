import { useAuthStore } from '@store/useAuthStore';
import { useChatStore } from '@store/useChatStore'
import React, { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import MessageInput from './MessageInput';
import MessageLoadingSkeleton from './MessageLoadingSkeleton';

const ChatContainer: React.FC = () => {

  const { selectedUser, messages, getMessageByUserId, isMessagesLoading } = useChatStore();
  const { authUser } = useAuthStore();

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessageByUserId(selectedUser?._id!)
  },[selectedUser,getMessageByUserId]);

   useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  return (
    <>
      <ChatHeader/>
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {messages.length > 0 && !isMessagesLoading ? (
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map((message, idx) => (
              <div key={message._id || `temp-${idx}`}
                className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"}`}>
                <div className={`chat-bubble relative ${message.senderId !== selectedUser?._id ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-200"}`} >
                {message.text && <p className='mt-2'>{message.text}</p>}
                {message.image && <img src={message.image} className='rounded-lg h-48 object-cover' />}
                <p className='text-xs  mt-1 opacity-75 flex items-center gap-1'>
                  {new Date(message.createdAt).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true })}
                </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? <MessageLoadingSkeleton/> : (
          <NoChatHistoryPlaceholder name={selectedUser?.name!}/>
        )}
      </div>
      <MessageInput/>
    </>
  )
}

export default ChatContainer
