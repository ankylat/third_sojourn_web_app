import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Button from "../components/Button";
import Link from "next/link";

const TermsAndConditions = () => {
  const [hasUserSigned, setHasUserSigned] = useState(false);
  const { authenticated, login } = usePrivy();
  return (
    <section className="w-full md:w-1/2 mx-auto py-8 px-4 grow overflow-y-scroll">
      <h2 class="text-xl font-bold mb-4">
        anky third sojourn · terms & conditions
      </h2>
      <p class="mb-4">
        “Anky Eres Tu SpA” is a company that is located in Chile, and that deals
        with law through the entity with RUT number “77.796.373-2”. Throughout
        this document, that company will be referred to as “us”, “we”, “our”,
        etc.
      </p>
      <p class="mb-4">
        For simplicity, and for the whole rest of this document, the reader of
        it, and person that is invited to this process is referred to as “you”,
        “your”, etc.
      </p>
      <p class="mb-4">
        That same “you” is the one that will be subject to inquiry through this
        whole adventure that we are embarking on together.
      </p>
      <p class="mb-4">
        If you decide to write through anky every day for 8 minutes, you imply
        that you acknowledge these 12 points.
      </p>
      <ul class="list-decimal pl-5 space-y-2">
        <li>
          You acknowledge that this process starts on the 31st of March, on this
          exact timestamp: 1711861200, and that this third sojourn will last for
          96 days. A day is a 24-hour period, counted exactly in relationship to
          that timestamp.
        </li>
        <li>
          You acknowledge that it is your personal responsibility to remember to
          write every day. Our mission is to create a system and network that
          actually helps you remember, but we will understand through trial and
          error how does that system look like. We will then iterate with your
          feedback and doing our best to understand your needs as a user. But
          that takes time, and patience, and needs to be a two-sided
          relationship. In the meantime, this{" "}
          <a
            href="https://calendar.google.com/calendar/u/0?cid=YTkwMjkyNzYzYmIxODQzNDkzZjNkMzI3YTAzZTBiNDI2MjFiNTA4M2U5Mzg4NTBhMWJiNmRmY2U0ZjEwYzUzZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
            target="_blank"
            className="text-blue-600 hover:text-yellow-600"
          >
            google calendar
          </a>{" "}
          may help. You can always reach out to us on telegram to offer any
          feedback.
        </li>
        <li>
          You acknowledge that every 8-minute piece of writing that you create
          through Anky is public (at least on the initial phase), and that if
          you want to be anonymous you just have to create a new wallet with no
          attachments to your identity and find a way to get a mentor in there.
          You can get one on secondary, or ask us for one on our{" "}
          <a
            href="https://t.me/ankytheape"
            target="_blank"
            className="text-blue-600 hover:text-yellow-600"
          >
            telegram group
          </a>
          .
        </li>
        <li>
          You acknowledge that all of the pieces of writing of a given day will
          be used as input for our custom trained ai model for it to write the
          chapter that corresponds to that specific and unique day on the story
          of the Ankyverse.
        </li>
        <li>
          You acknowledge that if you want to collaborate on writing the lore
          that will be used as the context for the AI model you need to do it on
          this{" "}
          <a
            href="https://adimverse.com/rooms/2dPsG1fXWh33ztRQ9NWhWQwd9vf"
            target="_blank"
            className="text-blue-600 hover:text-yellow-600"
          >
            Adim room
          </a>
          .
        </li>
        <li>
          You acknowledge that for writing you will receive a token called
          $newen. This is a representation (and honoring) of the harnessing of
          life force that happened on an 8-minute writing session.
        </li>
        <li>
          You acknowledge that for this third sojourn each 8-minute writing
          session will reward you with 7023 $newen, and that:
          <ul>
            <li className="mt-2">
              No one knows how much will be the market value of this token in
              the future.
            </li>
            <li className="mt-2">
              The focus is not on that, but on the value that we bring to the
              world.
            </li>
          </ul>
        </li>
        <li>
          You acknowledge that a book will be written between these potential
          192 writers and this custom trained AI model.
        </li>
        <li>
          You acknowledge that you will own part of that book, and that every
          future day on which you write will reward you with a slice of that
          pie. And that when we print that book and distribute it to the world
          as “the first book that has ever been written by more than 100 humans
          in the history of humanity and it is a story that speaks about
          depression, technology, and the impact of addiction on the human
          experience” you will earn a percentage of each one of those sales.
        </li>
        <li>
          You acknowledge that we are doing the best that we can in order to
          move from a centralized world (jp being the one that is writing this
          document) into a decentralized world (where we find a way to agree on
          what this should say, and actually drive this ship in community), but
          that it is important to start with strong direction in the beginning.
        </li>
        <li>
          You acknowledge that there could be errors on this whole system, but
          the fundamentals are intact, and they are what is being encoded with
          every step we take.
        </li>
        <li>You acknowledge that your uniqueness is a gift.</li>
      </ul>
      <div className="my-8 mx-8">
        <div className="px-8 bg-orange-300 w-fit mt-4 mx-auto rounded-sm cursor-pointer hover:bg-orange-400 active:translate-y-1 active:translate-x-1 text-white py-2">
          <Link href="/">go back</Link>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;
