import React, { createContext, useContext, useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import axios from "axios";
import { getThisUserWritings } from "../lib/irys";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { authenticated, loading, getAccessToken, ready, user } = usePrivy();

  const [userSessionInformation, setUserSessionInformation] = useState({});
  const [appLoading, setAppLoading] = useState(true);
  const [allUserWritings, setAllUserWritings] = useState([]);

  const wallets = useWallets();
  const wallet = wallets.wallets[0];

  function sortWritings(a, b) {
    const timestampA = a.timestamp;
    const timestampB = b.timestamp;
    return timestampB - timestampA;
  }

  useEffect(() => {
    const initialAppSetup = async () => {
      try {
        if (!ready) return;
        if (ready && authenticated) {
          console.log("INSIDE HERE");
          await changeChainToBase();
          const authToken = await getAccessToken();
          const thisUserPrivyId = user.id.replace("did:privy:", "");

          if (!authToken) return;
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ROUTE}/user/${thisUserPrivyId}`,
            { walletAddress: user.wallet.address },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log("the response is: ", response);
          const writingOfToday = response.data.writingOfToday;
          const formattedWriting = {
            sessionBrowserId: writingOfToday.randomUUID,
            sessionDatabaseId: writingOfToday.id,
            started: true,
            finished: true,
            won: true,
            savedOnIrys: writingOfToday.writingCID && true,
            startingTimestamp: writingOfToday.startTime,
            endingTimestamp: null,
            text: writingOfToday.text,
            cid: writingOfToday.writingCID,
            timeWritten: writingOfToday.sessionDuration,
            ankyMentor: writingOfToday.mentorIndex,
          };

          setUserSessionInformation({
            ankyMentorIndex: response.data.mentor.mentorIndex || null,
            wroteToday: response?.data?.user?.wroteToday || false,
            todayCid: response?.data?.user?.todayCid || "",
            formattedWriting: formattedWriting,
            privyAuthToken: authToken,
          });
          setAppLoading(false);
        } else {
          setAppLoading(false);
        }
      } catch (error) {
        console.log("there was an errror here0, ", error);
      }
    };
    initialAppSetup();
  }, [ready, authenticated]);

  useEffect(() => {
    async function getAllUserWritings() {
      if (!wallet) return;
      if (!authenticated) return;
      const writings = await getThisUserWritings(wallet.address);
      const sortedWritings = writings.sort(sortWritings);

      setAllUserWritings(sortedWritings);
    }

    getAllUserWritings();
  }, [wallet]);

  const changeChainToBase = async () => {
    if (authenticated && wallet) {
      await wallet.switchChain(8453);
    }
  };

  return (
    <UserContext.Provider
      value={{
        appLoading,
        userSessionInformation,
        setUserSessionInformation,
        allUserWritings,
        setAllUserWritings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
