import React from 'react'
import { IconType } from 'react-icons'

interface IconButton {
    icon: IconType;
    onClick: () => void;
    active?: boolean;
}


const IconButton = ({ icon: Icon, onClick, active}: IconButton) => {
  return (
    <button type='button' onClick={onClick} className={`w-9 h-9 rounded-full flex items-center justify-center border border-gray-300 hover:bg-primary hover:text-white transition cursor-pointer ${active && "bg-primary text-white"}`}>
        <Icon size={18} />
    </button>
  )
}

export default IconButton