import React, { createContext, useContext, useEffect, useState } from "react";
const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState({
    secondsBetweenKeystrokes: 8,
    language: "es",
    deviceType: "",
  });

  useEffect(() => {
    const detectDeviceType = () => {
      const ua = navigator.userAgent;
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          ua
        )
      ) {
        setUserSettings((prevSettings) => ({
          ...prevSettings,
          deviceType: "mobile",
        }));
      } else {
        setUserSettings((prevSettings) => ({
          ...prevSettings,
          deviceType: "desktop",
        }));
      }
    };

    // Run the detection function when the component mounts
    detectDeviceType();
  }, []);
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
