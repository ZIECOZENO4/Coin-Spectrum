import { useWindowSize } from "@uidotdev/usehooks";
import React from "react";
// import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export const ConfettiThrower = () => {
  const { width, height } = useWindowSize();
  if (!width || !height) return null;
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={100}
      tweenDuration={2000}
    />
  );
};
