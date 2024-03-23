import React, { createContext, useContext, useEffect, useState } from "react";
const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState({
    secondsBetweenKeystrokes: 8,
  });
  return (
    <SettingsContext.Provider
      value={{
        userSettings,
        setUserSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsContext");
  }
  return context;
};
