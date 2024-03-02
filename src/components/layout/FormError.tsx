import React from 'react'
import { AiOutlineWarning } from "react-icons/ai";
const FormError = ({ message}: { message: string}) => {

  if(!message) return null
  return (
    <div className='p-3 bg-red-100 rounded text-sm text-red-600 flex gap-2'>
      <AiOutlineWarning size={20} />
      <span>{message}</span>
    </div>
  )
}

export default FormError