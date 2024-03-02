import { NavLink, useLocation } from "react-router-dom";

const MenuItem = ({ item }: { item: { name: string; path: string } }) => {
  const { pathname } = useLocation();
  return (
    <NavLink
      to={item.path}
      className={`relative text-sm font-medium cursor-pointer ${
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
};

export default MenuItem;
