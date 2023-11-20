import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

const Header: React.FC = () => {
  const { user } = useUser();
  return (
    <header className="text-gray-600 body-font bg-white">
      <div className="flex items-center justify-between w-full h-20 bg-white border-b-2 z-40 fixed">
        <div className="ml-6 md:ml-5">
          <Link
            href="/"
            className="flex title-font font-medium items-center text-gray-900 "
          >
            <Image
              src="https://home.lief.care/wp-content/uploads/2023/05/lief-main-logo.svg"
              alt="logo"
              width={150}
              height={35}
            />
          </Link>
        </div>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center mr-6 md:mr-0">
          {user && (
            <div className="hidden md:flex items-center justify-center mr-5 capitalize py-1 px-3 rounded-md text-lg">
              <p>{`Welcome, ${user.nickname}`}</p>
            </div>
          )}
          {user ? (
            <div className="flex items-center space-x-5">
              <Link
                href="/api/auth/logout"
                className=" md:inline-flex items-center bg-red-500 text-black border-0 py-1 px-3 focus:outline-none hover:bg-red-400 rounded text-base mt-4 md:mt-0"
              >
                Logout
              </Link>
              <img
                alt="profile"
                className="rounded-full w-12 h-12"
                src={user.picture ? user.picture : ""}
              />
            </div>
          ) : (
            <Link
              href="/api/auth/login"
              className="inline-flex items-center mr-8 bg-teal-300 font-medium border-0 py-1 px-3 focus:outline-none hover:bg-teal-400 rounded text-base mt-4 md:mt-0"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
