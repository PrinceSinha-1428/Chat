import { useChatStore } from '@store/useChatStore'
import React from 'react'

const ActiveTabSwitch: React.FC = () => {
  const { activeTab, setActiveTab } = useChatStore();
  return (
     <div className="tabs tabs-boxed bg-transparent p-2 m-2 rounded-xl justify-around">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tabs px-6 py-2 rounded-xl transition-all duration-300 cursor-pointer ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-500" : ""}`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`tabs px-6 py-2 rounded-xl transition-all duration-300 cursor-pointer ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-500" : ""}`}
      >
        Contacts
      </button>
    </div>
  )
}

export default ActiveTabSwitch
