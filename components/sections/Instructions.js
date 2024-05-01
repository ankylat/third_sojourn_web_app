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
              For being part of this collective experience you need a key. Your
              mentor is that key.
            </p>
            <div className="mt-4 mb-4 w-fit">
              <a
                href={`https://opensea.io/collection/anky-mentors`}
                target="_blank"
              >
                <Button buttonText="shop mentors" buttonColor="bg-purple-200" />
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
              Your mission is to write 8 minutes. If you want, you can explore
              the topic of the day.
            </p>
            <div className="mt-4 w-fit">
              <Button
                buttonText="just write"
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
          <p className="text-purple-400 mb-4">today&apos;s prompt:</p>
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
              3. read the chapter of the previous day
            </h2>
            <p>
              Our custom trained AI model processes everything that is written
              on a given day and writes the chapter of the book that corresponds
              to that day.
            </p>
            <p>Estamos haciendo historia juntos.</p>
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
