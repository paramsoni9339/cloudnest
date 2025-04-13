import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/videos/background1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-50"></div>
      <div className="relative z-10 flex w-full">
        <section className="hidden w-1/2 items-start justify-start bg-opacity-70 p-10 lg:flex xl:w-2/5">
          <div className="flex flex-col space-y-12">
            <Image
              src="/assets/icons/logo-full-brand.png"
              alt="logo"
              width={224}
              height={82}
              className="h-auto animate-pulse"
              style={{ marginTop: '-20px' }} // Move logo upwards
            />
          </div>
        </section>
        <section className="flex flex-1 flex-col items-center justify-center bg-white bg-opacity-0 p-4 py-10 lg:p-10 lg:py-0 rounded-2xl">
          <div className="mb-16 lg:hidden">
            <Image
              src="/assets/icons/logo-full-brand.png"
              alt="logo"
              width={300} // Increased width for mobile
              height={110} // Increased height for mobile
              className="h-auto w-[250px] lg:w-[300px] animate-pulse"
              style={{ marginTop: '-70px' }} // Move logo upwards
            />
          </div>
          {children}
        </section>
      </div>
    </div>
  );
};

export default Layout;
