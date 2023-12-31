import React, { useEffect, useState } from "react";
import Button from "./Button";
import Link from "next/link";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [activeLeaderboard, setActiveLeaderboard] = useState("all-time"); // all-time, today, longest-runs
  useEffect(() => {
    console.log("now fetching the today", activeLeaderboard);
    fetchLeaderboardData(activeLeaderboard);
  }, [activeLeaderboard]);
  const fetchLeaderboardData = async (category) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/mana/leaderboard/${category}`
      );
      console.log("the response from the db is: ', ", response);
      setLeaderboardData(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      // Handle error state appropriately
    }
  };
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeLeaderboard === "all-time"
              ? "bg-blue-600 text-white"
              : "bg-blue-200"
          }`}
          onClick={() => setActiveLeaderboard("all-time")}
        >
          ALL TIME
        </button>
        <button
          className={`px-4 py-2 rounded mx-2 ${
            activeLeaderboard === "today"
              ? "bg-blue-600 text-white"
              : "bg-blue-200"
          }`}
          onClick={() => setActiveLeaderboard("today")}
        >
          TODAY
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeLeaderboard === "longest-runs"
              ? "bg-blue-600 text-white"
              : "bg-blue-200"
          }`}
          onClick={() => setActiveLeaderboard("longest-runs")}
        >
          LONGEST SESSIONS
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">
                {activeLeaderboard === "longest-runs"
                  ? "Longest Run"
                  : "Earned NEWEN"}
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr className="hover:bg-gray-100" key={index}>
                <td className="px-4 py-2 border text-blue-500 hover:text-blue-700">
                  <a href={`/u/${entry.userId}`}>{entry.userId}</a>
                </td>
                <td className="px-4 py-2 border">
                  {entry._sum?.amount || entry.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
