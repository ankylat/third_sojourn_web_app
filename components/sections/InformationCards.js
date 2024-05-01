import React from "react";
import { FiPenTool } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";
import Image from "next/image";

const InformationCards = () => {
  return (
    <section className="h-fit md:h-screen flex  items-center">
      <div className="flex h-fit flex-wrap xl:flex-nowrap justify-around items-stretch w-full py-12 px-2 md:px-12">
        <div className="p-2 max-w-72 border border-black rounded-xl bg-purple-200 flex flex-col items-center justify-between flex-1 mx-2 my-4 md:my-0">
          <div className="w-48 h-48 relative">
            <FiPenTool size={192} />
          </div>
          <p className="w-64 mt-4 h-fit">Write 8 minutes, every day.</p>
        </div>
        <div className="p-2 border  max-w-64 border-black rounded-xl bg-purple-200 flex flex-col items-center justify-between flex-1 mx-2 my-4 md:my-0">
          {" "}
          <div className="w-48 h-48 relative">
            <FaBookOpen size={192} />
          </div>
          <p className="w-64 mt-4 h-fit">
            Every piece of writing is used to train a custom AI model that is
            writing a book. Every day a new chapter is written.
          </p>
        </div>
        <div className="p-2 border max-w-64 border-black rounded-xl bg-purple-200 flex flex-col items-center justify-between flex-1 mx-2 my-4 md:my-0">
          {" "}
          <div className="w-48 h-48 relative">
            <Image src="/images/newen.svg" fill />
          </div>
          <p className="w-64 mt-4 h-fit">
            Our writers are rewarded with $newen.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InformationCards;
