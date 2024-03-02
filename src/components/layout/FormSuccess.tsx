import React from 'react'
import { FaRegCircleCheck } from "react-icons/fa6";

const FormSuccess = ({ message}: { message: string}) => {
  if(!message) return null
  return (
    <div className='p-3 bg-green-100 rounded text-sm text-green-600 flex gap-2'>
      <FaRegCircleCheck size={20} />
      <span>{message}</span>
    </div>
  )
}

export default FormSuccess