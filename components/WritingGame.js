import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import Button from "./Button";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ToastContainer, toast } from "react-toastify";
import { IBM_Plex_Sans, Montserrat_Alternates } from "next/font/google";
import { getAnkyverseDay } from "../lib/ankyverse";
import { getUsersMentor } from "../lib/mentors";
import { FaCopy, FaShareSquare } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { WebIrys } from "@irys/sdk";
import Link from "next/link";

import { useSettings } from "../context/SettingsContext";

const secondsOfLife = 8;
const totalSessionDuration = 480;
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

const WritingGame = ({ setDisplayWritingGame }) => {
  const router = useRouter();
  const { userSettings, gameSettings } = useSettings();
  const { userSessionInformation, appLoading } = useUser();
  const { authenticated, ready, user, login } = usePrivy();
  const { wallets } = useWallets();
  const thisUserWallet = wallets.at(0);

  // User States
  const [usersMentor, setUsersMentor] = useState({});
  const [isTextareaClicked, setIsTextareaClicked] = useState(true);

  // Writing Session Management
  const [thisSessionData, setThisSessionData] = useState({
    sessionBrowserId: null,
    sessionDatabaseId: null,
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
    ankyverseDay: gameSettings.ankyverseDay,
  });
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [whatUserWrote, setWhatUserWrote] = useState("");

  // Writing session states
  const [sessionRandomUUID, setSessionRandomUUID] = useState("");
  const [currentSessionStartingTime, setCurrentSessionStartingTime] =
    useState(null);
  const [text, setText] = useState("");
  const [clockTime, setClockTime] = useState("00:00:00");
  const [time, setTime] = useState(0);
  const [lifeBarLength, setLifeBarLength] = useState(0);
  const [newenBarLength, setNewenBarLength] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [lastKeystroke, setLastKeystroke] = useState();

  // Layout State Management
  const [textareaHidden, setTextareaHidden] = useState(true);
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
  const keystrokeIntervalRef = useRef(null);
  const textAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const startThisWritingSession = async () => {
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
    startThisWritingSession();
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      scrollToBottom();
    }
  }, [textAreaRef.current]);

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
    if (appLoading) return;
    setUsersMentor(getUsersMentor(userSessionInformation?.ankyMentorIndex));

    const locallySavedSession = localStorage.getItem(
      `writingSession-${ankyverseDay.wink}`
    );
    if (userSessionInformation?.formattedWriting) {
      setThisSessionData(userSessionInformation?.formattedWriting);
    } else if (locallySavedSession) {
      setThisSessionData(JSON.parse(locallySavedSession));
    }
  }, [appLoading]);

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
            setIsTimeOver(true);
            setUserLost(false);
            clearInterval(intervalRef?.current);
            clearInterval(keystrokeIntervalRef?.current);
            pingServerToEndWritingSession("won");
          }
          setNewenBarLength(Math.max(0, newenBarLength));
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [sessionStarted, time]);

  useEffect(() => {
    // state management for the 8 second timer trigger
    if (sessionStarted && !finishedSession) {
      keystrokeIntervalRef.current = setInterval(() => {
        const now = new Date().getTime();
        const elapsedTimeBetweenKeystrokes = Date.now() - lastKeystroke;
        if (elapsedTimeBetweenKeystrokes > secondsOfLife * 1000) {
          if (!isTimeOver) {
            pingServerToEndWritingSession("lost");
            clearInterval(keystrokeIntervalRef.current);
            setFinishedSession(true);
            const frontendWrittenTime = Math.floor(
              Math.abs(currentSessionStartingTime - now) / 1000
            );
            setThisSessionData((prev) => {
              const newData = {
                ...prev,
                endingTimestamp: now,
                timeWritten: frontendWrittenTime,
                text: text,
                finished: true,
              };
              localStorage.setItem(
                `writingSession-${ankyverseDay.wink}`,
                JSON.stringify(newData)
              );
              return newData;
            });
          }
        } else {
          const newLifeBarLength =
            100 - elapsedTimeBetweenKeystrokes / (10 * secondsOfLife);
          setLifeBarLength(Math.max(newLifeBarLength, 0));
        }
      }, 100);
    }
    return () => clearInterval(keystrokeIntervalRef.current);
  }, [sessionStarted, lastKeystroke]);

  // For starting the session

  const startWritingSession = async (thisNewRandomUUID) => {
    try {
      let now = new Date();
      setTextareaHidden(false);
      setLastKeystroke(now);
      setCurrentSessionStartingTime(now);
      setSessionStarted(true);
      setAlreadyStartedOnce(true);
      clearInterval(startingIntervalRef.current);
      let databaseSessionId;
      if (authenticated) {
        databaseSessionId = await pingServerToStartWritingSession();
      }

      setThisSessionData((prev) => {
        const newData = {
          ...prev,
          started: true,
          finished: false,
          savedOnIrys: false,
          sessionBrowserId: thisNewRandomUUID,
          startingTimestamp: now.getTime(),
          sessionDatabaseId: databaseSessionId,
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

  async function handleShareSession() {
    try {
      if (!thisSessionData?.cid)
        return toast.error(
          "you havent saved your session with your wallet yet"
        );

      await navigator.clipboard.writeText(
        `https://www.anky.lat/r/${thisSessionData.cid}`
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

  async function saveSessionToIrys(writingSession) {
    try {
      const tags = [
        { name: "Content-Type", value: "text/plain" },
        { name: "application-id", value: "Anky Third Sojourn - v0" },
        {
          name: "mentor-index",
          value: userSessionInformation?.ankyMentorIndex?.toString() || "222",
        },
        {
          name: "sojourn",
          value: ankyverseDay?.currentSojourn?.toString() || "3",
        },
        {
          name: "day",
          value: gameSettings.ankyverseDay.toString() || null,
        },
        {
          name: "prompt",
          value: gameSettings.prompt.toString() || null,
        },
        {
          name: "time-user-wrote",
          value: writingSession.timeWritten?.toString() || null,
        },
        {
          name: "uuid",
          value: writingSession.sessionBrowserId || "",
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

  async function pingServerToStartWritingSession() {
    try {
      let now = new Date();
      let response;
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/start-session`,
        {
          randomUUID: sessionRandomUUID,
          timestamp: now,
          userPrivyId: user.id.replace("did:privy:", ""),
          wallet: user.wallet.address,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userSessionInformation.privyAuthToken}`,
          },
        }
      );
      console.log(
        "the response from pinging the server to start the session is: ",
        response
      );

      return response.data.id;
    } catch (error) {
      console.log("there was an error requesting to ping the serve", error);
    }
    // start it even if the server was not pinged (for resiliency measurements)
    setSessionStarted(true);
  }

  async function pingServerToEndWritingSession(sessionOutcome) {
    try {
      const now = new Date().getTime();
      const frontendWrittenTime = Math.floor(
        Math.abs(currentSessionStartingTime - now) / 1000
      );
      setThisSessionData((prev) => {
        const newData = {
          ...prev,
          finished: true,
          won: sessionOutcome == "won" ? true : false,
          endingTimestamp: now,
          timeWritten: frontendWrittenTime,
          text: text,
        };
        localStorage.setItem(
          `writingSession-${ankyverseDay.wink}`,
          JSON.stringify(newData)
        );
        return newData;
      });

      let response;
      if (authenticated) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/end-session`,
          {
            timestamp: now,
            user: user?.id?.replace("did:privy:", ""),
            frontendWrittenTime,
            userWallet: user?.wallet?.address,
            text: text,
            result: sessionOutcome,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userSessionInformation.privyAuthToken}`,
            },
          }
        );
        console.log(
          "the response from calling the server to upload the session after it ending is: ",
          response
        );
      }
    } catch (error) {
      console.log("there was an error pinging the server here.", error);
    }
  }

  const handleSaveSession = async () => {
    try {
      if (isTimeOver) {
        const now = new Date().getTime();
        const frontendWrittenTime = Math.floor(
          Math.abs(currentSessionStartingTime - now) / 1000
        );
        setThisSessionData((prev) => {
          const newData = {
            ...prev,
            endingTimestamp: now,
            timeWritten: frontendWrittenTime,
            text: text,
            finished: true,
          };
          localStorage.setItem(
            `writingSession-${ankyverseDay.wink}`,
            JSON.stringify(newData)
          );
          return newData;
        });
      }
      setFinishedSession(true);
      setNotFixedAnymore(false);
      setSavingSession(true);

      if (authenticated) {
        const receipt = await saveSessionToIrys(thisSessionData);
        if (receipt) {
          setThisSessionData((prev) => {
            const newData = { ...prev, savedOnIrys: true, cid: receipt };
            localStorage.setItem(
              `writingSession-${ankyverseDay.wink}`,
              JSON.stringify(newData)
            );
            return newData;
          });

          let response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ROUTE}/save-cid`,
            {
              cid: receipt,
              sessionId: thisSessionData.sessionDatabaseId || "",
              user: user?.id?.replace("did:privy:", ""),
              userWallet: user?.wallet?.address,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userSessionInformation.privyAuthToken}`,
              },
            }
          );
          setFinishedSession(false);
          setIsTextareaClicked(false);
          // add the session to the user
          setDisplayWritingGame(false);
        }
      } else {
        setFinishedSession(false);
        setIsTextareaClicked(false);
      }
      setSavingSession(false);
      setSessionSaved(true);
      // TODOOOOOO
      alert("add this writing session to the user!");
      setDisplayWritingGame(false);
    } catch (error) {
      console.log("there is an error here", error);
      setDisplayWritingGame(false);
    }
  };
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text || whatUserWrote);
      setCopiedText(true);
      setTimeout(() => {
        setCopiedText(false);
      }, 444);
    } catch (error) {
      console.log("there was an error copying the text");
    }
  };

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
    clearInterval(keystrokeIntervalRef.current);
    setDisplayWritingGame(false);
    setNewenBarLength(0);
    setLifeBarLength(0);
    setTime(0);
    setText("");
    setFinishedSession(false);
  };
  return (
    <section className="h-screen w-full" id="hero-section">
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

      <ToastContainer />
      <div className="w-full grow">
        {isTextareaClicked && (
          <div
            className={`${ibmPlexSans.className} ${
              isTextareaClicked ? " w-7/8 xl:w-8/12 " : "w-3/4 xl:w-1/2 "
            } mx-auto h-fit py-3 md:py-4 mt-2 flex justify-center items-center px-8 bg-white text-gray-500 ${
              textareaHidden ? "text-xl" : "text-sm"
            } md:text-2xl shadow-lg relative`}
          >
            {gameSettings.prompt}
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
            } mx-auto relative mt-4`}
          >
            <textarea
              ref={textAreaRef}
              style={{
                fontStyle: "italic",
              }} // Set minimum height and allow growth
              onPaste={(e) => e.preventDefault()}
              disabled={finishedSession}
              onChange={handleTextChange}
              className={`${
                montserratAlternates.className
              }  w-full md:h-96 h-48 bg-white shadow-md ${
                !isTextareaClicked && "hover:shadow-xl hover:shadow-pink-200"
              } mx-auto placeholder:italic italic opacity-80 text-black italic border border-white p-3 cursor-pointer`}
              placeholder="start writing..."
            />
          </div>
        )}

        {finishedSession && userLost && (
          <div className="mt-4 absolute top-48">
            <div className="text-left bg-white finish-button w-3/4 md:w-3/5 mx-auto flex items-center">
              <span className="mr-8">
                <PiWarningCircle size={33} />{" "}
              </span>
              <span className="text-left text-black">
                You stopped writing for more than 8 seconds. This mechanism is
                intended for you to not think, just write. There is no right or
                wrong here.
              </span>
            </div>
            <div className="flex mx-auto w-96 space-x-2">
              <div className="w-fit mt-4 mx-auto" onClick={copyText}>
                <button
                  className={`${montserratAlternates.className} ${
                    copiedText && "bg-green-200"
                  } border-solid py-4 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full`}
                >
                  <FaCopy />
                </button>
              </div>
              <div
                onClick={() => {
                  setTime(0);
                  setText("");
                  setFinishedSession(false);
                  setNewenBarLength(0);
                  setLifeBarLength(100);
                  setSessionStarted(false);
                }}
                className="w-36 mx-auto mt-4 flex justify-center items-center border-solid text-center py-2 border-red-400 px-4 cursor-pointer hover:bg-gray-100 shadow-xl border rounded-full"
              >
                retry
              </div>
            </div>
          </div>
        )}

        {isTimeOver &&
          !thisSessionData?.savedOnIrys &&
          thisSessionData.started &&
          thisSessionData.won && (
            <div className="w-fit mt-4 mx-auto" onClick={handleSaveSession}>
              <button
                className={`${montserratAlternates.className} border-solid bg-green-400 py-2 border-black px-8 hover:bg-green-600 shadow-xl border rounded-xl`}
              >
                {savingSession ? "saving..." : "save session"}
              </button>
            </div>
          )}
      </div>
    </section>
  );
};

export default WritingGame;
