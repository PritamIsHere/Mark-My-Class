import { createContext, useContext, useState } from "react";
import { useMediaQuery } from "../Hooks/useMediaQuery";

const ResponsiveContext = createContext();

export const ResponsiveProvider = ({ children }) => {
  const isMobileSize = useMediaQuery("(max-width: 768px)");

  return (
    <ResponsiveContext.Provider value={isMobileSize}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useMedia = () => useContext(ResponsiveContext);
