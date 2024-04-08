import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { getAnkyverseDay, getAnkyverseQuestion } from "../lib/ankyverse";
import { PiWarningCircle } from "react-icons/pi";
import { FiPenTool } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";
import { WebIrys } from "@irys/sdk";
import { IBM_Plex_Sans, Montserrat_Alternates } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { FaCopy } from "react-icons/fa";
import Button from "../components/Button";
import { useSettings } from "../context/SettingsContext";
import TextStreamer from "../components/TextStreamer";

const secondsOfLife = 12;
const totalSessionDuration = 480;
const waitingTime = 30;
const ankyverseDay = getAnkyverseDay(new Date().getTime());

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const LandingPage = ({ isTextareaClicked, setIsTextareaClicked }) => {
  const [text, setText] = useState("");
  const [time, setTime] = useState(0);
  const [lifeBarLength, setLifeBarLength] = useState(0);
  const [newenBarLength, setNewenBarLength] = useState(0);
  const [moveText, setMoveText] = useState("");
  const [alreadyStartedOnce, setAlreadyStartedOnce] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionRandomUUID, setSessionRandomUUID] = useState("");
  const { userSettings } = useSettings();
  const [privyAuthToken, setPrivyAuthToken] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [textareaHidden, setTextareaHidden] = useState(false);
  const [errorUploadingToIrys, setErrorUploadingToIrys] = useState(false);
  const [copyWritingText, setCopyWritingText] = useState("copy text");
  const [userStreak, setUserStreak] = useState(1);
  const [ankyverseQuestion, setAnkyverseQuestion] = useState("");
  const [savingSession, setSavingSession] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [lastKeystroke, setLastKeystroke] = useState();
  const [userLost, setUserLost] = useState(true);
  const [finishedSession, setFinishedSession] = useState(false);
  const { wallets } = useWallets();
  const { authenticated, getAccessToken, ready, user } = usePrivy();
  const thisUserWallet = wallets.at(0);

  const textareaRef = useRef(null);
  const intervalRef = useRef(null);
  const keystrokeIntervalRef = useRef(null);

  useEffect(() => {
    setAnkyverseQuestion(ankyverseDay.prompt[userSettings.language]);
  }, [userSettings.language]);

  useEffect(() => {
    if (sessionStarted && !finishedSession) {
      intervalRef.current = setInterval(() => {
        setTime((time) => {
          const newTime = time + 1;
          const newenBarLength = (
            (newTime / totalSessionDuration) *
            100
          ).toFixed(2);
          if (totalSessionDuration - newTime == 30) {
            toast("30 seconds left!");
          }
          if (totalSessionDuration - newTime == 10) {
            toast("10 seconds left!");
          }
          if (totalSessionDuration - newTime == 0) {
            clearInterval(keystrokeIntervalRef.current);
            setIsTextareaClicked(false);
            setUserLost(false);
            clearInterval(intervalRef.current);
            clearInterval(keystrokeIntervalRef.current);
            setFinishedSession(true);
            pingServerToEndWritingSession("won");
          }
          setNewenBarLength(Math.max(0, Math.max(0, newenBarLength)));
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [sessionStarted, time]);

  useEffect(() => {
    if (sessionStarted && !finishedSession) {
      keystrokeIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - lastKeystroke;
        if (elapsedTime > secondsOfLife * 1000) {
          pingServerToEndWritingSession("lost");
          clearInterval(keystrokeIntervalRef.current);
          setFinishedSession(true);
        } else {
          const newLifeBarLength = 100 - elapsedTime / (10 * secondsOfLife);
          setLifeBarLength(Math.max(newLifeBarLength, 0)); // do not allow negative values
        }
      }, 88);
    }
    return () => clearInterval(keystrokeIntervalRef.current);
  }, [sessionStarted, lastKeystroke]);

  const { userDatabaseInformation, appLoading } = useUser();

  const handleClick = async () => {
    const provider = await thisUserWallet?.getEthersProvider();
    if (!provider)
      return alert(
        "your wallet is not recognized. please log out and log in again (yes, sorry about that)"
      );
    setIsTextareaClicked(true);
    if (alreadyStartedOnce) {
      setLifeBarLength(100);
      if (authenticated) {
        pingServerToStartWritingSession();
      }
      let now = new Date();
      setLastKeystroke(now);
      setStartTime(now);
      setSessionStarted(true);
    } else {
      const startingInterval = setInterval(() => {
        setLifeBarLength((x) => {
          if (x >= 90) {
            setTextareaHidden(false);
            return clearInterval(startingInterval);
          }
          return x + 100 / waitingTime;
        });
      }, 1000);
      setTimeout(() => {
        if (authenticated) {
          pingServerToStartWritingSession();
        }
        let now = new Date();
        setLastKeystroke(now);
        setStartTime(now);
        setSessionStarted(true);
      }, waitingTime * 1000);
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

  async function sendTextToIrys() {
    try {
      const tags = [
        { name: "Content-Type", value: "text/plain" },
        { name: "application-id", value: "Anky Third Sojourn - v0" },
        {
          name: "mentor-index",
          value: userDatabaseInformation?.ankyMentorIndex?.toString() || null,
        },
        {
          name: "sojourn",
          value: ankyverseDay?.currentSojourn?.toString() || "3",
        },
        {
          name: "day",
          value: ankyverseDay.wink.toString(),
        },
        { name: "time-user-wrote", value: time?.toString() },
        {
          name: "uuid",
          value: sessionRandomUUID || "",
        },
      ];
      const webIrys = await getWebIrys();
      try {
        const receipt = await webIrys.upload(text, { tags });

        return receipt.id;
      } catch (e) {
        // setErrorUploadingToIrys(true);
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
        setPrivyAuthToken(authToken);
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
        setSessionId(response.data.id);
        setSessionStarted(true);
      }
    } catch (error) {
      console.log("there was an error requesting to ping the serve", error);
    }
  }

  async function pingServerToEndWritingSession(result) {
    try {
      let response;
      if (authenticated) {
        const now = new Date().getTime();
        const frontendWrittenTime = Math.floor(
          Math.abs(startTime - now) / 1000
        );
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/end-session`,
          {
            timestamp: now,
            user: user.id.replace("did:privy:", ""),
            frontendWrittenTime,
            userWallet: user.wallet.address,
            text: text,
            result: result,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${privyAuthToken}`,
            },
          }
        );
      }
      setFinishedSession(true);
      return {
        manaBalance: response?.data?.data?.manaBalance || 0,
        streak: response?.data?.data?.activeStreak || userStreak,
      };
    } catch (error) {
      console.log("there was an error pinging the server here.", error);
    }
  }

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
        let response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/save-cid`,
          {
            cid: receipt,
            sessionId: sessionId || "",
            user: user.id.replace("did:privy:", ""),
            userWallet: user.wallet.address,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${privyAuthToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.log("there is an error here", error);
    }
    setSavingSession(false);
    setSessionSaved(true);
  };
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("copied");
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
            sojourn #3 · wink {ankyverseDay.wink} · {ankyverseDay.kingdom}
          </h2>
          <small className="text-lg text-orange-500">
            {ankyverseDay.kingdom}
          </small>
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
               grow overflow-y-scroll mt-3 hover:text-shadow-lg pb-8 hover:text-purple-800 cursor-pointer 
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
    <div className="w-full flex flex-col items-center">
      <section className="h-screen w-full" id="hero-section">
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
        <ToastContainer />
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
                    You stopped writing for more than 12 seconds. This mechanism
                    is intended for you to not think, just write. There is no
                    right or wrong here.
                  </span>
                </div>
                <div className="flex mx-auto w-96 space-x-2">
                  <div className="w-fit mt-4 mx-auto" onClick={copyText}>
                    <button
                      className={`${montserratAlternates.className} border-solid py-2 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full`}
                    >
                      <FaCopy />
                    </button>
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
              </div>
            ) : (
              <div>
                {sessionSaved ? (
                  <div className="text-left bg-white rounded-xl shadow-lg px-3 py-8 w-80 rounded-xl h-fit mx-auto flex flex-col justify-between  items-center">
                    <span className="w-24 h-24 relative">
                      <Image src="/images/Icon_copy_2.svg" fill />
                    </span>
                    <div className="py-2 w-full px-4 h-20 rounded-xl py-4 shadow-xl my-4 flex justify-center items-center">
                      <span className="mx-2">day {ankyverseDay.wink}</span>
                      <span className="">ready</span>
                    </div>
                    <div className="flex flex-col mb-4 rounded-xl py-2  border border-black">
                      <div>
                        <p className="wrap p-2 text-md text-center">
                          congratulations. the invitation is to remain in the
                          awareness of this prompt, and your connection with
                          your true self.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center w-full ">
                      <a
                        href={`https://paragraph.xyz/@ankytheape/chapter-${
                          ankyverseDay.wink - 2
                        }`}
                        target="_blank"
                      >
                        <span className="border-solid  py-2 border-red-400 px-4 cursor-pointer hover:bg-gray-100 shadow-xl border rounded-full">
                          read chapter {ankyverseDay.wink - 2}
                        </span>
                      </a>
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

                      <div className="flex">
                        <div className="w-fit mt-4 mx-auto" onClick={copyText}>
                          <button
                            className={`${montserratAlternates.className} border-solid py-2 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full`}
                          >
                            <FaCopy />
                          </button>
                        </div>
                        <div
                          className="w-fit mt-4 mx-auto"
                          onClick={handleSaveSession}
                        >
                          <button
                            className={`${montserratAlternates.className} border-solid  py-2 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full`}
                          >
                            {savingSession ? "saving..." : "save session"}
                          </button>
                        </div>
                      </div>

                      <p>
                        if there was an error somehow, please copy your text and
                        save it somewhere on your device. it is valuable, and a
                        session that counts is one that happened. it is all an
                        excuse.
                      </p>
                      {errorUploadingToIrys && (
                        <div className="flex flex-col">
                          <p>
                            there was an error uploading your session. please
                            let jp know asap in order to fix it.
                          </p>
                          <a
                            className="text-gray-400 hover:text-gray-500"
                            href="https://t.me/jpfraneto"
                            target="_blank"
                          >
                            message on telegram
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div></div>
          </div>
        ) : (
          <div className="w-full grow">
            {isTextareaClicked ? (
              <div
                className={`${ibmPlexSans.className} ${
                  isTextareaClicked ? " w-7/8 xl:w-8/12 " : "w-3/4 xl:w-1/2 "
                } mx-auto h-fit py-3 md:py-4 mt-2 flex justify-center items-center px-8 bg-white text-gray-500 ${
                  textareaHidden ? "text-xl" : "text-sm"
                } md:text-2xl shadow-lg`}
              >
                {ankyverseQuestion}
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
                    sojourn #3 · wink {ankyverseDay.wink} ·{" "}
                    {ankyverseDay.kingdom.toLowerCase()}
                  </h2>
                </Link>
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
                    if (authenticated && !sessionStarted) {
                      setAlreadyStartedOnce(true);
                      handleClick();

                      if (!alreadyStartedOnce) {
                        setTextareaHidden(true);
                      }
                    }
                  }}
                  disabled={!authenticated}
                  style={{ fontStyle: "italic" }}
                  onChange={handleTextChange}
                  className={`${
                    montserratAlternates.className
                  }  w-full md:h-96 h-48 bg-white shadow-md ${
                    !isTextareaClicked &&
                    "hover:shadow-xl hover:shadow-pink-200"
                  } mx-auto placeholder:italic italic opacity-80 text-gray-400 italic border border-white p-3 cursor-pointer`}
                  placeholder={`${
                    !ready
                      ? "loading..."
                      : !authenticated
                      ? "log in to write..."
                      : "start writing..."
                  }`}
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
      <section
        className="h-screen w-full flex flex-col items-center  md:flex-row px-2md:px-12"
        id="welcome"
      >
        <div className="w-full md:w-1/2 md:h-1/2 h-full relative">
          <Image src="/images/logo.svg" fill />
        </div>
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl">Welcome</h2>
          <p className="mt-4">
            Anky is a frame of reference to gamify what is fundamentally hard to
            do: Get to know yourself.
          </p>
          <p className="mt-4">
            We use different tools in order to develop a core capacity: being
            able to write, every day, for 8 minutes.
          </p>
        </div>
      </section>
      <section className="h-screen w-full flex justify-around items-center flex-col md:flex-row px:2 md:px-12">
        <div className="p-2 border border-black rounded-xl bg-purple-400 h-fit w-fit flex flex-col items-center ">
          <div className="w-48 h-48 relative">
            <FiPenTool size={192} />
          </div>
          <p className="w-64 mt-4 h-fit">
            Write 8 minutes a day, every day - each day has a prompt
          </p>
        </div>
        <div className="p-2 border border-black rounded-xl bg-purple-400 h-fit w-fit flex flex-col items-center ">
          <div className="w-48 h-48 relative">
            <FaBookOpen size={192} />
          </div>
          <p className="w-64 mt-4 h-fit">
            All of the writings are used to train a custom AI model that will
            write a book.
          </p>
        </div>
        <div className="p-2 border border-black rounded-xl bg-purple-400 h-fit w-fit flex flex-col items-center ">
          <div className="w-48 h-48 relative">
            <Image src="/images/newen.svg" fill />
          </div>
          <p className="w-64 mt-4 h-fit">
            Earn $newen in the process. Get familiar with crypto practically.
          </p>
        </div>
      </section>
      <section className="h-screen w-full flex justify-around flex-col md:flex-row ">
        <div className="w-full md:w-1/2 bg-black h-full flex items-center justify-center">
          <div className="relative">
            <Image src="/images/darkoh.png" width={333} height={555} />
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center">
          <div className="w-96">
            <h2 className="text-3xl mb-8">1. Own an Anky Mentor</h2>
            <p>
              To participate on this collective experience you need a key. Your
              mentor is that key.
            </p>
            <div className="mt-4 w-fit">
              <a
                href={`https://opensea.io/collection/anky-mentors`}
                target="_blank"
              >
                <Button
                  buttonText="get your mentor"
                  buttonColor="bg-purple-200"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen w-full flex justify-around flex-col md:flex-row ">
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center">
          <div className="w-96">
            <h2 className="text-3xl mb-8">2. Come and write every day</h2>
            <p>
              Your mission is 8 minutes of an unfiltered stream of
              consciousness, answering the prompt of the day.
            </p>
            <div className="mt-4 w-fit">
              <a
                href={`https://paragraph.xyz/@ankytheape/chapter-${
                  ankyverseDay.wink - 2
                }`}
                target="_blank"
              >
                <Button
                  buttonText="write"
                  buttonAction={() => alert("write")}
                  buttonColor="bg-purple-200"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-black h-full flex items-center justify-center">
          <div className="relative w-2/3">
            <TextStreamer text={ankyverseDay.prompt["en"]} />
          </div>
        </div>
      </section>{" "}
      <section className="h-screen w-full flex justify-around flex-col md:flex-row ">
        <div className="w-full md:w-1/2 bg-black h-full flex items-center justify-center">
          <div className="relative rounded-xl border-white border-2 overflow-hidden">
            <Image src="/images/librarian.png" width={666} height={333} />
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center">
          <div className="w-96">
            <h2 className="text-3xl mb-8">
              3. Read the chapter generated the previous day
            </h2>
            <p>
              Our custom trained AI model processes all of what is written on a
              given day into the chapter of that day.
            </p>
            <div className="mt-4 w-fit">
              <a
                href={`https://paragraph.xyz/@ankytheape/chapter-${
                  ankyverseDay.wink - 2
                }`}
                target="_blank"
              >
                <Button buttonText="read book" buttonColor="bg-purple-200" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="px-2 md:px-16 h-72 bg-purple-400 w-full flex justify-around py-8 justify-between flex-col md:flex-row ">
        <div className="flex flex-col w-fit">
          <Link href="/" className="w-32 h-16 relative cursor-pointer" passHref>
            <Image src="/images/anky-logo.png" fill />
          </Link>
          <div className="text-xl mt-4">© 2024</div>
          <div className="text-xl mt-4">
            <Link href="/terms-and-conditions">Privacy - Terms</Link>
          </div>
        </div>
        <div className="flex flex-col w-fit">
          <div className="text-xl mt-4">
            <Link href="/product">Product</Link>
          </div>
        </div>
        <div className="flex flex-col w-fit">
          <div className="text-xl mt-4">
            <Link href="/features">Features</Link>
          </div>
        </div>
        <div className="flex flex-col w-fit">
          <div className="text-xl mt-4">
            <Link href="/newen">$newen</Link>
          </div>
        </div>
        <div className="flex flex-col w-fit">
          <div className="text-xl mt-4">
            <a href="https://t.me/ankytheape" target="_blank">
              telegram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
