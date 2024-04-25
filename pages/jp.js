import React from "react";
import { getCommunityWritingsForWink } from "../lib/irys";

const jp = () => {
  return (
    <div>
      <button
        onClick={() => {
          getCommunityWritingsForWink(24);
        }}
      >
        query
      </button>
    </div>
  );
};

export default jp;
