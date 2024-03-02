"use client";
import React from "react";

interface SearchProps {
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ placeholder, value, onChange }) => {
 

  return (
    <div className="relative max-w-xs md:w-[350px]">
      <label htmlFor="hs-table-search" className="sr-only">
        Search
      </label>
      <input
        type="text"
        name="hs-table-search"
        id="hs-table-search"
        value={value}
        onChange={onChange}
        className="py-2 px-3 ps-9 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none"
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
        <svg
          className="h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  );
};

export default Search;
