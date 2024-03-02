"use client";

import React, { useCallback } from "react";

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
    <div className="flex h-10 border border-gray-300">
      <button
        onClick={decrement}
        type="button"
        className="border-r border-gray-300 w-10"
      >
        {"-"}
      </button>
      <div className="h-full w-10 flex items-center justify-center text-sm">
        {total}
      </div>

      <button
        onClick={increment}
        type="button"
        className="border-l border-gray-300 w-10"
      >
        {"+"}
      </button>
    </div>
  );
};

export default AddToCart;
