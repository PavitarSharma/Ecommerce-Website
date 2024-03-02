"use client";

import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLock, MdLogout } from "react-icons/md";
import { IoEarth } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import useLogout from "../../hooks/useLogout";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../redux/slices/userSlice";
import MyProfile from "../../components/root/profile/MyProfile";
import MyOrders from "../../components/root/profile/MyOrders";
import Address from "../../components/root/profile/Address";
import ChangePassword from "../../components/root/profile/ChangePassword";

const tabs = [
  {
    name: "Profile",
    icon: FaRegUserCircle,
  },
  {
    name: "Orders",
    icon: BsCart4,
  },
  {
    name: "Address",
    icon: IoEarth,
  },
  {
    name: "Security",
    icon: MdLock,
  },
];

const Profile = () => {
  const [selected, setSelected] = useState("Address");
  const logout = useLogout();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    dispatch(logOut());
    navigate("/");
  };

  return (
    <div className="container py-4 my-8 flex md:flex-row flex-col gap-8">
      <div className="w-[250px] rounded-md max-h-[400px] h-full  flex flex-col gap-2 p-2 bg-white shadow">
        <>
          {tabs.map((tab, index) => {
            return (
              <div
                onClick={() => setSelected(tab.name)}
                key={index}
                className={`h-10 flex items-center gap-2 cursor-pointer text-sm rounded px-2 ${
                  selected === tab.name
                    ? "bg-primary text-white"
                    : "bg-white text-black"
                } ${selected !== tab.name && "hover:bg-gray-100"}`}
              >
                <tab.icon
                  className={`${
                    selected === tab.name ? "text-white" : "text-gray-600"
                  }`}
                />
                <span>{tab.name}</span>
              </div>
            );
          })}
          <button
            onClick={handleLogout}
            className={`h-10 w-full flex items-center gap-2 cursor-pointer text-sm rounded px-2  hover:bg-gray-100`}
          >
            <MdLogout />
            Log out
          </button>
        </>
      </div>

      <div className="flex-1 shadow rounded-md p-4 bg-white">
        {selected === "Profile" && <MyProfile />}
        {selected === "Orders" && <MyOrders />}
        {selected === "Address" && <Address />}
        {selected === "Security" && <ChangePassword />}
      </div>
    </div>
  );
};

export default Profile;
