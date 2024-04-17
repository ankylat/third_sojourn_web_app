import React from "react";
import Button from "../Button";
import TextStreamer from "../TextStreamer";
import Image from "next/image";

const Instructions = ({ ankyverseDay }) => {
  return (
    <>
      <section className="h-screen w-full flex justify-around flex-col md:flex-row ">
        <div className="w-full md:w-1/2 bg-black h-full flex items-center justify-center">
          <div className="relative">
            <Image src="/images/darkoh.png" width={333} height={555} />
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full py-8 px-4 md:px-0 md:py-0 flex flex-col items-center justify-center">
          <div className="w-96">
            <h2 className="text-3xl mb-8">1. Own an Anky Mentor</h2>
            <p>
              To participate on this collective experience you need a key. Your
              mentor is that key.
            </p>
            <div className="mt-4 mb-4 w-fit">
              <a
                href={`https://opensea.io/collection/anky-mentors`}
                target="_blank"
              >
                <Button
                  buttonText="explore mentors"
                  buttonColor="bg-purple-200"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen w-full flex justify-around flex-col-reverse  md:flex-row ">
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center">
          <div className="w-96">
            <h2 className="text-3xl mb-8">2. Come and write every day</h2>
            <p>
              Your mission is 8 minutes of an unfiltered stream of
              consciousness, answering the prompt of the day.
            </p>
            <div className="mt-4 w-fit">
              <Button
                buttonText="write"
                buttonAction={() => {
                  if (!sessionStarted) {
                    setAlreadyStartedOnce(true);
                    handleClick();

                    if (!alreadyStartedOnce) {
                      setTextareaHidden(true);
                    }
                  }
                }}
                buttonColor="bg-purple-200"
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-black flex-col  py-8  md:py-0 h-full flex items-center justify-center">
          <p className="text-purple-400 mb-4">prompt of today:</p>
          <div className="relative w-full px-4 md:w-2/3">
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
            <p>
              We are writing, together, the first AI assisted collaborative
              story of humanity.
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
    </>
  );
};

export default Instructions;
