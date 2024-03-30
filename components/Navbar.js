import React from "react";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { Montserrat_Alternates } from "next/font/google";
import Link from "next/link";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400"],
});

const Navbar = ({ isTextareaClicked }) => {
  const { logout, login, authenticated } = usePrivy();
  return (
    <nav
      style={{
        transitionProperty: "height, opacity",
        transitionDuration: "500ms, 250ms", // First value for height, second for opacity
      }}
      className={`transition-all duration-500 ease-in-out ${
        isTextareaClicked ? "h-0 opacity-0" : "h-24 py-6 opacity-100"
      }   w-full md:px-24 px-12 flex flex-row justify-between items-center`}
    >
      <div className="flex w-fit">
        <div className="w-32 h-16 relative ">
          <Link passHref href="/">
            <Image src="/images/anky-logo.png" fill />
          </Link>
        </div>
      </div>
      {authenticated ? (
        <button
          className={`${montserratAlternates.className} px-4 py-2 hover:bg-gray-100  shadow-xl border-black border rounded`}
          onClick={logout}
        >
          LOGOUT
        </button>
      ) : (
        <button
          className={`${montserratAlternates.className} px-4 py-2 hover:bg-gray-100 shadow-xl border-black border rounded`}
          onClick={login}
        >
          LOG IN
        </button>
      )}
    </nav>
  );
};

export default Navbar;
