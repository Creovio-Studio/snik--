import React from "react";

const PublicRouteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex flex-col w-full h-auto">
      <div className="w-full h-full flex items-center justify-center">
        <div className=" w-full mx-auto h-auto">{children}</div>
      </div>
    </div>
  );
};

export default PublicRouteLayout;
