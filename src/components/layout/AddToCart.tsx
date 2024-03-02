import React from 'react'

interface AddToCartProps {
    total: number;
    increment: () => void;
    decrement: () => void;
}
const AddToCart: React.FC<AddToCartProps> = ({
    total,
    increment,
    decrement,
}) => {
  return (
    <div className='flex h-9 items-center rounded-full bg-primary/95 text-white'>
        <button onClick={decrement} className='w-6 h-full flex items-center justify-center pl-1 text-lg hover:bg-primary shadow border-0 rounded-l-full'>
            {"-"}
        </button>
        <div className='w-8 flex items-center justify-center h-full text-sm'>
            {total}
        </div>
        <button onClick={increment} className='w-6 h-full flex items-center justify-center pr-1  hover:bg-primary shadow border-0 rounded-r-full'>
            {"+"}
        </button>
    </div>
  )
}

export default AddToCart