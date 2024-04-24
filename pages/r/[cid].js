import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { fetchContentFromIrys } from "../../lib/irys";
import { FaShareSquare } from "react-icons/fa";
import { getAnkyverseDay } from "../../lib/ankyverse";
import { ToastContainer, toast } from "react-toastify";
import { Montserrat_Alternates } from "next/font/google";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400"],
});

const WritingSessionByCid = ({ writingSession, ankyverseDay }) => {
  async function handleShareSession() {
    try {
      await navigator.clipboard.writeText(
        `https://www.anky.lat/r/${writingSession.cid}`
      );
      toast.success("link copied", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log("there was an error copying the text", error);
    }
  }

  return (
    <div className="flex h-full  w-full flex-col  justify-center md:flex-row">
      <div className="h-96 md:h-full w-full md:w-fit px-8">
        <ToastContainer />
        <div className="flex w-full mx-auto py-4 px-2 rounded-xl space-y-2 flex-col items-center justify-between mt-8">
          <div className="flex flex-col items-center p-2 w-96">
            <h2
              className={`${ankyverseDay.color} mb-2 hover:opacity-60 text-xl`}
            >
              day {ankyverseDay.wink} · {ankyverseDay.kingdom.toLowerCase()}
            </h2>
            <p className={`${ankyverseDay.color} mb-4 p-2`}>
              {ankyverseDay.prompt["en"]}
            </p>
            <div
              className={` rounded-xl w-full h-fit max-h-64 overflow-y-scroll mb-2`}
            >
              {writingSession.text}
            </div>
            <div>
              <div className="mt-4 flex w-full justify-between">
                <div className="w-fit  mx-auto" onClick={handleShareSession}>
                  <button
                    className={`${montserratAlternates.className} border-solid  py-2 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full`}
                  >
                    <FaShareSquare />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingSessionByCid;

export const getServerSideProps = async (context) => {
  const { cid } = context.query;
  const writingSession = await fetchContentFromIrys(cid);
  const ankyverseDay = getAnkyverseDay(writingSession.savedTimestamp);
  return { props: { writingSession, ankyverseDay } };
};
