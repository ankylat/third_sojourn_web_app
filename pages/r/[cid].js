import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchContentFromIrys } from "../../lib/irys";
import { FaShareSquare } from "react-icons/fa";
import moment from "moment";
import {
  getAnkyverseDay,
  getAnkyverseQuestionForToday,
} from "../../lib/ankyverse";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../../components/Spinner"; // Ensure Spinner is properly imported
import "react-toastify/dist/ReactToastify.css";
import { useSettings } from "../../context/SettingsContext";

const WritingSessionByCid = () => {
  const [writingSession, setWritingSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ankyverseDay, setAnkyverseDay] = useState({});
  const { userSettings } = useSettings();
  const router = useRouter();
  const { cid } = router.query;

  useEffect(() => {
    if (cid) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await fetchContentFromIrys(cid);
          setWritingSession(data);
          const thisDay = getAnkyverseDay(data.savedTimestamp);
          setAnkyverseDay(thisDay);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          toast.error("Failed to load content.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [cid]);

  async function handleShareSession() {
    try {
      await navigator.clipboard.writeText(
        `https://www.anky.lat/r/${writingSession.cid}`
      );
      toast.success("Link copied!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("There was an error copying the text:", error);
      toast.error("Failed to copy link.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  if (isLoading)
    return (
      <div className="w-full mx-auto flex justify-center ">
        <Spinner />
      </div>
    ); // Display Spinner while content is loading

  if (!writingSession) return <div>No content available.</div>; // Handle no data case

  return (
    <div className="flex w-full flex-col justify-start md:justify-center md:flex-row">
      <div className=" w-full md:w-2/3 px-8">
        <ToastContainer />
        <div className="flex w-full mx-auto py-4 px-2 rounded-xl space-y-2 flex-col items-center justify-between mt-8">
          <div className="flex flex-col items-center p-2 w-full">
            <p className="mb-2 underline text-xl">
              ankyverse day: {ankyverseDay.wink}
            </p>
            <p className="mb-2 italic w-full text-left text-blue-600">
              {
                getAnkyverseQuestionForToday(writingSession.timestamp)[
                  userSettings.language
                ]
              }
            </p>
            <p className="text-left w-full text-xl mb-4">
              {moment(writingSession.timestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </p>
            <div className={`rounded-xl w-full  mb-2`}>
              {writingSession.text.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div className="mt-4 flex w-full justify-between">
              <div className="w-fit mx-auto" onClick={handleShareSession}>
                <button className="border-solid py-2 border-red-400 px-8 hover:bg-gray-100 shadow-xl border rounded-full">
                  <FaShareSquare />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingSessionByCid;
