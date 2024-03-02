import React, { useCallback } from "react";
import { LuMenu } from "react-icons/lu";

interface NavbarProps {
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
const AdminNavbar: React.FC<NavbarProps> = ({
  openSidebar,
  setOpenSidebar,
}) => {
  const handleOpenSidebar = useCallback(
    () => setOpenSidebar((prev) => !prev),
    [setOpenSidebar]
  );

  return (
    <header
      className={`${
        openSidebar && "md:w-[calc(100%_-_288px)]"
      } w-full fixed h-16 border border-l-0 top-0 right-0  bg-white z-50`}
    >
      <div className="w-full flex items-center h-full justify-between md:px-6 px-4">
        <button onClick={handleOpenSidebar} className="cursor-pointer">
          <LuMenu size={24} />
        </button>
        <div className="w-10 h-10 rounded-full border"></div>
      </div>
    </header>
  );
};

export default AdminNavbar;
