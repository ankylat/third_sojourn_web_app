import { usePrivy } from "@privy-io/react-auth";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import DesktopWritingGame from "../components/DesktopWritingGame";
import { getAnkyverseDay, getAnkyverseQuestion } from "../lib/ankyverse";
import Link from "next/link";
import Image from "next/image";

const LandingPage = ({
  displayWritingGameLanding,
  setDisplayWritingGameLanding,
  setLifeBarLength,
  lifeBarLength,
  setNewenBarLength,
  newenBarLength,
}) => {
  const [text, setText] = useState("");
  const ankyverseToday = getAnkyverseDay(new Date());
  const ankyverseQuestion = getAnkyverseQuestion(ankyverseToday.wink);

  const { authenticated, login } = usePrivy();
  const { userOwnsAnky, setUserAppInformation, userAppInformation } = useUser();

  if (displayWritingGameLanding) {
    return (
      <div
        className="h-full"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/primordia.png')",
          backgroundColor: "black",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <DesktopWritingGame
          ankyverseDate={`sojourn ${ankyverseToday.currentSojourn} - wink ${
            ankyverseToday.wink
          } - ${ankyverseToday.currentKingdom.toLowerCase()}`}
          userPrompt={ankyverseQuestion}
          setUserAppInformation={setUserAppInformation}
          userAppInformation={userAppInformation}
          setLifeBarLength={setLifeBarLength}
          text={text}
          setText={setText}
          lifeBarLength={lifeBarLength}
          displayWritingGameLanding={displayWritingGameLanding}
          setDisplayWritingGameLanding={setDisplayWritingGameLanding}
          countdownTarget={480}
          newenBarLength={newenBarLength}
          setNewenBarLength={setNewenBarLength}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex flex-col items-center">
      <section className="w-full hero-section p-2">
        <h2 className="text-5xl">STOP READING</h2>
        <h3 className="text-3xl">just write</h3>
        <p>(for 8 minutes)</p>
        <div className="w-full mt-4 aspect-square">
          <textarea className="h-full w-full bg-red-200" />
        </div>
        <div className="mt-8 hover:text-yellow-600">
          <Link href="/terms-and-conditions">terms & conditions</Link>
        </div>
      </section>
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
