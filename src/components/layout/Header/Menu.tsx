import React, { useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";

type Item = {
  name: string;
  path: string;
}
export const menuItems: Item[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Shop",
    path: "/shop",
  },
  {
    name: "New Arrivals",
    path: "/new-arrivals",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

interface IMenuProps {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
const Menu: React.FC<IMenuProps> = ({ setOpenMenu }) => {
    const {pathname }= useLocation()
  const onClose = useCallback(() => setOpenMenu(false), [setOpenMenu]);
  return (
    <div className="fixed z-[1000] inset-0 bg-black/30">
      <div className="fixed w-[280px] right-0 top-0 bottom-0 h-screen bg-white">
        <button
          onClick={onClose}
          className="absolute w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full top-2 -left-10"
        >
          <IoMdClose size={20} />
        </button>

        <div className="flex flex-col gap-4 items-center justify-center mt-40">
          {menuItems.map((item, index) => {
            return (
              <NavLink
              onClick={onClose}
                to={item.path}
                key={index}
                className={`relative font-medium cursor-pointer ${
                  pathname !== item.path && "hover:text-orange-600"
                } transition duration-300 ${
                  pathname === item.path
                    ? "text-orange-600 border-b-2 border-b-primary before:h-0"
                    : "text-gray-900"
                }  before:content-[''] before:absolute before:block before:w-full before:h-[2px] before:bottom-0 before:left-0 before:bg-primary before:rounded-full before:scale-x-0 before:transition before:duration-300ß transition before:hover:scale-x-100 duration-300`}
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Menu;
