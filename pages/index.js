import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import DesktopWritingGame from "../components/DesktopWritingGame";
import { setUserData, getUserData } from "../lib/idbHelper";
import { v4 as uuidv4 } from "uuid";
import { getAnkyverseDay, getAnkyverseQuestion } from "../lib/ankyverse";
import { PiWarningCircle } from "react-icons/pi";
import { WebIrys } from "@irys/sdk";
import { IBM_Plex_Sans, Montserrat_Alternates } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import Button from "../components/Button";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const getLastSevenDays = () => {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const lastSevenDays = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    lastSevenDays.push(days[day.getDay()]);
  }
  return lastSevenDays;
};

const secondsOfLife = 8;
const totalSessionDuration = 16;

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const LandingPage = ({
  displayWritingGameLanding,
  setDisplayWritingGameLanding,
  setLifeBarLength,
  lifeBarLength,
  setNewenBarLength,
  newenBarLength,
  isTextareaClicked,
  setIsTextareaClicked,
}) => {
  const [text, setText] = useState("");
  const [time, setTime] = useState(0);
  const [moveText, setMoveText] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionRandomUUID, setSessionRandomUUID] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [copyWritingText, setCopyWritingText] = useState("copy text");
  const [userStreak, setUserStreak] = useState(1);
  const [ankyverseDay, setAnkyverseDay] = useState({});
  const [ankyverseQuestion, setAnkyverseQuestion] = useState("");
  const [savingSession, setSavingSession] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [lastKeystroke, setLastKeystroke] = useState();
  const [userLost, setUserLost] = useState(true);
  const [finishedSession, setFinishedSession] = useState(false);
  const { wallets } = useWallets();
  const {
    sendTransaction,
    login,
    authenticated,
    logout,
    getAccessToken,
    user,
  } = usePrivy();
  const w = wallets.at(0);

  const textareaRef = useRef(null);
  const intervalRef = useRef(null);
  const keystrokeIntervalRef = useRef(null);

  useEffect(() => {
    const respo = getAnkyverseDay(new Date());
    setAnkyverseDay(respo);
    const questionOfToday = getAnkyverseQuestion(respo.wink);
    setAnkyverseQuestion(questionOfToday);
  }, []);

  useEffect(() => {
    if (sessionStarted && !finishedSession) {
      intervalRef.current = setInterval(() => {
        setTime((time) => {
          const newTime = time + 1;
          const newenLength = ((newTime / totalSessionDuration) * 100).toFixed(
            2
          );
          setNewenBarLength(Math.max(0, Math.max(0, newenLength)));

          return newTime;
        });
        if (time > totalSessionDuration) {
          setIsTextareaClicked(false);
          setUserLost(false);
          setFinishedSession(true);
          pingServerToEndWritingSession();
          clearInterval(intervalRef.current);
          clearInterval(keystrokeIntervalRef.current);
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [sessionStarted, time]);

  useEffect(() => {
    if (sessionStarted && !finishedSession) {
      keystrokeIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - lastKeystroke;
        if (elapsedTime > secondsOfLife * 1000) {
          clearInterval(keystrokeIntervalRef.current);
          setFinishedSession(true);
        } else {
          // const newLifeBarLength = 100 - elapsedTime / (10 * secondsOfLife);
          // setLifeBarLength(Math.max(newLifeBarLength, 0)); // do not allow negative values
        }
      }, 88);
    }
    return () => clearInterval(keystrokeIntervalRef.current);
  }, [sessionStarted, lastKeystroke]);

  const { userDatabaseInformation } = useUser();

  const handleClick = () => {
    setIsTextareaClicked(true);
    if (authenticated) {
      pingServerToStartWritingSession();
    }
    let now = new Date();
    setLastKeystroke(now);
    setStartTime(now);
    setSessionStarted(true);
  };

  const getWebIrys = async () => {
    const url = "https://node2.irys.xyz";
    const token = "ethereum";

    const provider = await w?.getEthersProvider();
    if (!provider) throw new Error(`Cannot find privy wallet`);
    const irysWallet =
      w?.walletClientType === "privy"
        ? { name: "privy-embedded", provider, sendTransaction }
        : { name: "privy", provider };

    const webIrys = new WebIrys({
      url: url,
      token: token,
      wallet: irysWallet,
    });

    await webIrys.ready();
    return webIrys;
  };

  async function sendTextToIrys() {
    try {
      const tags = [
        { name: "Content-Type", value: "text/plain" },
        { name: "application-id", value: "Anky Third Sojourn - v0" },
        {
          name: "mentor-index",
          value: userDatabaseInformation.ankyMentorIndex.toString() || null,
        },
        {
          name: "sojourn",
          value: ankyverseDay?.currentSojourn?.toString() || "2",
        },
        { name: "day", value: ankyverseDay?.wink?.toString() || "0" },
        { name: "time-user-wrote", value: time.toString() },
        {
          name: "uuid",
          value: sessionRandomUUID,
        },
      ];
      const webIrys = await getWebIrys();
      try {
        const receipt = await webIrys.upload(text, { tags });
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
      if (sessionRandomUUID) return;
      let now = new Date();
      let response;
      const newRandomUUID = uuidv4();
      setSessionRandomUUID(newRandomUUID);
      if (authenticated) {
        const authToken = await getAccessToken();
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/start-session`,
          {
            randomUUID: newRandomUUID,
            timestamp: now,
            userPrivyId: user.id.replace("did:privy:", ""),
            wallet: user.wallet.address,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(
          "the repsonse from the pinging of the server is: ",
          response.data
        );
        setSessionId(response.data.id);
        setSessionStarted(true);
      }
    } catch (error) {
      console.log("there was an error requesting to ping the serve", error);
    }
  }

  async function pingServerToEndWritingSession() {
    try {
      let response;
      if (authenticated) {
        const authToken = await getAccessToken();
        const now = new Date().getTime();
        const frontendWrittenTime = Math.floor(
          Math.abs(startTime - now) / 1000
        );
        console.log("the frontend written time is: ", frontendWrittenTime);
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/end-session`,
          {
            timestamp: now,
            user: user.id.replace("did:privy:", ""),
            frontendWrittenTime,
            userWallet: user.wallet.address,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      }
      console.log("the response after finishing the session is: ", response);
      setFinishedSession(true);
      return {
        manaBalance: response?.data?.data?.manaBalance || 0,
        streak: response?.data?.data?.activeStreak || userStreak,
      };
    } catch (error) {
      console.log("there was an error pinging the server here.", error);
    }
  }

  const finishSession = async () => {
    try {
      const finishTimestamp = Date.now();
      const frontendWrittenTime = Math.floor(
        (finishTimestamp - startTime) / 1000
      );
      if (authenticated) {
        pingServerToEndWritingSession(finishTimestamp, frontendWrittenTime);
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  };

  const handleSaveSession = async () => {
    try {
      setSavingSession(true);
      localStorage.setItem(
        `session - ${sessionRandomUUID}`,
        JSON.stringify({
          timestamp: new Date().getTime(),
          text: text,
          duration: time,
        })
      );
      if (authenticated) {
        const receipt = await sendTextToIrys();
        const authToken = await getAccessToken();
        let response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/save-cid`,
          {
            cid: receipt,
            sessionId: sessionId,
            user: user.id.replace("did:privy:", ""),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log("the response from saving the cid is: ", response);
      }
      setSavingSession(false);
      setSessionSaved(true);
    } catch (error) {
      console.log("there is an error here", error);
    }
  };
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyWritingText("copied");
      setTimeout(() => {
        setCopyWritingText("copy text");
      }, 2222);
    } catch (error) {
      console.log("there was an error copying the text");
    }
  };

  const copyTodaysText = async () => {
    try {
      await navigator.clipboard.writeText(userDatabaseInformation.todayWriting);
      setCopyWritingText("copied");
      setTimeout(() => {
        setCopyWritingText("copy text");
      }, 2222);
    } catch (error) {}
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

  if (userDatabaseInformation.wroteToday) {
    return (
      <div className="w-full h-screen flex flex-col items-center pt-4 text-left">
        <div className="w-full h-full md:w-1/2 p-2">
          <h2 className="text-xl md:text-3xl">
            sojourn #{ankyverseDay.currentSojourn} · wink {ankyverseDay.wink}
          </h2>
          <small className="text-lg">{ankyverseDay.currentKingdom}</small>
          <p className="text-purple-600">{ankyverseQuestion}</p>
          <div
            onClick={() => {
              setMoveText(true);
              setTimeout(() => {
                setMoveText(false);
              }, 888);
              copyTodaysText();
            }}
            className={`${moveText && " translate-x-2 tranlate-y-2"}
               grow overflow-y-scroll mt-3 hover:text-shadow-lg hover:text-purple-800 cursor-pointer 
            } `}
          >
            {userDatabaseInformation.todayWriting ? (
              userDatabaseInformation.todayWriting.includes("\n") ? (
                userDatabaseInformation.todayWriting.split("\n").map((x, i) => (
                  <p className="my-2" key={i}>
                    {x}
                  </p>
                ))
              ) : (
                <p className="my-2">{userDatabaseInformation.todayWriting}</p>
              )
            ) : null}
            {moveText && <p className="text-red-600 mt-8">copied</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="h-8 w-full pr-12 overflow-hidden">
        <div
          className="h-full opacity-80 newen-bar rounded-r-xl"
          style={{
            width: `${newenBarLength}%`,
          }}
        ></div>
      </div>
      {finishedSession ? (
        <div
          className={`${
            isTextareaClicked ? "" : ""
          } w-full grow pt-4 flex flex-col`}
        >
          {userLost ? (
            <div className="">
              <div className="text-left bg-white finish-button w-3/4 md:w-3/5 mx-auto flex items-center">
                <span className="mr-8">
                  <PiWarningCircle size={33} />{" "}
                </span>
                <span className="text-left text-black">
                  You stopped writing for more than 8 seconds.
                </span>
              </div>
              <div
                onClick={() => {
                  setFinishedSession(false);
                  setNewenBarLength(0);
                  setSessionStarted(false);
                  setTime(0);
                }}
                className="w-36 mx-auto mt-4 border-solid text-center py-2 border-red-400 px-4 cursor-pointer hover:bg-gray-100 shadow-xl border rounded-full"
              >
                retry
              </div>
            </div>
          ) : (
            <div>
              {sessionSaved ? (
                <div className="text-left bg-white rounded-xl shadow-lg px-3 py-8 w-80 rounded-xl h-fit mx-auto flex flex-col justify-between  items-center">
                  <span className="w-24 h-24 relative">
                    <Image src="/images/Icon_copy_2.svg" fill />
                  </span>
                  <div className="py-2 w-full px-4 h-20 rounded-xl py-4 shadow-xl my-4 flex justify-center items-center">
                    <span className="mx-2">1</span>
                    <span className="">streak</span>
                  </div>
                  <div className="flex flex-col mb-4 rounded-xl py-2  border border-black">
                    <div>
                      <p className="wrap  text-md text-center">
                        congratulations. the scariest moment of writing is
                        always before you start.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center w-full ">
                    <span className="border-solid  py-2 border-red-400 px-4 cursor-pointer hover:bg-gray-100 shadow-xl border rounded-full">
                      <a
                        href="https://www.paragraph.xyz/@ankytheape"
                        target="_blank"
                      >
                        read book
                      </a>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-left bg-white rounded-xl shadow-lg px-8 py-8 w-80 rounded-xl h-fit mx-auto flex flex-col justify-between items-center">
                  <span className="w-24 h-24 relative">
                    <Image src="/images/Icon_copy_2.svg" fill />
                  </span>
                  <div className="flex w-full  space-y-2 flex-col justify-between mt-8">
                    <div className="p-2 w-full px-4 h-20 rounded-xl py-4 border border-black flex items-center">
                      <div className="w-1/4 flex flex-col items-center">
                        <div className="w-6 mb-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="w-6 mb-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="w-6 mb-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="w-6 mb-1 h-1 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="w-3/4 text-center">
                        <span className="mx-2">{text.split(" ").length}</span>
                        <span className="">words</span>
                      </div>
                    </div>
                    <div className="p-2 w-full px-4 h-20 rounded-xl py-4 border border-black flex items-center">
                      <div className="w-1/4 aspect-square flex flex-col items-center relative">
                        <Image src="/images/newen.svg" fill />
                      </div>
                      <div className="w-3/4 text-center">
                        <span>{authenticated ? "+7025" : "0"} </span>
                        <span>$newen</span>
                      </div>
                    </div>
                    <div className="p-2 w-full px-4 h-20 rounded-xl py-4 border border-black flex items-center">
                      <div className="w-1/4 aspect-square flex flex-col items-center relative">
                        <Image src="/images/Icon_copy_3.svg" fill />
                      </div>
                      <div className="w-3/4 text-center">
                        <span className="mx-2">1</span>
                        <span className="">streak</span>
                      </div>
                    </div>
                    <div className="w-fit mt-4 mx-auto">
                      <button
                        className={`${montserratAlternates.className} border-solid  py-2 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full`}
                        onClick={handleSaveSession}
                      >
                        {savingSession ? "saving..." : "save session"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div></div>
        </div>
      ) : (
        <div className="w-full grow p-2">
          {isTextareaClicked ? (
            <div
              className={`${ibmPlexSans.className} ${
                isTextareaClicked ? " w-7/8 xl:w-8/12 " : "w-3/4 xl:w-1/2 "
              } mx-auto h-16 mt-2 flex justify-center items-center px-8 bg-white text-gray-500 text-xl md:text-3xl shadow-lg`}
            >
              What happens when we dream?
            </div>
          ) : (
            <div className={`${ibmPlexSans.className} w-3/4 lg:w-3/5 mx-auto`}>
              <h2 className="text-xl write-text mt-4">Write for 8 minutes.</h2>
              <p className={`${montserratAlternates.className} cta `}>
                Click directly on the box & write about the day theme.
              </p>
            </div>
          )}

          <div
            className={`${
              isTextareaClicked ? "w-7/8 lg:w-8/12 " : "w-3/4 lg:w-3/5 "
            } mx-auto mt-4`}
          >
            <textarea
              onClick={() => {
                if (!sessionStarted) {
                  handleClick();
                }
              }}
              style={{ fontStyle: "italic" }}
              onChange={handleTextChange}
              className={`${
                montserratAlternates.className
              }  w-full md:h-96 h-48 bg-white shadow-md ${
                !isTextareaClicked && "hover:shadow-xl hover:shadow-pink-200"
              } mx-auto placeholder:italic italic opacity-80 text-gray-400 italic border border-white p-3 cursor-pointer`}
              placeholder="start typing..."
            />
          </div>

          {!isTextareaClicked && (
            <div
              className={`${montserratAlternates.className} w-fit space-x-8 mx-auto text-gray-400 text-center flex mt-8 hover:text-gray-500`}
            >
              <Link href="/terms-and-conditions">terms & conditions</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
