import React from "react";
import Image from "next/image";

const Welcome = () => {
  return (
    <section
      className="h-screen py-8 md:py-0 bg-gray-200 md:h-screen w-full flex flex-col justify-around items-center  md:flex-row px-8 md:px-12"
      id="welcome"
    >
      <div className="w-full md:w-1/2 md:h-1/3 mb-4 md:mb-0 h-48 relative">
        <Image src="/images/logo.svg" fill />
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-3xl">Welcome</h2>
        <p className="mt-4">
          Anky is a frame of reference to gamify what is fundamentally hard to
          do: Get to know yourself.
        </p>
        <p className="mt-4">
          We use different tools in order to develop a core capacity: being able
          to write, every day, for 8 minutes.
        </p>
      </div>
    </section>
  );
};

export default Welcome;
