import React from "react";
import { tools as tList } from "@/lib/tools/source";

const Stars = React.memo(() => {
  const toolsIconsList = tList.getTools().map((tool) => tool.icon);
  return (
    <>
      {[...Array(40)].map((_, index) => {
        const PickedIcon =
          toolsIconsList[Math.floor(Math.random() * toolsIconsList.length)];
        return (
          <PickedIcon
            key={index}
            className="fixed animate-twinkle"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 15}px`,
              rotate: `${Math.random() * 360}deg`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        );
      })}
      {/* // style={{
            //   top: `${Math.random() * 100}vh`,
            //   left: `${Math.random() * 100}vw`,
            //   width: `${Math.random() * 10}px`,
            //   aspectRatio: "16/5",
            //   animationDelay: `${Math.random() * 10}s`,
            // }} */}

      {[...Array(50)].map((_, index) => {
        return (
          <div
            key={index}
            className={`absolute rounded-full bg-white animate-twinkle`}
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 5}px`,
              aspectRatio: "1/1",
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        );
      })}
    </>
  );
});

Stars.displayName = "Stars";
export default Stars;
