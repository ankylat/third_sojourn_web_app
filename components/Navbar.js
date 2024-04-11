import React from "react";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { Montserrat_Alternates } from "next/font/google";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400"],
});

const Navbar = ({ isTextareaClicked }) => {
  const { i18n } = useTranslation();
  const { logout, login, authenticated } = usePrivy();
  const { userSettings, setUserSettings } = useSettings();
  return (
    <nav
      style={{
        transitionProperty: "height, opacity",
        transitionDuration: "500ms, 250ms", // First value for height, second for opacity
      }}
      className={`transition-all duration-500 ease-in-out ${
        isTextareaClicked ? "h-0 opacity-0" : "h-24 py-6 opacity-100"
      }   w-full md:px-24 px-2 flex flex-row justify-between items-center`}
    >
      <div className="flex w-fit">
        <Link href="/" className="w-32 h-16 relative cursor-pointer" passHref>
          <Image src="/images/anky-logo.png" fill />
        </Link>
      </div>
      <div className="flex space-x-2">
        <span
          className={`mx-2 cursor-pointer hover:opacity-70 ${
            userSettings.language == "en" ? "text-green-600" : "text-black"
          }`}
          onClick={() =>
            setUserSettings((x) => {
              i18n.changeLanguage("en");
              return { ...x, language: "en" };
            })
          }
        >
          en
        </span>{" "}
        /{" "}
        <span
          className={`cursor-pointer hover:opacity-70 ${
            userSettings.language == "es" ? "text-green-600" : "text-black"
          }`}
          onClick={() =>
            setUserSettings((x) => {
              i18n.changeLanguage("es");
              return { ...x, language: "es" };
            })
          }
        >
          es
        </span>
      </div>
      {authenticated ? (
        <div className="flex space-x-4 items-center">
          <Link
            className="p-2 rounded-full border border-black hover:bg-purple-200 cursor-pointer"
            href="/dashboard"
            passHref
          >
            <FaRegUser size={22} />
          </Link>

          <button
            className={`${montserratAlternates.className} px-4 py-2 hover:bg-gray-100  shadow-xl border-black border rounded`}
            onClick={logout}
          >
            LOGOUT
          </button>
        </div>
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
