
import React from 'react'
import { IoFolderOpenOutline } from "react-icons/io5";

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center my-8'>
        <div className='w-[250px] h-[250px] rounded-full bg-gray-100 flex items-center justify-center'>
        <IoFolderOpenOutline className='text-[150px] text-gray-500' />
        </div>
        <p className='mt-4 text-xl text-gray-900 font-semibold'>No Data Found</p>
        <p className='text-xs font-medium text-gray-400 mt-3'>Try adjusting your search and filter, or refresh to find what you&#39;re looking for.</p>
    </div>
  )
}

export default NoData