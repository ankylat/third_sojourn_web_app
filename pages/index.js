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

const secondsOfLife = 8;
const totalSessionDuration = 20; // seconds

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
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionRandomUUID, setSessionRandomUUID] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [userStreak, setUserStreak] = useState(1);
  const [savingSession, setSavingSession] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [lastKeystroke, setLastKeystroke] = useState();
  const [userLost, setUserLost] = useState(false);
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

  const ankyverseToday = getAnkyverseDay(new Date());
  const ankyverseQuestion = getAnkyverseQuestion(ankyverseToday.wink);

  const { userOwnsAnky, setUserAppInformation, userAppInformation } = useUser();

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
      /************* EDIT THESE VALUES DYNAMICALLY */
      const ankyMentorIndex = "12";
      const ankyverseDay = "1";
      const previousPage = "2";
      /************* EDIT THESE VALUES DYNAMICALLY */

      const tags = [
        { name: "Content-Type", value: "text/plain" },
        { name: "application-id", value: "Anky Third Sojourn - v0" },
        { name: "mentor-index", value: ankyMentorIndex },
        { name: "sojourn", value: "3" },
        { name: "day", value: ankyverseDay },
        {
          name: "previous-page",
          value: previousPage,
        },
      ];
      const webIrys = await getWebIrys();
      try {
        const receipt = await webIrys.upload(text, { tags });
        console.log("the receipt is: ', ", receipt);
        console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
        return receipt.id;
      } catch (e) {
        console.log("Error uploading data ", e);
      }
    } catch (error) {
      console.log("there was a problem uploading to irys");
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
      } else {
        localStorage.setItem(
          `session - ${sessionRandomUUID}`,
          JSON.stringify({
            timestamp: new Date().getTime(),
            text: text,
          })
        );
      }

      setSavingSession(false);
      setSessionSaved(true);
    } catch (error) {
      console.log("there is an error here", error);
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

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="h-6 w-full pr-12">
        <div
          className="h-full opacity-80 newen-bar"
          style={{
            width: `${newenBarLength}%`,
          }}
        ></div>
      </div>
      {finishedSession ? (
        <div
          className={`${
            isTextareaClicked ? "" : ""
          } w-full grow pt-12 flex flex-col`}
        >
          {userLost ? (
            <div>
              <div className="text-left bg-white finish-button w-3/4 md:w-3/5 mt-42 mx-auto flex items-center">
                <span className="mr-8">
                  <PiWarningCircle size={33} />{" "}
                </span>
                <span className="text-left">
                  You stopped writing for more than 8 seconds.
                </span>
              </div>
              <div
                onClick={() => {
                  setIsTextareaClicked(false);
                  setFinishedSession(false);
                  setNewenBarLength(0);
                }}
                className="px-8 bg-orange-300 w-fit mt-4 mx-auto rounded-sm cursor-pointer hover:bg-orange-400 active:translate-y-1 active:translate-x-1 text-white py-2"
              >
                RETRY
              </div>
            </div>
          ) : (
            <div>
              {sessionSaved ? (
                <div className="text-left bg-white finish-button w-96 rounded-xl h-96  mx-auto flex flex-col justify-between  items-center">
                  <div className="flex flex-col  justify-center">
                    <span className="text-6xl">{userStreak}</span>
                    <span className="text-xl"> your streak</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-xl bg-gray-100 border border-black">
                    {" "}
                    <div className="flex w-full mx-auto justify-center mb-2">
                      {["mo", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                        (x, i) => {
                          return (
                            <div
                              key={i}
                              className="flex flex-col justify-center"
                            >
                              <div className="w-6 h-6 mx-2 rounded-full bg-red-200 border border-black"></div>
                              <span className="text-xs">{x}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                    <hr />
                    <div>
                      <p className="wrap mt-2 text-md">
                        &quot;the scariest moment of writing is always before
                        you start&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between w-full">
                    <span
                      onClick={() => alert("share on socials")}
                      className="bg-red-100 border-black border rounded-xl p-2 cursor-pointer hover:bg-red-200"
                    >
                      share
                    </span>
                    <span
                      onClick={() => setIsTextareaClicked(false)}
                      className="bg-red-100 border-black border rounded-xl p-2 cursor-pointer hover:bg-red-200"
                    >
                      <a
                        href="https://www.paragraph.xyz/@ankytheape"
                        target="_blank"
                      >
                        read book of anky
                      </a>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-left bg-white rounded-xl shadow-lg px-8 py-8 w-fit rounded-xl h-fit mx-auto flex flex-col justify-between  items-center">
                  <span className="w-24 h-24 relative">
                    <Image src="/images/Icon_copy_2.svg" fill />
                  </span>
                  <div className="flex flex-col justify-between space-x-2 mt-8">
                    <div className="p-2 w-full rounded-xl bg-gray-200 border border-black flex">
                      <span>{text.split(" ").length}</span>
                      <span>words</span>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-200 border border-black flex">
                      <span className="w-24 h-24 relative">
                        <Image src="/images/newen.svg" fill />
                      </span>
                      <div className="p-2 rounded-xl flex">
                        <span>{authenticated ? "+7025" : "0"}</span>
                        <span>$newen</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-gray-200 border border-black flex">
                      <span>1</span>
                      <span>streak</span>
                    </div>
                  </div>
                  <div>
                    <button
                      className={`${montserratAlternates.className} login-btn px-4 hover:bg-gray-100 shadow-xl border-black border rounded`}
                      onClick={handleSaveSession}
                    >
                      {savingSession ? "saving..." : "save session"}
                    </button>
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
                isTextareaClicked ? " w-7/8 xl:w-w-8/12 " : "w-3/4 xl:w-1/2 "
              } mx-auto h-16 mt-8 text-xl flex justify-center items-center px-8 prompt border-black`}
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
              } mx-auto placeholder:italic italic opacity-80 text-gray-400 italic border border-white p-2 cursor-pointer`}
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
      {/* <section className="w-full h-screen bg-gray-400 px-2 py-8 text-black">
        <p>anky is a game for writers</p>
        <p>
          designed to stare into the eyes of the most brutal adversary we have:
        </p>
        <h2 className="italic text-2xl">resistance.</h2>
        <p>our toolkit:</p>
        <p>
          {" "}
          <Link className="text-red-200 hover:text-red-600" href="# community">
            community.
          </Link>
        </p>
        <p className="text-orange-200 hover:text-orange-600">
          <Link href="#tokenomics">economical rewards</Link>
        </p>
        <p className="text-yellow-200 hover:text-yellow-600">
          <Link href="#ai-model">storytelling as a service</Link>
        </p>
        <p className="text-green-200 hover:text-green-600">
          <Link href="#ethos">consistency over intensity</Link>
        </p>
        <p className="text-blue-200 hover:text-blue-600">
          <Link href="#ankyverse">lore</Link>
        </p>
        <p className="text-indigo-200 hover:text-indigo-600">
          <Link href="#participate">participate on next season</Link>
        </p>
        <small>(we start on the 31st of march)</small>
        <p className="text-violet-200 hover:text-violet-600">
          <Link href="#poiesis">we are all creators</Link>
        </p>
        <p className="text-white hover:text-gray-300">
          <Link href="#equipo">the team</Link>
        </p>
      </section>
      <section
        id="community"
        className="w-full h-screen bg-red-200 px-2 py-8 text-black"
      >
        <h2 className="text-4xl">community</h2>
        <p>
          the mission that we have is simple and sharp, and you have different
          degrees of involvement.
        </p>
        <p>the main one: write every day for 8 minutes.</p>
        <p>
          after that, you can spend 8 minutes reading the chapter of the book
          that was written by anky as a consequence of what people wrote the day
          before.
        </p>
        <p>
          then you can comment that so that we can use it as fine tuning for the
          ai model.
        </p>
        <p>
          if you want to go even deeper, you can contribute to the lore on{" "}
          <a href="https://www.adimverse.com/rooms/">adim</a>
        </p>
        <p>
          you can also join our
          <a href="https://t.me/ankytheape" target="_blank">
            telegram group.
          </a>
        </p>
        <p>
          and participate as you wish on the
          <a href="https://warpcast.com/~/channel/anky">farcaster channel.</a>
        </p>
        <p>
          you decide how much you do, but the eternal rule applies to all of
          this:
        </p>
        <p>the more you give the more you receive.</p>
        <p>
          life is a spiral. and this is the invitation to navigate it together.
        </p>
      </section>
      <section
        id="tokenomics"
        className="w-full h-screen bg-orange-200 px-2 py-8 text-black"
      >
        <h2 className="text-4xl">tokenomics</h2>
        <p>
          (this is a screenshot of the{" "}
          <a
            href="https://basescan.org/address/0xffe3cdc92f24988be4f6f8c926758dce490fe77e#code"
            target="_blank"
            className="text-blue-600 hover:text-yellow-600"
          >
            smart contract of $newen
          </a>
          )
        </p>
        <div className="h-96 w-full mt-4 relative">
          {" "}
          <Image src="/images/newen.png" fill />
        </div>
      </section>
      <section
        id="ai-model"
        className="w-full h-screen bg-yellow-200 px-2 py-8 text-black"
      >
        <h2 className="text-4xl">ai model</h2>
        <p>
          there are 8 seasons, each one of them with a growing number of
          participants that is already known: 192, 312, 504, 816, 1320, 2136,
          3456 and 5592.
        </p>
        <p>
          each season consists of 96 chronological days, on which any owner of
          an anky mentor can write through anky.
        </p>
        <p>
          our custom trained ai model (anky) will be trained with that data, and
          the single output for each day of its work will be a chapter on the
          saga of anky.
        </p>
        <p>
          there are 8 books, each one of them exploring a period of 7 years of
          its life.
        </p>
        <p>the same as us.</p>
        <p>
          this ai model will end up being a better representation of the core
          consciousness of humanity more than anything else that has happened
          before.
        </p>
        <p>because it will be created after our collective unconscious.</p>
      </section>
      <section
        id="ethos"
        className="w-full h-screen bg-green-200 px-2 py-8 text-black"
      >
        <h2 className="text-4xl">ethos</h2>
        <p>
          anky is built after a strong recongnition that it is time to show up,
          and do the work.
        </p>
        <p>no one will be accountable for yourself.</p>
        <p>it is up to you to show up.</p>
        <p>
          we believe in the power of consistency as a vehicle for expanding
          consciousness, and that is why the core practice that we propose is 8
          minutes of writing every day.
        </p>
      </section>{" "}
      <section
        id="ankyverse"
        className="w-full h-screen bg-indigo-200 px-2 py-8 text-black"
      >
        <h2 className="text-4xl">ankyverse</h2>
        <p>this whole story is told through an allegorical interface</p>
      </section>
      <section
        id="participate"
        className="w-full h-screen bg-purple-200 px-2 py-8 text-black"
      >
        <h2 className="text-4xl">get your anky mentor</h2>
        <p>once they were free</p>
        <p>for the people that were able to see</p>
        <p>now you can only get them on secondary</p>
        <p>
          here on{" "}
          <a
            target="_blank"
            href="https://opensea.io/collection/anky-mentors"
            className="text-blue-600 hover:text-yellow-600"
          >
            opensea
          </a>{" "}
          or{" "}
          <a
            target="_blank"
            href="https://highlight.xyz/mint/65ecc65e9ab450e98aed98bb/marketplace"
            className="text-blue-600 hover:text-yellow-600"
          >
            highlight
          </a>
          .
        </p>
      </section>
      <section
        id="poiesis"
        className="w-full h-screen bg-white px-2 py-8 text-black"
      >
        <h2 className="text-4xl">bienvenid@</h2>
        <p>estamos todos locos</p>
        <p>y esta es una forma de honrarlo.</p>
      </section>
      <section
        id="equipo"
        className="w-full h-screen bg-white px-2 py-8 text-black"
      >
        <h2 className="text-4xl">the team behind</h2>
        <p>david</p>
        <p>benja</p>
        <p>fabi</p>
        <p>bruno</p>
        <p>jp</p>
        <p>thank you for your trust</p>
      </section> */}
    </div>
  );
};

export default LandingPage;
