"use client";
import { useAuthContext } from "@/context/auth-provider";
import React from "react";

const Workspace = () => {
  const { user } = useAuthContext();
  return <div className=" w-full ">{user?.user_id}</div>;
};

export default Workspace;
