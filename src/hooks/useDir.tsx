"use client";
import { createContext, useContext } from "react";

type Direction = "ltr" | "rtl";

const DirectionContext = createContext<Direction | undefined>(undefined);

const getDefaultDir = (): Direction => {
  if (typeof document !== "undefined") {
    const htmlDir = document?.documentElement?.getAttribute("dir");
    return htmlDir === "rtl" ? "rtl" : "ltr";
  }
  return "ltr";
};

export const DirectionProvider = ({
  children,
  dir,
}: {
  children?: React.ReactNode;
  dir?: Direction;
}) => {
  const defaultDir = getDefaultDir();
  return (
    <DirectionContext.Provider value={dir || defaultDir}>
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirection = () => {
  const dir = useContext(DirectionContext);
  if (dir === undefined) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return dir;
};
