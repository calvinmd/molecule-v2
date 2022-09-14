import React from "react";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black-1 bg-opacity-50 w-[313px] border border-white border-opacity-5 justify-between">
      <div className="flex flex-col">
        <div className="flex w-full justify-center items-center p-4">
          <img
            className="w-[250px] h-[70px]"
            src={"/img/molecule-logo.svg"}
            alt="molecule"
          />
        </div>
        <div className="relative flex flex-row items-center h-[70px] w-full px-2 rounded-xl  hover:bg-opacity-10 hover:bg-gray-200">
          <span className="text-white text-[16px] font-poppins pl-3">
            Sanction List
          </span>
        </div>
      </div>
      <div className="flex flex-row h-[70px] items-center justify-center p-4">
        <img
          className="w-[35px] h-[35px]"
          src={"/img/avatar_placeholder.png"}
          alt="user"
        />
        <span className="text-white text-[16px] font-poppins truncate p-4">
          0xF9AB0CC40324d0565111846beeb11BCC676D6eaC
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
