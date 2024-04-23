import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useSettings } from "../../context/SettingsContext";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { getAnkyverseQuestionForToday } from "../../lib/ankyverse";
import Image from "next/image";
import Button from "../../components/Button";
import { getThisUserWritings } from "../../lib/irys";
import { FaCopy } from "react-icons/fa";

const DashboardIndex = () => {
  const { authenticated, login, ready } = usePrivy();
  const { allUserWritings, setAllUserWritings } = useUser();
  const [writings, setWritings] = useState([]);
  const [writingForDisplay, setWritingForDisplay] = useState(null);
  const [textCopied, setTextCopied] = useState(false);
  const [chosenAnkyverseDay, setChosenAnkyverseDay] = useState(null);
  const [totalNewenEarned, setTotalNewenEarned] = useState(0);
  const [userMentor, setUserMentor] = useState({
    imageUrl: "/images/darkoh.png",
    name: "Darkoh",
  });
  const [userActivity, setUserActivity] = useState({});
  const { userSettings } = useSettings();
  const { wallets } = useWallets();
  const thisUserWallet = wallets.at(0);

  const startTimestamp = 1711861200;

  // Run the check when component mounts or writings change
  useEffect(() => {
    if (authenticated && ready) {
      checkUserActivity();
    }
  }, [authenticated, ready]);

  useEffect(() => {
    // Function to load writings from local storage
    const loadWritings = () => {
      let allWritings = [];
      console.log("the local storage is: ", localStorage);
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("session - ")) {
          // Ensure to only get writing sessions
          const writingData = localStorage.getItem(key);
          allWritings.push(JSON.parse(writingData));
        }
      }
      setWritings(allWritings);
    };
    if (!authenticated && ready) {
      loadWritings();
    }
  }, [ready, authenticated]);

  // Calculate the current Ankyverse day
  const getCurrentAnkyverseDay = () => {
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    return (
      Math.floor((currentTimestampInSeconds - startTimestamp) / (24 * 3600)) + 1
    );
  };

  const currentAnkyverseDay = getCurrentAnkyverseDay();

  const getWritingByDay = (day) => {
    setChosenAnkyverseDay(day);
    const writing = allUserWritings.find((writing) => {
      const writingDay =
        Math.floor((writing.timestamp / 1000 - startTimestamp) / (24 * 3600)) +
        1;
      return writingDay === day;
    });
    setWritingForDisplay(writing);
  };

  const checkUserActivity = async () => {
    if (!thisUserWallet.address) return;
    const allUserWritingsResponse = await getThisUserWritings(
      thisUserWallet.address
    );
    setAllUserWritings(allUserWritingsResponse);
    const activity = {};
    const activeDaysSet = new Set();
    // Loop through each Ankyverse day up to the current day
    for (let day = 1; day <= currentAnkyverseDay; day++) {
      // By default, set the user's activity to false for that day
      activity[day] = false;
    }
    allUserWritings.forEach((writing) => {
      const day =
        Math.floor((writing.timestamp / 1000 - startTimestamp) / (24 * 3600)) +
        1;
      activity[day] = true;
      activeDaysSet.add(day);
    });
    setTotalNewenEarned(activeDaysSet.size * 7025);
    setUserActivity(activity);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(writingForDisplay.text);
      setTextCopied(true);
      setTimeout(() => {
        setTextCopied(false);
      }, 222);
    } catch (error) {
      console.log("there was an error copying the text");
    }
  };

  const copyJson = async (writing) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(writing));
      alert("copied, now send it as a DM to jp");
    } catch (error) {}
  };

  if (!authenticated)
    return (
      <div className="px-2 flex flex-col justify-center w-full items-center">
        <p>login please</p>
      </div>
    );
  return (
    <div className="h-full w-full flex flex-col items-center px-8 ">
      <div className="w-96 mx-auto">
        <p className="mb-2">
          if the information you see here is different than what you expect...
          just let go of that expectation
        </p>
        <p className="mb-2">
          there may be many errors, and that is part of the learning process of
          how to build this thing
        </p>
        <p className="mb-2">but don&apos;t forget to write</p>
        <p className="mb-2">that is the whole point. thank you.</p>
      </div>

      <div className="flex w-full justify-center mx-auto flex-wrap w-fit">
        {Array.from({ length: currentAnkyverseDay }, (_, i) => i + 1).map(
          (day) => {
            return (
              <div
                key={day}
                onClick={() => getWritingByDay(day)}
                className={`w-8 h-8 flex m-2 hover:bg-purple-400 hover:cursor-pointer justify-center flex-wrap items-center rounded-full ${
                  userActivity[day] ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {day}
              </div>
            );
          }
        )}
      </div>
      <p className="mt-3 text-center w-full">
        total $newen earned: {totalNewenEarned}
      </p>
      {chosenAnkyverseDay && (
        <div className="h-fit w-full md:w-96 mb-4 flex flex-col justify-start bg-purple-300 border border-black mt-2 rounded-xl  pt-4 items-center  px-2 pb-6">
          <p className="mb-2 underline text-xl">
            ankyverse day: {chosenAnkyverseDay}
          </p>
          <p className="mb-2 ">
            {chosenAnkyverseDay &&
              getAnkyverseQuestionForToday(chosenAnkyverseDay)[
                userSettings.language
              ]}
          </p>
          {writingForDisplay && (
            <div className="flex flex-col w-full bg-purple-200 px-4 rounded-xl items-center ">
              <div className="flex w-full mx-4 mt-2 flex-col px-2 py-2 h-96 overflow-y-scroll">
                {writingForDisplay.text ? (
                  writingForDisplay.text.includes("\n") ? (
                    writingForDisplay.text.split("\n").map((x, i) => (
                      <p className="my-2" key={i}>
                        {x}
                      </p>
                    ))
                  ) : (
                    <p className="my-2">{writingForDisplay.text}</p>
                  )
                ) : null}
              </div>
              <div className="flex mt-2 mb-2 active:translate-y-1">
                <button
                  onClick={copyText}
                  className={`border-solid py-2 ${
                    textCopied ? "bg-green-300" : "bg-purple-300"
                  } 00 px-8  shadow-xl border rounded-full`}
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardIndex;
