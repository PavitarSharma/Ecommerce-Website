import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <>
      <AdminSidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div
        className={`md:ml-auto ${
          openSidebar && "md:w-[calc(100%_-_288px)]"
        } w-full min-h-screen`}
      >
        <AdminNavbar
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
        <div className="p-4 mt-16 mb-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
