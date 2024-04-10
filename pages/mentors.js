import React, { useState } from "react";
import Image from "next/image";
import mentors from "../lib/mentors";

const AnkyMentorsPage = () => {
  console.log("the mentors are: ", mentors);
  const [filteredMentors, setFilteredMentors] = useState(mentors);
  const [filter, setFilter] = useState("");

  const filterMentors = (filter) => {
    setFilteredMentors(
      mentors.filter((mentor) =>
        mentor.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            filterMentors(e.target.value);
          }}
          className="px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Filter mentors..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {filteredMentors &&
          filteredMentors.map((mentor) => (
            <div
              key={mentor.metadataId}
              className="bg-white p-6 rounded-lg shadow-lg relative"
            >
              <div className="absolute right-2 top-2 rounded-xl overflow-hidden">
                <Image src={mentor.imageUrl} width={161} height={389} />
              </div>
              <h2 className="text-2xl text-purple-800 mb-2">{mentor.name}</h2>

              <p className="text-gray-700 mb-2">City: {mentor.city}</p>
              <p className="text-gray-700 mb-2">Book: {mentor.book}</p>
              <p className="text-gray-700 mb-2">Deity: {mentor.deity}</p>
              <p className="text-gray-700 mb-2">Kingdom: {mentor.kingdom}</p>
              <p className="text-gray-700 mb-4">Chakra: {mentor.chakra}</p>
              <p className="text-gray-700">
                {mentor.description.slice(0, 100)}...
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AnkyMentorsPage;
