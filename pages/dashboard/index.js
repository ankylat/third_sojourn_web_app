import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Button from "../../components/Button";
import { FaCopy, FaShareFromSquare } from "react-icons/fa";

const DashboardIndex = () => {
  const { authenticated, login } = usePrivy();
  const [writingForDisplay, setWritingForDisplay] = useState(null);
  const [textCopied, setTextCopied] = useState(false);
  const [totalNewenEarned, setTotalNewenEarned] = useState(0);
  const [userMentor, setUserMentor] = useState({
    imageUrl: "/images/darkoh.png",
    name: "Darkoh",
  });
  const [userActivity, setUserActivity] = useState({});
  const { allUserWritings } = useUser();
  const startTimestamp = 1711861200;

  // Run the check when component mounts or writings change
  useEffect(() => {
    checkUserActivity();
  }, [allUserWritings]);

  // Calculate the current Ankyverse day
  const getCurrentAnkyverseDay = () => {
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    return (
      Math.floor((currentTimestampInSeconds - startTimestamp) / (24 * 3600)) + 1
    );
  };

  const currentAnkyverseDay = getCurrentAnkyverseDay();

  const getWritingByDay = (day) => {
    const writing = allUserWritings.find((writing) => {
      const writingDay =
        Math.floor((writing.timestamp / 1000 - startTimestamp) / (24 * 3600)) +
        1;
      return writingDay === day;
    });
    setWritingForDisplay(writing);
  };

  const checkUserActivity = () => {
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

  if (!authenticated)
    return (
      <div>
        <p>please login first</p>
        <div className="mt-4 w-fit">
          <Button
            buttonAction={login}
            buttonColor="bg-purple-300"
            buttonText="login"
          />
        </div>
      </div>
    );
  return (
    <div className="h-full w-full flex flex-col items-center px-8 ">
      <div className="flex w-full justify-center mx-auto w-fit">
        {Array.from({ length: currentAnkyverseDay }, (_, i) => i + 1).map(
          (day) => {
            return (
              <div
                key={day}
                onClick={() => getWritingByDay(day)}
                className={`w-8 h-8 flex mx-2 hover:bg-purple-400 hover:cursor-pointer justify-center items-center rounded-full ${
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

      <div className="h-full w-full flex flex-col justify-center items-center md:flex-row px-2 pb-4">
        {writingForDisplay && (
          <div className="flex flex-col w-full items-center md:w-96">
            <div className="flex w-full mx-4 mt-2 flex-col px-4 py-2 bg-purple-200 rounded-xl h-96 overflow-y-scroll">
              <p className="">
                ankyverse day: {writingForDisplay.ankyverseDay}
              </p>
              <hr className="my-2" />
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
            <div className="flex mt-2">
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
    </div>
  );
};

export default DashboardIndex;
