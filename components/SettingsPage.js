import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import ConnectFarcasterModal from "./farcaster/ConnectFarcasterModal";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

const SettingsPage = () => {
  const { farcasterUser } = useUser();
  const { authenticated, user } = usePrivy();
  const [chosenTab, setChosenTab] = useState("general");
  const openGeneralSettings = () => {
    alert("open the general settings");
  };
  const renderSettings = () => {
    switch (chosenTab) {
      case "general":
        return (
          <div className="w-full h-full flex flex-col items-start overflow-y-scroll justify-start">
            <p className="text-2xl">Account Information</p>
            <div className="flex">
              <div className="w-36 h-36 border border-white my-4 rounded-xl overflow-hidden relative">
                <Image src="/ankys/anky.png" fill />
              </div>
              <div className="px-8 py-2 flex flex-col justify-start items-start">
                <p className="text-2xl">your anky</p>
                <div className="my-2">
                  <Button
                    buttonAction={() => alert("get new anky")}
                    buttonText="Change Avatar"
                    buttonColor="bg-red-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full">
              <div className="w-full md:w-1/2 px-2">
                <p className="text-left text-2xl">Display Name</p>
                <input
                  className="w-full p-2 rounded-xl text-black"
                  type="text"
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <p className="text-left text-2xl">Email Address</p>
                <input
                  className="w-full p-2 rounded-xl text-black"
                  type="text"
                  value={user?.email && user.email.address}
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-full px-2">
                <p className="text-left text-2xl">Bio</p>
                <textarea
                  className="w-full p-2 rounded-xl text-black"
                  type="text"
                />
              </div>
            </div>
            <div className="mt-2 ml-2">
              <Button
                buttonText="save changes"
                buttonAction={() => alert("save changes!")}
                buttonColor="bg-green-600"
              />
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="w-full h-full flex flex-col items-start overflow-y-scroll justify-start">
            <p className="text-2xl mb-4">Notification Preferences</p>
            <div className="flex space-x-2">
              <p>do you want email notifications?</p>
              <input type="checkbox" />
            </div>

            <div className="mt-2 ml-2">
              <Button
                buttonText="save changes"
                buttonAction={() => alert("save changes!")}
                buttonColor="bg-green-600"
              />
            </div>
          </div>
        );
      case "farcaster":
        return (
          <div className="w-full h-full flex flex-col items-start overflow-y-scroll justify-start">
            <p className="text-2xl">Farcaster Connection</p>
            <ConnectFarcasterModal />
          </div>
        );
    }
  };
  return (
    <div className="pt-4 md:w-full h-full flex flex-col mx-auto text-white px-4">
      <h2 className="text-4xl ">Settings</h2>
      <small className="text-xs mb-2">
        (this is the bare bones of this part of the app. not working yet)
      </small>
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/5 flex flex-row flex-wrap md:flex-col justify-start items-start ">
          <Button
            buttonAction={() => setChosenTab("general")}
            buttonText="general"
            buttonColor={`${
              chosenTab == "general"
                ? "bg-red-200 text-black"
                : "bg-transparent  text-white"
            } my-2 border-white border`}
          />
          <Button
            buttonAction={() => setChosenTab("farcaster")}
            buttonText="farcaster"
            buttonColor={`${
              chosenTab == "farcaster"
                ? "bg-red-200 text-black"
                : "bg-transparent  text-white"
            } my-2 border-white border`}
          />
          <Button
            buttonAction={() => setChosenTab("notifications")}
            buttonText="notifications"
            buttonColor={`${
              chosenTab == "notifications"
                ? "bg-red-200 text-black"
                : "bg-transparent  text-white"
            } my-2 border-white border`}
          />
          <div className="w-fit px-4 mx-auto">
            <Link passHref href="/library">
              <Button
                buttonColor="bg-red-200 text-black
              bg-transparent text-white
          my-2 border-white border"
                buttonText="go to library"
              />
            </Link>
          </div>
        </div>
        <div className="flex-grow w-full p-4 mb-8 bg-black rounded-xl border border-white">
          {renderSettings()}
        </div>
      </div>

      {/* {authenticated ? (
        <div>
          <p className="mb-4">You are logged in</p>
          <p className="mb-4">
            your associated wallet is: {user.wallet.address}
          </p>
        </div>
      ) : (
        <div></div>
      )}

      {farcasterUser && farcasterUser.status == "approved" ? (
        <div>
          <p className="mb-2">
            you are connected to farcaster as #{farcasterUser.fid}
          </p>
          <p>
            this means that every time that you finish writing you will be able
            to cast it. as you, or anonymously.
          </p>
        </div>
      ) : (
        <ConnectFarcasterModal />
      )} */}
    </div>
  );
};

export default SettingsPage;
