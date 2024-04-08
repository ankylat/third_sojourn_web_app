import React from "react";
import { useInView } from "react-intersection-observer";

const TextStreamer = ({ text }) => {
  console.log("the text is: ", text);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true, // Trigger this effect once
  });

  // Apply the animation class only when the element is in view
  const animationClass = inView ? "stream-in-text" : "hidden";

  return (
    <div className="w-full bg-black h-full flex items-center justify-center">
      <div className="relative w-2/3">
        <h2 ref={ref} className={` text-blue-200`}>
          {text}
        </h2>
      </div>
    </div>
  );
};

export default TextStreamer;
