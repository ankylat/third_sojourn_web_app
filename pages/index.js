import "react-toastify/dist/ReactToastify.css";

// React Imports
import React, { useState, useEffect, useRef } from "react";

// Third Party Libraries
import axios from "axios";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { FaShareSquare } from "react-icons/fa";
import { WebIrys } from "@irys/sdk";

// Next Imports
import { IBM_Plex_Sans, Montserrat_Alternates } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

// Components
import Button from "../components/Button";
import Spinner from "../components/Spinner";

// App Contexts
import { useUser } from "../context/UserContext";
import { useSettings } from "../context/SettingsContext";

// Structural Components
import Footer from "../components/Footer";
import Instructions from "../components/sections/Instructions";
import InformationCards from "../components/sections/InformationCards";
import Welcome from "../components/sections/Welcome";

// Function imports
import { getUsersMentor } from "../lib/mentors";
import { getAnkyverseDay, encodeToAnkyverseLanguage } from "../lib/ankyverse";

// ********************************************************************

// State Variables

const secondsOfLife = 481;
const totalSessionDuration = 5;
const waitingTime = 30;
const ankyverseDay = getAnkyverseDay(new Date().getTime());
const startingTimestamp = 1711861200; // UNIX timestamp in seconds
const oneDayInSeconds = 86400; // 24 hours in seconds

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Component

