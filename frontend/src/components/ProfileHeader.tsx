import { useAuthStore } from '@store/useAuthStore';
import { useChatStore } from '@store/useChatStore';
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader: React.FC = () => {

  const {logout, authUser, updateProfile} = useAuthStore();
  const {isSoundEnabled, toggleSound} = useChatStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hanldeImageUpload = async (e:React.ChangeEvent) => {
    e.preventDefault();
    const file = (e.target as HTMLInputElement).files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      if (typeof base64Image === 'string') {
        setSelectedImage(base64Image);
      } else {
        setSelectedImage(null);
      }
      await updateProfile({ profilePic: base64Image})
    }
  };

  return (
    <div className='p-6 border-b border-slate-700/50'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='avatar avatar-online '>
            <button
              className='size-14 rounded-full overflow-hidden relative group'
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}>
              <img src={selectedImage || authUser?.profilePic || "/avatar.png"} alt="user image" className='size-full object-cover ' />
              <div className='absolute cursor-pointer inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                <span className='text-white text-xs'>Change</span>
              </div>
            </button>
            <input type="file" accept='image/*' className='hidden' ref={fileInputRef} onChange={hanldeImageUpload} />
          </div>
           {/* username and online */}
          <div>
             <h3 className='text-slate-200 font-medium text-base max-w-[180px] truncate'>{authUser?.name?.split(" ")[0]}</h3>
             <p className='text-slate-400 text-xs '>Online</p>
          </div>
        </div>
        {/* Buttons */}
        <div className='flex gap-4 items-center'>
          <button className='text-slate-400 hover:text-slat200 transition-colors cursor-pointer' onClick={logout}>
            <LogOutIcon className='size-5'/>
          </button>
          {/* sound button */}
          <button className='text-slate-400 hover:text-slat200 transition-colors cursor-pointer'
              onClick={() => {
                mouseClickSound.currentTime = 0;
                mouseClickSound.play().catch((error: any) => console.log("Audio play failed",error));
                toggleSound();
              }}>
            {
              isSoundEnabled 
              ? ( <Volume2Icon className='size-5'/> )
              : ( <VolumeOffIcon className='size-5'/> )
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader;
