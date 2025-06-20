import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth-slice/";
const AdminHeader = ({setOpen}) => {
  const dispatch = useDispatch(); // useDispatch hook from Redux store
  const handleLogoutUser = () => {
    dispatch(logoutUser()); // dispatch logout action to Redux store
  };
  return (
    <header className="flex justify-between items-center p-2 bg-gray-900 text-white">
      <Button
        onClick = {() => setOpen(true)}
        className="lg:hidden sm:block cursor-pointer bg-gray-900 hover:bg-gray-800 hover:text-white"
      >
        <AlignJustify />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex flex-1 items-center gap-1 justify-end">
        <span>Logout</span>
        <Button
          onClick = {handleLogoutUser}
          className="cursor-pointer bg-gray-900 hover:bg-gray-800 hover:text-white"
        >
          <LogOut />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
