import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import DesktopWritingGame from "../components/DesktopWritingGame";
import { getAnkyverseDay, getAnkyverseQuestion } from "../lib/ankyverse";
import { PiWarningCircle } from "react-icons/pi";
import { WebIrys } from "@irys/sdk";
import { IBM_Plex_Sans, Montserrat_Alternates } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import Button from "../components/Button";
import axios from "axios";

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
}) => {
  const [text, setText] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isTextareaClicked, setIsTextareaClicked] = useState(false);
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

  const ankyverseToday = getAnkyverseDay(new Date());
  const ankyverseQuestion = getAnkyverseQuestion(ankyverseToday.wink);

  const { userOwnsAnky, setUserAppInformation, userAppInformation } = useUser();

  const handleClick = () => {
    setNewenBarLength(100);
    setIsTextareaClicked(true);
    const now = Date.now();
    setStartTime(now);
    console.log("starting the session now");
    pingServerToStartWritingSession();
    setTimeout(() => {
      setFinishedSession(true);
    }, 3000);
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
      console.log("starting the writing session");
      let now = new Date();
      let response;
      if (authenticated) {
        const authToken = await getAccessToken();
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/start-session`,
          {
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
      }
    } catch (error) {
      console.log("there was an error requesting to ping the serve", error);
    }
  }

  async function pingServerToEndWritingSession(frontendWrittenTime) {
    try {
      let response;
      if (authenticated) {
        const authToken = await getAccessToken();
        const now = new Date();
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
      console.log("the response from pinging the server is: ", response);
      return {
        ...x,
        manaBalance: response.data.data.manaBalance,
        streak: response.data.data.activeStreak,
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

  return (
    <div className="w-full h-fit flex flex-col items-center">
      <nav
        className={`transition-all duration-500 ease-in-out ${
          isTextareaClicked ? "h-0 opacity-0" : "h-44 sm:h-24 py-6 opacity-100"
        } sm:py-0  bg-white w-full px-24 flex flex-col sm:flex-row justify-between items-center shadow-md`}
      >
        <div className="flex w-fit">
          <div className="w-32 h-16 relative ">
            <Image src="/images/anky-logo.png" fill />
          </div>
        </div>
        {authenticated ? (
          <button
            className={`${montserratAlternates.className} login-btn shadow-xl border-black border rounded`}
            onClick={logout}
          >
            LOGOUT
          </button>
        ) : (
          <button
            className={`${montserratAlternates.className} login-btn hover:bg-gray-100 shadow-xl border-black border rounded`}
            onClick={login}
          >
            LOG IN
          </button>
        )}
      </nav>
      <div className="h-6 w-full pr-12">
        <div
          className="h-full opacity-80 newen-bar"
          style={{
            width: `${newenBarLength}%`,
          }}
        ></div>
      </div>
      {finishedSession ? (
        <div className="w-full h-screen p-2 flex flex-col">
          <div className="text-left finish-button w-3/4 md:w-3/5 mt-42 mx-auto flex items-center">
            <span className="mr-8">
              <PiWarningCircle size={22} />{" "}
            </span>
            You stopped writing for more than 8 seconds
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
        <div className="w-full h-screen p-2">
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
              onClick={handleClick}
              style={{ fontStyle: "italic" }}
              onChange={(e) => {
                setText(e.target.value);
              }}
              className={`${montserratAlternates.className}  w-full md:h-96 h-48 bg-white shadow-md mx-auto placeholder:italic italic text-gray-400 italic border border-white p-2 cursor-pointer`}
              placeholder="start typing..."
            />
          </div>

          {!isTextareaClicked && (
            <div
              className={`${montserratAlternates.className} w-48 mx-auto text-gray-400 mt-8 hover:text-gray-500`}
            >
              <Link href="/terms-and-conditions">terms & conditions</Link>
            </div>
          )}
        </div>
      )}
      <section className="w-full h-screen bg-gray-400 px-2 py-8 text-black">
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
      </section>
    </div>
  );
};

export default LandingPage;