const LandingPage = ({ isTextareaClicked, setIsTextareaClicked }) => {
  const { userSettings } = useSettings();
  const { setAllUserWritings, allUserWritings } = useUser();
  const { authenticated, ready, user, login } = usePrivy();
  const { wallets } = useWallets();
  const thisUserWallet = wallets.at(0);

  // User States
  const [usersMentor, setUsersMentor] = useState({});

  // Writing Session Management
  const [ankyverseQuestionToday, setAnkyverseQuestionToday] = useState("");
  const [todaysSessionData, setTodaysSessionData] = useState({
    sessionBrowserId: null,
    started: false,
    finished: false,
    won: false,
    savedOnIrys: false,
    startingTimestamp: null,
    endingTimestamp: null,
    text: "",
    cid: "",
    timeWritten: 0,
    ankyMentor: null,
  });
  const [whatUserWrote, setWhatUserWrote] = useState("");

  // Writing session states
  const [sessionRandomUUID, setSessionRandomUUID] = useState("");
  const [currentSessionStartingTime, setCurrentSessionStartingTime] =
    useState(null);
  const [text, setText] = useState("");
  const [time, setTime] = useState(0);
  const [lifeBarLength, setLifeBarLength] = useState(0);
  const [newenBarLength, setNewenBarLength] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [lastKeystroke, setLastKeystroke] = useState();

  // Layout State Management
  const [clockTime, setClockTime] = useState("00:00:00");
  const [textareaHidden, setTextareaHidden] = useState(false);
  const [finishedSession, setFinishedSession] = useState(false);
  const [savingSession, setSavingSession] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [notFixedAnymore, setNotFixedAnymore] = useState(true);
  const [alreadyStartedOnce, setAlreadyStartedOnce] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [moveText, setMoveText] = useState("");
  const [userLost, setUserLost] = useState(true);
  const [decodeAnkyverseCharacters, setDecodeAnkyverseCharacters] =
    useState(false);

  // useRef's

  const startingIntervalRef = useRef(null);
  const intervalRef = useRef(null);
  const startingTimeoutRef = useRef(null);

  useEffect(() => {
    setAnkyverseQuestionToday(ankyverseDay.prompt[userSettings.language]);
  }, [userSettings]);

  useEffect(() => {
    const updateClock = () => {
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      const elapsedTime = currentTime - startingTimestamp;
      const daysSinceStart = Math.floor(elapsedTime / oneDayInSeconds);
      const secondsToday = elapsedTime % oneDayInSeconds;
      const hours = Math.floor(secondsToday / 3600);
      const minutes = Math.floor((secondsToday % 3600) / 60);
      const seconds = secondsToday % 60;

      // Format time string as HH:MM:SS
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setClockTime(`${timeString}`);
    };

    // Update the clock every second
    const intervalId = setInterval(updateClock, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  // Initial App Setup
  useEffect(() => {
    const locallySavedSession = localStorage.getItem(
      `writingSession-${ankyverseDay.wink}`
    );

    if (locallySavedSession) {
      setTodaysSessionData(JSON.parse(locallySavedSession));
    }
    const todayWritingIndex = allUserWritings.findIndex(
      (writing) => writing.ankyverseDay == ankyverseDay.wink
    );
    const todayWriting = allUserWritings[todayWritingIndex];
    if (todayWriting) {
      todayWriting.savedOnIrys = true;
      todayWriting.finished = true;
      todayWriting.started = true;
      todayWriting.won = true;
      setTodaysSessionData(todayWriting);
    }
  }, [authenticated, allUserWritings]);

  // Writing App Functionality

  useEffect(() => {
    // state management for the 8 minute timer
    if (sessionStarted && !finishedSession) {
      intervalRef.current = setInterval(() => {
        setTime((time) => {
          const newTime = time + 1;
          const newenBarLength = (
            (newTime / totalSessionDuration) *
            100
          ).toFixed(2);
          if (totalSessionDuration - newTime == 360) {
            toast("6 minutes left");
          }
          if (totalSessionDuration - newTime == 240) {
            toast("4 minutes left");
          }
          if (totalSessionDuration - newTime == 120) {
            toast("2 minutes left");
          }
          if (totalSessionDuration - newTime == 30) {
            toast("30 seconds left!");
          }
          if (totalSessionDuration - newTime == 10) {
            toast("10 seconds left!");
          }
          if (totalSessionDuration - newTime == 0) {
            setUserLost(false);
            clearInterval(intervalRef?.current);
            setTextareaHidden(false);
            setFinishedSession(true);
            saveThisSession();
          }
          setNewenBarLength(Math.max(0, Math.max(0, newenBarLength)));
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [sessionStarted, time]);

  // For starting the session

  async function saveThisSession() {
    try {
      const now = new Date().getTime();
      const frontendWrittenTime = Math.floor(
        Math.abs(currentSessionStartingTime - now) / 1000
      );
      setTodaysSessionData((prev) => {
        const newData = {
          ...prev,
          endingTimestamp: now,
          timeWritten: frontendWrittenTime,
          text: text,
          finished: true,
          won: true,
        };
        localStorage.setItem(
          `writingSession-${ankyverseDay.wink}`,
          JSON.stringify(newData)
        );
        return newData;
      });
    } catch (error) {
      console.log("there was an error finishing this session");
    }
  }

  const handleClick = async () => {
    if (authenticated) {
      const provider = await thisUserWallet?.getEthersProvider();
      if (!provider)
        return alert(
          "your wallet is not recognized. please log out and log in again (yes, sorry about that)"
        );
    }
    setAlreadyStartedOnce(true);
    let now = new Date();
    const newRandomUUID = uuidv4();
    setSessionRandomUUID(newRandomUUID);
    setIsTextareaClicked(true);

    if (alreadyStartedOnce) {
      startWritingSession(newRandomUUID);
    } else {
      startingIntervalRef.current = setInterval(() => {
        setLifeBarLength((x) => {
          if (x >= 90) {
            setTextareaHidden(false);
            return clearInterval(startingIntervalRef.current);
          }
          return x + 100 / waitingTime;
        });
      }, 1000);
      startingTimeoutRef.current = setTimeout(() => {
        startWritingSession(newRandomUUID);
      }, waitingTime * 1000);
    }
  };

  const startWritingSession = async (thisNewRandomUUID) => {
    try {
      let now = new Date();
      setTextareaHidden(false);
      setLastKeystroke(now);
      setCurrentSessionStartingTime(now);
      setSessionStarted(true);
      setAlreadyStartedOnce(true);
      clearInterval(startingIntervalRef.current);

      setTodaysSessionData((prev) => {
        const newData = {
          ...prev,
          started: true,
          finished: false,
          savedOnIrys: false,
          sessionBrowserId: thisNewRandomUUID,
          startingTimestamp: now.getTime(),
          endingTimestamp: null,
          timeWritten: 0,
          text: "",
        };
        localStorage.setItem(
          `writingSession-${ankyverseDay.wink}`,
          JSON.stringify(newData)
        );
        return newData;
      });
      setSessionStarted(true);
    } catch (error) {
      console.log("there was an error starting the session", error);
    }
  };

  const getWebIrys = async () => {
    const url = "https://node2.irys.xyz";
    const token = "ethereum";

    const provider = await thisUserWallet?.getEthersProvider();
    if (!provider) throw new Error(`Cannot find privy wallet`);
    const irysWallet = { name: "privy", provider };

    const webIrys = new WebIrys({
      url: url,
      token: token,
      wallet: irysWallet,
    });

    await webIrys.ready();
    return webIrys;
  };

  async function saveSessionToIrys(writingSession) {
    try {
      console.log("the writing session is: ", writingSession, ankyverseDay);
      const tags = [
        { name: "Content-Type", value: "text/plain" },
        { name: "application-id", value: "Anky Third Sojourn - v0" },
        {
          name: "mentor-index",
          value: "200",
        },
        {
          name: "sojourn",
          value: ankyverseDay?.currentSojourn?.toString() || "3",
        },
        {
          name: "day",
          value: ankyverseDay.wink.toString(),
        },
        {
          name: "time-user-wrote",
          value: writingSession?.timeWritten?.toString(),
        },
        {
          name: "uuid",
          value: writingSession?.sessionBrowserId || "",
        },
      ];
      const webIrys = await getWebIrys();
      try {
        const receipt = await webIrys.upload(writingSession.text, { tags });

        return receipt.id;
      } catch (e) {
        console.log("Error uploading data ", e);
      }
    } catch (error) {
      console.log("there was a problem uploading to irys", error);
    }
  }

  const handleSaveSession = async () => {
    try {
      setNotFixedAnymore(false);
      setSavingSession(true);

      if (authenticated) {
        const receipt = await saveSessionToIrys(todaysSessionData);
        if (receipt) {
          setTodaysSessionData((prev) => {
            const newData = { ...prev, savedOnIrys: true, cid: receipt };
            localStorage.setItem(
              `writingSession-${ankyverseDay.wink}`,
              JSON.stringify(newData)
            );
            setAllUserWritings((prev) => {
              console.log("all the user writings ar HERe: ", prev);
              return [...prev, newData];
            });
            return newData;
          });
        }
      }
      setSavingSession(false);
      setSessionSaved(true);
    } catch (error) {
      console.log("there is an error here", error);
    }
  };
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text || todaysSessionData.text);
      setCopiedText(true);
      setTimeout(() => {
        setCopiedText(false);
      }, 444);
    } catch (error) {
      console.log("there was an error copying the text");
    }
  };

  async function handleShareSession() {
    try {
      if (!todaysSessionData?.cid)
        return toast.error(
          "you havent saved your session with your wallet yet"
        );
      console.log("in here");
      await navigator.clipboard.writeText(
        `https://www.anky.lat/r/${todaysSessionData.cid}`
      );
      toast.success("link copied", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log("there was an error copying the text");
    }
  }

  const handleTextChange = (e) => {
    try {
      setText(e.target.value);
      const now = Date.now();
      setLastKeystroke(now);
    } catch (error) {
      console.log("there was an error in the handle text change function");
    }
  };

  const startAllOverAgain = async () => {
    clearInterval(startingIntervalRef.current);
    clearInterval(intervalRef.current);
    setTextareaHidden(false);
    setAlreadyStartedOnce(false);
    setIsTextareaClicked(false);
    setSessionStarted(false);
    setNewenBarLength(0);
    setLifeBarLength(0);
    setTime(0);
    setFinishedSession(false);
  };

  const handleUserDistraction = () => {
    toast.warn("hey! come back. it is time to write.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    // Detect when the tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleUserDistraction();
      }
    };

    // Event listener for tab visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up event listener
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  if (
    authenticated &&
    todaysSessionData.started &&
    todaysSessionData.finished &&
    todaysSessionData.won
  ) {
    return (
      <div className="flex h-full  w-full flex-col items-center justify-center md:flex-row">
        <ToastContainer />
        <div className="h-96 md:h-full w-full md:w-fit px-8">
          <div className="flex w-full mx-auto py-4 px-2 rounded-xl space-y-2 flex-col items-center justify-between mt-8">
            <div className="flex flex-col items-center p-2 w-96">
              <h2
                className={`${ankyverseDay.color} mb-2 hover:opacity-60 text-xl`}
              >
                day {ankyverseDay.wink} · {ankyverseDay.kingdom.toLowerCase()} ·{" "}
                {clockTime}
              </h2>
              <div
                className={`${
                  copiedText && "bg-green-200"
                } rounded-xl w-full h-72 overflow-y-scroll mb-2`}
              >
                {todaysSessionData.text}
              </div>
              {todaysSessionData.savedOnIrys && todaysSessionData.cid ? (
                <div>
                  <div className="flex w-full justify-between">
                    <div
                      className="w-fit  mx-auto"
                      onClick={handleShareSession}
                    >
                      <button
                        className={`${montserratAlternates.className} border-solid  py-2 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full`}
                      >
                        <FaShareSquare />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full  justify-between">
                  <div className="w-fit  mx-auto" onClick={handleSaveSession}>
                    <button
                      className={`${montserratAlternates.className} border-solid  py-2 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full`}
                    >
                      {savingSession ? "sending..." : "send to the ankyverse"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        notFixedAnymore &&
        (sessionStarted || isTextareaClicked) &&
        "fixed top-0"
      } ${finishedSession && "pt-24"} w-full flex flex-col items-center`}
    >
      <section className="h-screen w-full" id="hero-section">
        {!finishedSession && (
          <>
            <div className="h-4 w-full overflow-hidden">
              <div
                className="h-full opacity-80 newen-bar rounded-r-xl"
                style={{
                  width: `${newenBarLength}%`,
                }}
              ></div>
            </div>
            <div className="h-1 w-full overflow-hidden">
              <div
                className="h-full opacity-80 life-bar rounded-r-xl"
                style={{
                  width: `${lifeBarLength}%`,
                }}
              ></div>
            </div>
          </>
        )}

        <ToastContainer />
        {finishedSession ? (
          <div
            className={`${
              isTextareaClicked ? "" : ""
            } w-full h-full pt-4 flex flex-col`}
          >
            <div className="h-full w-full">
              {!authenticated && (
                <div className="w-96 h-fit mx-auto p-2">
                  <p>congratulations, you finished your session.</p>
                  <p>if you own an anky mentor, you can log in, and save it.</p>
                  <p>
                    by doing this, you will participate on the writing of the
                    first collaborative book in the history of humanity.
                  </p>
                  <p>we need you</p>
                  <p>
                    for now, your writing will be saved locally on your browser.
                  </p>

                  <div className="w-fit mt-4 mx-auto">
                    <Button
                      buttonAction={login}
                      buttonText="login"
                      buttonColor="bg-green-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full grow">
            {isTextareaClicked ? (
              <div
                className={`${ibmPlexSans.className} ${
                  isTextareaClicked ? " w-7/8 xl:w-8/12 " : "w-3/4 xl:w-1/2 "
                } mx-auto h-fit py-3 md:py-4 mt-2 flex justify-center items-center px-8 bg-white text-gray-500 ${
                  textareaHidden ? "text-xl" : "text-sm"
                } md:text-2xl shadow-lg relative`}
              >
                {ankyverseQuestionToday}
                {!sessionStarted && (
                  <span
                    className="absolute text-red-600 hover:text-red-500 right-1 cursor-pointer top-1"
                    onClick={() => {
                      try {
                        startAllOverAgain();
                      } catch (error) {
                        console.log("there was an eeeerror", error);
                      }
                    }}
                  >
                    <MdCancel />
                  </span>
                )}
              </div>
            ) : (
              <div
                className={`${ibmPlexSans.className} w-3/4 lg:w-3/5 mx-auto`}
              >
                <h2 className="text-xl write-text mt-4">
                  Write for 8 minutes.
                </h2>
                <p className={`${montserratAlternates.className} cta `}>
                  This app is in BETA, and there may be errors. Hang on, we are
                  working to fix everything.
                </p>
                <Link passHref href="/ankyverse">
                  <h2
                    className={`${ankyverseDay.color} hover:opacity-60 text-xl`}
                  >
                    day {ankyverseDay.wink} ·{" "}
                    {ankyverseDay.kingdom.toLowerCase()} · {clockTime}
                  </h2>
                </Link>
              </div>
            )}

            {textareaHidden && (
              <div className="flex flex-col space-y-2">
                {!authenticated && (
                  <p className="my-3 text-2xl text-red-500 text-center">
                    heads up: you are not logged in
                  </p>
                )}
                <div className="w-fit mx-auto mt-4">
                  <Button
                    buttonText="start writing"
                    buttonAction={() => {
                      clearTimeout(startingTimeoutRef.current);
                      setLifeBarLength(100);
                      startWritingSession(sessionRandomUUID);
                    }}
                    buttonColor="bg-green-200"
                  />
                </div>
              </div>
            )}

            {!textareaHidden && (
              <div
                className={`${
                  isTextareaClicked ? "w-7/8 lg:w-8/12 " : "w-3/4 lg:w-3/5 "
                } mx-auto mt-4`}
              >
                <textarea
                  onClick={() => {
                    if (!sessionStarted) {
                      handleClick();
                      if (!alreadyStartedOnce) {
                        setTextareaHidden(true);
                      }
                    }
                  }}
                  onBlur={() => {
                    handleUserDistraction();
                  }}
                  style={{ fontStyle: "italic" }}
                  onChange={handleTextChange}
                  className={`${
                    montserratAlternates.className
                  }  w-full md:h-96 h-48 bg-white shadow-md ${
                    !isTextareaClicked &&
                    "hover:shadow-xl hover:shadow-pink-200"
                  } mx-auto placeholder:italic italic opacity-80 text-gray-400 italic border border-white p-3 cursor-pointer`}
                  placeholder={`${!ready ? "loading..." : "start writing..."}`}
                />
              </div>
            )}

            {!isTextareaClicked && (
              <div
                className={`${montserratAlternates.className} w-fit space-x-8 mx-auto text-center flex mt-8 `}
              >
                <Link
                  className="text-gray-400 hover:text-gray-500"
                  href="/terms-and-conditions"
                >
                  terms & conditions
                </Link>
                <a
                  className="text-gray-400 hover:text-gray-500"
                  href="https://t.me/ankytheape"
                  target="_blank"
                >
                  telegram
                </a>
              </div>
            )}
          </div>
        )}
      </section>
      <Welcome />
      <InformationCards />
      <Instructions ankyverseDay={ankyverseDay} />
      <Footer />
    </div>
  );
};

export default LandingPage;
