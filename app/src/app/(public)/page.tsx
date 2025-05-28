"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/sign-in");
    }, 350);
  }, [router]);

  return (
    <div className=" flex items-center w-full h-screen justify-center">
      <Loader className=" h-6 w-6 animate-spin text-gray-500" />
    </div>
  );
};

export default Page;
