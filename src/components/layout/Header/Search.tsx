import React, { useCallback } from "react";
import { IoSearchOutline, IoClose } from "react-icons/io5";

interface ISeracgProps {
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  setOpenSerach: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}
const Search: React.FC<ISeracgProps> = ({ setOpenSerach, value, onChange, setSearchTerm }) => {
  const handleClose = useCallback(() => {
    setOpenSerach(false)
    setSearchTerm("")
  }, [setSearchTerm, setOpenSerach]);


  return (
    <div className="flex items-center gap-4 max-w-4xl mx-auto h-full w-full">
      <div className="flex-1 h-12 relative rounded-md border border-primary bg-gray-50">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search your product from here..."
          className="w-full h-full border-0 outline-none pl-12 px-4 rounded-md bg-transparent text-sm text-gray-900"
        />
        <button className="absolute left-4 top-1/2 -translate-y-1/2">
          <IoSearchOutline size={22} className="text-gray-700" />
        </button>
      </div>
      <button
        onClick={handleClose}
        className=" w-14 h-12 border border-primary rounded-md flex items-center justify-center"
      >
        <IoClose size={20} className="text-primary" />
      </button>
    </div>
  );
};

export default Search;
