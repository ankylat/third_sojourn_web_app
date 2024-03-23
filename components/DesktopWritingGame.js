import React, { useState, useRef, useEffect } from "react";
import { Righteous, Dancing_Script } from "next/font/google";
import Image from "next/image";
import { WebIrys } from "@irys/sdk";
import { useWallets } from "@privy-io/react-auth";
import { saveTextAnon } from "../lib/backend";
import { ethers } from "ethers";
import { setUserData } from "../lib/idbHelper";
import { v4 as uuidv4 } from "uuid";
import Button from "./Button";
import axios from "axios";
import { useRouter } from "next/router";
import { BsArrowRepeat } from "react-icons/bs";
import { FaRegCommentAlt, FaRegHeart } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { encodeToAnkyverseLanguage } from "../lib/ankyverse";

import { usePrivy } from "@privy-io/react-auth";
import { useUser } from "../context/UserContext";
import { useSettings } from "../context/SettingsContext";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const righteous = Righteous({ weight: "400", subsets: ["latin"] });
const dancingScript = Dancing_Script({ weight: "400", subsets: ["latin"] });

const DesktopWritingGame = ({
  userPrompt,
  setLifeBarLength,
  newenBarLength,
  setNewenBarLength,
  setLoadButtons,
  ankyverseDate,
  setUserAppInformation,
  userAppInformation,
  setDisplayWritingGameLanding,
  displayWritingGameLanding,
  setDisplaySettingsModal,
  countdownTarget = 480,
  text,
  setText,
}) => {
  const mappedUserJournals =
    [] || userAppInformation?.userJournals?.map((x) => x.title);
  const router = useRouter();
  const { login, authenticated, user, getAccessToken, sendTransaction } =
    usePrivy();
  const { userSettings } = useSettings();
  const [textareaHeight, setTextareaHeight] = useState("20vh"); // default height
  const { setUserDatabaseInformation, setAllUserWritings } = useUser();
  const audioRef = useRef();
  const [amountOfManaAdded, setAmountOfManaAdded] = useState(0);
  const [whatIsThis, setWhatIsThis] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [randomUUID, setRandomUUID] = useState("");
  const [time, setTime] = useState(countdownTarget || 0);
  const [savingRoundLoading, setSavingRoundLoading] = useState(false);
  const [userWantsFeedbackFromAnky, setUserWantsFeedbackFromAnky] =
    useState(false);
  const [savingRound, setSavingRound] = useState(false);
  const [userWantsToStoreWritingForever, setUserWantsToStoreWritingForever] =
    useState(true);
  const [thereWasAnError, setThereWasAnError] = useState(false);
  const [moreThanMinRun, setMoreThanMinRound] = useState(null);
  const [savingTextAnon, setSavingTextAnon] = useState(false);
  const [savedText, setSavedText] = useState(false);
  const [cid, setCid] = useState("");
  const [sessionIsOver, setSessionIsOver] = useState(false);
  const [userWantsToEncryptWriting, setUserWantsToEncryptWriting] =
    useState(false);
  const [everythingWasUploaded, setEverythingWasUploaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(!authenticated);
  const [savedToDb, setSavedToDb] = useState(false);
  const [lastKeystroke, setLastKeystroke] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [errorProblem, setErrorProblem] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [savingSessionState, setSavingSessionState] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const [journalIdToSave, setJournalIdToSave] = useState("");
  const [missionAccomplished, setMissionAccomplished] = useState(false);
  const [responseFromPinging, setResponseFromPinging] = useState("");
  const [copyText, setCopyText] = useState("copy my writing");
  const [hardcoreContinue, setHardcoreContinue] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const { wallets } = useWallets();

  const textareaRef = useRef(null);
  const intervalRef = useRef(null);
  const keystrokeIntervalRef = useRef(null);
  const thisWallet = wallets[0];

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const handleResize = () => {
    if (isKeyboardOpen) {
      // Adjust the height of the textarea when the keyboard is open
      const availableHeight = window.innerHeight;
      if (textareaRef.current) {
        textareaRef.current.style.height = `${availableHeight * 0.6}px`; // Adjust the 0.6 (60%) as necessary
      }
    } else {
      // Reset the height of the textarea when the keyboard is closed
      if (textareaRef.current) {
        textareaRef.current.style.height = "64px"; // Reset to default height or any other value as needed
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isKeyboardOpen]);

  useEffect(() => {
    if (isActive && !isDone) {
      intervalRef.current = setInterval(() => {
        setTime((time) => {
          const newTime = countdownTarget > 0 ? time - 1 : time + 1;
          const newenLength = (((480 - newTime) / 480) * 100).toFixed(2);
          setNewenBarLength(Math.min(100, Math.max(0, newenLength))); // Ensure it's within 0-100%
          return newTime;
        });
        if (time < 1) {
          setFinished(true);
          setMissionAccomplished(true);
          setIsActive(false);
        }
      }, 1000);
    } else if ((countdownTarget > 0 && time === 0) || (!isActive && !isDone)) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, time, isDone]);

  useEffect(() => {
    if (isActive) {
      keystrokeIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - lastKeystroke;
        if (elapsedTime > 8 * 1000 && !isDone) {
          finishRun();
        } else {
          // calculate life bar length
          const newLifeBarLength = 100 - elapsedTime / (10 * 8); // 100% - (elapsed time in seconds * (100 / 3))
          setLifeBarLength(Math.max(newLifeBarLength, 0)); // do not allow negative values
        }
      }, 100);
    } else {
      clearInterval(keystrokeIntervalRef.current);
    }

    return () => clearInterval(keystrokeIntervalRef.current);
  }, [isActive, lastKeystroke]);

  const resetKeyboardState = () => {
    setIsKeyboardOpen(false);
    handleResize();
  };

  const finishRun = async () => {
    try {
      const finishTimestamp = Date.now();
      if (countdownTarget === 0) setMissionAccomplished(true);
      setSessionIsOver(true);
      setLifeBarLength(0);
      setFinished(true);
      setEndTime(finishTimestamp);
      setIsDone(true);
      setIsActive(false);
      clearInterval(intervalRef.current);
      clearInterval(keystrokeIntervalRef.current);
      await navigator.clipboard.writeText(text);
      setMoreThanMinRound(true);
      setFailureMessage(`You're done! This run lasted ${time}.}`);
      const frontendWrittenTime = Math.floor(
        (finishTimestamp - startTime) / 1000
      );
      console.log("inside the finish run thing", frontendWrittenTime);

      if (frontendWrittenTime > 30 && authenticated) {
        pingServerToEndWritingSession(finishTimestamp, frontendWrittenTime);
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyText("copied");
    } catch (error) {
      console.log("there was an error copying this");
    }
  };

  const startNewRun = () => {
    try {
      audioRef.current.pause();
      setTime(0);
      setLifeBarLength(100);
      setText("");
      setSavingRound(false);
      setSavedToDb(false);
      setIsDone(false);
      setFinished(false);
      setSessionIsOver(false);
      setSavedText(false);
    } catch (error) {
      console.log("there was an error in the start new run function");
    }
  };

  const startNewCountdownRun = () => {
    try {
      audioRef.current.pause();
      setCopyText("Copy my writing");
      setTime(countdownTarget);
      setLifeBarLength(100);
      setText("");
      // setSavingRound(false);
      // setSavedToDb(false);
      setIsDone(false);
      setFinished(false);
      // setSavedText(false);
      copyToClipboard();
    } catch (error) {
      console.log("there was an error");
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    const now = Date.now();
    if (!isActive && event.target.value.length > 0) {
      setIsActive(true);
      setFailureMessage("");
      setStartTime(now);
      if (authenticated) {
        pingServerToStartWritingSession(now);
      }
    }
    if (!text && event.target.value.length > 0) {
      setIsKeyboardOpen(true);
    }
    setLastKeystroke(now);
    if (time > 0 && time % 7 === 0) {
      console.log("IN HEREREEEE", event.target.value);
      if (isRandomText(event.target.value)) {
        alert("STOP CHEATING");
        // send an api request that tells the server that the user was cheating, alongside with the text so far
      }
    }
  };

  async function pingServerToStartWritingSession(now) {
    try {
      let response;
      if (authenticated) {
        const authToken = await getAccessToken();
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/mana/session-start`,
          {
            timestamp: now,
            user: user.id.replace("did:privy:", ""),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } else {
        const newRandomUUID = uuidv4();
        setRandomUUID(newRandomUUID);
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/mana/anon-session-start`,
          {
            timestamp: now,
            randomUUID: newRandomUUID,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.log("there was an error requesting to ping the serve", error);
    }
  }

  async function pingServerToEndWritingSession(now, frontendWrittenTime) {
    try {
      let response;
      if (authenticated) {
        const authToken = await getAccessToken();
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/mana/session-end`,
          {
            timestamp: now,
            user: user.id.replace("did:privy:", ""),
            frontendWrittenTime,
            dataForCalculatingMultiplier: {
              amountOfKeystrokes: "",
              keystrokesPerMinute: "",
              backkeystrokes: "",
              newenMultiplierFromSpeed: 1,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/mana/anon-session-end`,
          {
            timestamp: now,
            randomUUID: randomUUID,
            frontendWrittenTime,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      setAmountOfManaAdded(frontendWrittenTime);
      setResponseFromPinging(response.data.message);
      setUserDatabaseInformation((x) => {
        return {
          ...x,
          manaBalance: response.data.data.manaBalance,
          streak: response.data.data.activeStreak,
        };
      });
    } catch (error) {
      console.log("there was an error pinging the server here.", error);
    }
  }

  const pasteText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyText("copied.");
    } catch (error) {
      console.log("there was an error copying the text.");
    }
  };

  function isRandomText(text) {
    // check if the text is random
  }

  async function copyTextAndStartAgain() {
    try {
      copyToClipboard();
      startNewRun();
    } catch (error) {
      console.log("there was an error copying your text");
    }
  }

  const sendTextToIrys = async () => {
    if (!authenticated) {
      if (confirm("You need to login to save your writings")) {
        return login();
      }
      return router.push("/what-is-this");
    }
    setSavingTextAnon(true);
    const getWebIrys = async () => {
      if (!thisWallet) return;
      const url = "https://node2.irys.xyz";
      const token = "ethereum";
      const rpcURL = "";

      const provider = await thisWallet.getEthersProvider();
      if (!provider) throw new Error(`Cannot find privy wallet`);

      const irysWallet =
        thisWallet?.walletClientType === "privy"
          ? { name: "privy-embedded", provider, sendTransaction }
          : { name: "privy", provider };

      const webIrys = new WebIrys({ url, token, wallet: irysWallet });
      await webIrys.ready();
      return webIrys;
    };
    const webIrys = await getWebIrys();
    let previousPageCid = 0;
    previousPageCid = "";

    const tags = [
      { name: "Content-Type", value: "text/plain" },
      { name: "application-id", value: "Anky Dementors" },
      { name: "container-type", value: "community-notebook" },
    ];
    try {
      const receipt = await webIrys.upload(text, { tags });
      return receipt;
    } catch (error) {
      console.log("there was an error");
      console.log("the error is:", error);
      // setDisplayWritingGameLanding(false);
    }
  };

  async function handleSaveSession() {
    try {
      let irysResponseCid, irysResponseReceipt, responseFromIrys;

      setSavingSessionState(true);
      if (authenticated) {
        if (journalIdToSave) {
          irysResponseReceipt = await saveTextToJournal();
        } else {
          if (!userWantsToStoreWritingForever) {
            responseFromIrys = await axios.post(
              `${process.env.NEXT_PUBLIC_API_ROUTE}/upload-writing`,
              {
                text,
              }
            );
            irysResponseCid = responseFromIrys.data.cid;
          } else {
            irysResponseReceipt = await sendTextToIrys();
            irysResponseCid = irysResponseReceipt.id;
          }
        }
      }

      setDisplayWritingGameLanding(false);
      router.push(`/i/${irysResponseCid}`);
    } catch (error) {
      console.log(
        "There was an error in the handle finish session function",
        error
      );
      setThereWasAnError(true);
    }
  }

  function renderSessionIsOver() {
    return (
      <div
        className={`${
          text && "fade-in"
        } flex flex-col justify-center items-center absolute w-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-opacity-20 mb-4`}
      >
        <div className="border-white border-2 mx-16 md:mx-auto w-5/6 md:w-2/3 xl:w-2/5 rounded-xl bg-black p-2 text-white">
          <p className="text-lg md:text-3xl">your writing session is over</p>
          <Button
            buttonAction={copyTextAndStartAgain}
            buttonText={copyText}
            buttonColor="bg-red-600"
          />
        </div>
      </div>
    );
  }

  if (errorProblem)
    return (
      <div
        className={`${righteous.className} text-white relative flex flex-col items-center justify-center w-full bg-cover bg-center`}
        style={{
          boxSizing: "border-box",
          height: "calc(100vh)",
          backgroundImage: "url('/images/the-monumental-game.jpeg')",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <p>
          There was an error. But you can always keep your writing if you want.
        </p>
        <p>I&apos;m sorry. I&apos;m doing my best to make this thing work.</p>
        <Button
          buttonColor="bg-thegreenbtn"
          buttonAction={pasteText}
          buttonText={copyText}
        />
      </div>
    );

  if (savingTextAnon)
    return (
      <div>
        <p>loading...</p>
        <Spinner />
      </div>
    );

  if (thereWasAnError) {
    return (
      <div className="text-white">
        <p>there was an error uploading your text</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <audio ref={audioRef}>
        <source src="/sounds/bell.mp3" />
      </audio>
      <div className="md:block text-white relative w-full h-full mx-auto">
        <div className="flex h-full flex-col">
          <div
            className={`${righteous.className} w-full grow-0 bg-black/50 py-2 justify-center items-center flex h-fit items-center px-2 flex `}
          >
            {text.length == 0 && (
              <div
                className={`text-left h-fit w-10/12 text-purple-600 md:mt-0 text-xl md:text-3xl overflow-y-scroll  drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`}
              >
                {userPrompt}
              </div>
            )}
            {/* <div className="w-2/12 text-4xl md:text-6xl text-yellow-600 h-full flex relative items-center justify-center ">
              {time}
              {time === 0 && (
                <span
                  onClick={() => setDisplaySettingsModal(true)}
                  className="text-sm absolute bottom-0 right-0 text-red-600 hover:text-red-400 cursor-pointer"
                >
                  <IoSettings size={22} />
                </span>
              )}
            </div> */}
          </div>

          <div className="w-full grow relative">
            <textarea
              ref={textareaRef}
              disabled={finished}
              style={{
                transition: "top 1s, bottom 1s, left 1s, right 1s", // smooth transition
                position: text ? "absolute" : "static", // use absolute positioning only when text is present
                top: text ? "0" : "",
                bottom: text ? "0" : "",
                left: text ? "0" : "",
                right: text ? "0" : "",
              }}
              className={`${
                text ? "w-full h-full text-left" : "mt-8 w-4/5 md:w-3/5 h-64"
              } p-2 text-white opacity-80 placeholder-white text-xl border placeholder:text-gray-300 border-white rounded-md bg-opacity-10 bg-black`}
              placeholder="write here..."
              value={text}
              onPaste={(e) => e.preventDefault()}
              onChange={handleTextChange}
            ></textarea>
            {text.length > 0 ||
              (!finished && (
                <div>
                  <div className="flex w-48 justify-center mx-auto mt-4">
                    <Button
                      buttonText="cancel"
                      buttonColor="bg-red-600"
                      buttonAction={() => {
                        if (displayWritingGameLanding) {
                          if (router.pathname.includes("/u/")) {
                            return setDisplayWritingGameLanding(false);
                          }
                          if (router.pathname.includes("/i/")) {
                            return setDisplayWritingGameLanding(false);
                          }
                          if (
                            router.pathname.includes("write") ||
                            router.pathname.includes("w")
                          ) {
                            router.push("/");
                          }
                          setDisplayWritingGameLanding(false);
                        } else {
                          if (
                            router.pathname.includes("write") ||
                            router.pathname.includes("w")
                          )
                            return router.push("/");
                          setDisplayWritingGameLanding(false);
                          router.push("/");
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
          {sessionIsOver && renderSessionIsOver()}
        </div>
      </div>
    </div>
  );
};

export default DesktopWritingGame;
