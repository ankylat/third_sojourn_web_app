import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useUser } from "../../context/UserContext";
import { useSettings } from "../../context/SettingsContext";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { FaShareSquare } from "react-icons/fa";
import { getAnkyverseQuestionForToday } from "../../lib/ankyverse";
import Image from "next/image";
import Button from "../../components/Button";
import { getThisUserWritings } from "../../lib/irys";
import { FaCopy } from "react-icons/fa";
import Spinner from "../../components/Spinner";

const DashboardIndex = ({ setDisplayWritingGame }) => {
  const { authenticated, login, ready } = usePrivy();
  const [allUserWritings, setAllUserWritings] = useState([]);
  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [writingForDisplay, setWritingForDisplay] = useState(null);
  const [textCopied, setTextCopied] = useState(false);
  const [chosenAnkyverseDay, setChosenAnkyverseDay] = useState(null);
  const [totalNewenEarned, setTotalNewenEarned] = useState(0);
  const [userMentor, setUserMentor] = useState({
    imageUrl: "/images/darkoh.png",
    name: "Darkoh",
  });
  const [userActivity, setUserActivity] = useState({});
  const { userSettings, setGameSettings } = useSettings();
  const { wallets } = useWallets();
  const thisUserWallet = wallets.at(0);

  const startTimestamp = 1711861200;

  function sortWritings(a, b) {
    const timestampA = a.timestamp;
    const timestampB = b.timestamp;
    return timestampB - timestampA;
  }

  useEffect(() => {
    if (authenticated && ready) {
      async function getAllUserWritings() {
        if (!thisUserWallet) return;
        if (!authenticated) return;
        const writings = await getThisUserWritings(thisUserWallet.address);
        console.log("the wriiiitings are: ", writings);
        const sortedWritings = writings.sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setAllUserWritings(sortedWritings);
        const activity = {};
        sortedWritings.forEach((writing) => {
          console.log("in heeere", writing);
          if (writing.storedDay == writing.calculatedDay) {
            activity[writing.storedDay] = "green";
          } else if (writing.storedDay < writing.calculatedDay) {
            activity[writing.storedDay] = "purple"; // Store the color (green or purple)
          }
        });
        setUserActivity(activity);
        setLoading(false);
      }
      getAllUserWritings();
    }
  }, [authenticated, ready]);

  useEffect(() => {
    const loadWritings = () => {
      let allWritings = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("session - ")) {
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
      return writing.storedDay === day;
    });
    setWritingForDisplay(writing);
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

  async function handleShareSession() {
    try {
      setLinkCopied(true);
      await navigator.clipboard.writeText(
        `https://www.anky.lat/r/${writingForDisplay.cid}`
      );
      toast.success("link copied", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        setLinkCopied(false);
      }, 1000);
    } catch (error) {
      console.log("there was an error copying the text", error);
    }
  }

  if (!authenticated)
    return (
      <div className="px-2 flex flex-col justify-center w-full items-center">
        <p>login please</p>
      </div>
    );
  if (loading)
    return (
      <div className="px-2 flex flex-col justify-center w-full items-center">
        <Spinner />
      </div>
    );
  return (
    <div className=" w-full">
      <ToastContainer />
      <div className="w-full flex flex-col md:flex-row">
        <div className="flex-none flex w-full md:w-96 md:mx-12 h-fit  justify-center  flex-wrap ">
          {Array.from({ length: currentAnkyverseDay }, (_, i) => i + 1).map(
            (day) => {
              return (
                <div
                  key={day}
                  onClick={() => getWritingByDay(day)}
                  className={`${
                    chosenAnkyverseDay == day && "border-black border-2"
                  } w-8 h-8 flex m-2 hover:bg-purple-400 hover:cursor-pointer justify-center flex-wrap items-center rounded-full ${
                    userActivity[day] === "green"
                      ? "bg-green-500"
                      : userActivity[day] === "purple"
                      ? "bg-purple-500"
                      : "bg-red-500"
                  }`}
                >
                  {day}
                </div>
              );
            }
          )}
        </div>
        <div className="px-4 grow">
          {chosenAnkyverseDay && (
            <div className="h-fit w-full mb-4 mx-auto flex flex-col justify-center mt-2 rounded-xl pt-4 items-center  px-2 pb-6">
              <p className="mb-2 underline text-xl">
                ankyverse day: {chosenAnkyverseDay}
              </p>
              {!writingForDisplay ? (
                <div>
                  <Button
                    buttonText="answer this one"
                    buttonAction={() => {
                      setGameSettings({
                        prompt:
                          getAnkyverseQuestionForToday(chosenAnkyverseDay)[
                            userSettings.language
                          ],
                        ankyverseDay: chosenAnkyverseDay,
                      });
                      setDisplayWritingGame(true);
                    }}
                    buttonColor="bg-green-200"
                  />
                </div>
              ) : (
                <div className="w-full">
                  <p className="mb-2 italic w-full md:w-1/2 text-blue-600">
                    {chosenAnkyverseDay &&
                      getAnkyverseQuestionForToday(chosenAnkyverseDay)[
                        userSettings.language
                      ]}
                  </p>
                  {writingForDisplay && (
                    <div className="flex flex-col w-full rounded-xl items-center ">
                      <p className="text-left w-full text-xl">
                        {moment(writingForDisplay.timestamp).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </p>
                      <div className="flex w-full mx-4 flex-col  py-2 h-fit overflow-y-scroll">
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
                      <div>
                        <div className="flex w-full justify-between">
                          <div
                            className="w-fit  mx-auto"
                            onClick={handleShareSession}
                          >
                            <button
                              className={`${
                                linkCopied && "bg-purple-200"
                              } border-solid py-2 border-red-400 px-8 hover:bg-gray-100 active:bg-purple-200 active:translate-y-1 shadow-xl border rounded-full`}
                            >
                              <FaShareSquare />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;
