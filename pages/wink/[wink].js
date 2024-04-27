import React, { useEffect, useState } from "react";
import { getCommunityWritingsForWink } from "../../lib/irys";
import { useRouter } from "next/router";

const Wink = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [writingsForWink, setWritingsForWink] = useState([]);
  useEffect(() => {
    const fetchWritings = async () => {
      try {
        const writings = await getCommunityWritingsForWink(router.query.wink);
        setWritingsForWink(writings);
        setLoading(false);
      } catch (error) {
        console.log("there was an error", error);
      }
    };
    if (router?.query) {
      fetchWritings();
    }
  }, [router.query]);
  if (loading) return <p>loading...</p>;
  return (
    <div className="flex flex-col w-full ">
      {writingsForWink?.map((x, i) => {
        return (
          <div key={i} className="w-full md:w-96 mx-auto">
            <p className="">{x.text}</p>
            <hr className="my-8 border border-gray-200 h-12" />
          </div>
        );
      })}
    </div>
  );
};

export default Wink;
