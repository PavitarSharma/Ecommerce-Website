import { FiMenu } from "react-icons/fi";
import { IoSearchOutline, IoHeartOutline } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BsHandbag } from "react-icons/bs";

import Logo from "../Logo";
import Search from "./Search";
import { ChangeEvent, useCallback, useState } from "react";
import UserMenu from "./UserMenu";
import Cart from "./Cart";
import Menu, { menuItems } from "./Menu";
import MenuItem from "./MenuItem";
import { useAppSelector } from "../../../redux/hooks";
import { WishlistState } from "../../../redux/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { CartState } from "../../../redux/slices/cartSlice";

const Header = () => {
  const [openSerach, setOpenSearch] = useState(false);
  const [serachTerm, setSerachTerm] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { wishlists } = useAppSelector(WishlistState);
  const { carts } = useAppSelector(CartState);
  const navigate = useNavigate();
  const user = false;

  const toggleSearch = useCallback(() => setOpenSearch((prev) => !prev), []);
  const toggleUserMenu = useCallback(() => setUserMenu((prev) => !prev), []);
  const toggleOpenCart = useCallback(() => setOpenCart((prev) => !prev), []);
  const toggleOpenMenu = useCallback(() => setOpenMenu((prev) => !prev), []);
  const handleSerachChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSerachTerm(event.target.value);
  };
  return (
    <>
      <header className="w-full h-16 bg-white shadow sticky top-0 z-50 left-o right-0">
        <div className="container h-full flex items-center justify-between relative">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="hidden md:flex gap-4 items-center">
              {menuItems.map((item, index) => {
                return <MenuItem item={item} key={index} />;
              })}
            </div>
          </div>
          <div className="flex items-center sm:gap-4 gap-3 relative">
            <button
              onClick={toggleOpenMenu}
              className="md:hidden block cursor-pointer"
            >
              <FiMenu size={24} />
            </button>
            <button onClick={toggleSearch}>
              <IoSearchOutline size={22} />
            </button>
            <button onClick={() => navigate("/wishlist")} className="relative">
              <IoHeartOutline size={24} />
              <span className="bg-primary text-white w-4 h-4 rounded-full absolute -top-1 -right-2 flex items-center justify-center text-[10px]">
                {wishlists?.length}
              </span>
            </button>
            <button onClick={toggleOpenCart} className="relative">
              <BsHandbag size={22} />
              <span className="bg-primary text-white w-4 h-4 rounded-full absolute -top-1 -right-2 flex items-center justify-center text-[10px]">
                {carts?.length}
              </span>
            </button>

            <div
              className="mt-2"
              onBlur={() => setUserMenu(false)}
              onClick={toggleUserMenu}
            >
              {user ? (
                <img
                  src="/images/user.png"
                  alt="profile"
                  loading="lazy"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <button>
                  <HiOutlineUserCircle size={26} />
                </button>
              )}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute w-[200px] bg-white z-10 shadow rounded-md -left-14 transition duration-300 ${
                  userMenu ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <UserMenu />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute h-full backdrop-blur-sm bg-white/30 px-4 left-0 right-0 top-0 transition duration-500 ${
            openSerach ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <Search
            value={serachTerm}
            onChange={handleSerachChange}
            setSearchTerm={setSerachTerm}
            setOpenSerach={setOpenSearch}
          />
        </div>
      </header>
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openMenu && <Menu setOpenMenu={setOpenMenu} />}
    </>
  );
};

export default Header;
