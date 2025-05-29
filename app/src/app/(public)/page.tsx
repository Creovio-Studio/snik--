"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/sign-in");
    }, 350);
  });

  return (
    <div className=" flex items-center w-full h-screen justify-center">
      <Loader className=" h-6 w-6 animate-spin text-gray-500" />
    </div>
  );
};

export default Page;
