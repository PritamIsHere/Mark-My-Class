import React, { createContext, useState, useContext } from "react";

const ResetContext = createContext();
export const useReset = () => useContext(ResetContext);

export const ResetProvider = ({ children }) => {
  const [resetKey, setResetKey] = useState(0);

  const resetAllStates = () => {
    // increment key to remount all children
    setResetKey((prev) => prev + 1);
  };

  return (
    <ResetContext.Provider value={{ resetAllStates }}>
      {/* every provider inside this div will reset when key changes */}
      <div key={resetKey}>{children}</div>
    </ResetContext.Provider>
  );
};
