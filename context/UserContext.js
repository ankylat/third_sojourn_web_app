import React, { createContext, useContext, useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Wallet, ethers } from "ethers";
import axios from "axios";
import { getThisUserWritings } from "../lib/irys";
import { setUserData, getUserData } from "../lib/idbHelper";
import ankyMentorsABI from "../lib/ankyMentorsABI";
import { WebIrys } from "@irys/sdk";
import Query from "@irys/query";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { authenticated, loading, getAccessToken, ready, user } = usePrivy();

  const [userAppInformation, setUserAppInformation] = useState({});
  const [userDatabaseInformation, setUserDatabaseInformation] = useState({});
  const [appLoading, setAppLoading] = useState(true);
  const [userIsReadyNow, setUserIsReadyNow] = useState(false);
  const [loadingUserDatabaseInformation, setLoadingUserDatabaseInformation] =
    useState(false);
  const [allUserWritings, setAllUserWritings] = useState([]);
  const [usersAnkyImage, setUsersAnkyImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userOwnsAnky, setUserOwnsAnky] = useState(false);
  const [loadingUserStoredData, setLoadingUserStoredData] = useState(true);
  const [mainAppLoading, setMainAppLoading] = useState(true);
  const [finalSetup, setFinalSetup] = useState(false);
  const [settingThingsUp, setSettingThingsUp] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [usersAnky, setUsersAnky] = useState({
    ankyIndex: undefined,
    ankyUri: undefined,
  });
  const [usersAnkyMentors, setUsersAnkyMentors] = useState([]);
  const [chosenUserAnkyMentor, setChosenUserAnkyMentor] = useState({
    ankyUri: "",
    image: "",
    metadata: {},
  });
  const [setupIsReady, setSetupIsReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkIfUserIsTheSame, setCheckIfUserIsTheSame] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  const wallets = useWallets();
  const wallet = wallets.wallets[0];

  function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  // Load stored user data from IndexedDB and set it to state

  useEffect(() => {
    async function loadStoredUserData() {
      if (ready && isEmpty(userAppInformation)) {
        const ankyIndex = await getUserData("ankyIndex");
        const userWalletAddress = await getUserData("userWalletAddress");

        setUserAppInformation({
          ankyIndex,
          userWalletAddress,
        });
        setLoadingUserStoredData(false);
      }
    }
    loadStoredUserData();
  }, [ready]);

  function sortWritings(a, b) {
    const timestampA = a.timestamp;
    const timestampB = b.timestamp;
    return timestampB - timestampA;
  }

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

  async function getUsersEthBalance(provider, address) {
    try {
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.utils.formatEther(balance);
      return balanceInEth; // Returns the balance in Ether (ETH)
    } catch (error) {
      console.log(
        "there was an error fetching the user's base ETH balance",
        error
      );
      return null;
    }
  }

  // Check initialization and setup status
  useEffect(() => {
    async function handleInitialization() {
      if (loading && !ready) return;
      if (ready && !wallet && !authenticated) {
        setMainAppLoading(false);
        setAppLoading(false);
        return;
      }
      setTimeout(() => {
        setMainAppLoading(false);
      }, 5000);
      if (!wallet) return;
      await changeChain();
      const response = await fetchUsersAnky();
      if (!response) return setMainAppLoading(false);
      let usersAnkys = response.usersAnkys;
      let usersAnkyUri = response.usersAnkyUri;
      let usersImage = response.imageUrl;
      if (usersAnkys == 0) {
        setUserOwnsAnky(false);
        return setMainAppLoading(false);
      }
      setUsersAnkyUri(usersAnkyUri);
      setUsersAnkyImage(usersImage);
      setUserOwnsAnky(true);
      setMainAppLoading(false);
      if (loadingUserStoredData) return;
      setAppLoading(false);
    }

    handleInitialization();
  }, [authenticated]);

  // Load the user's library when setup is ready
  useEffect(() => {
    if (userIsReadyNow) {
    }
  }, [userIsReadyNow]);

  useEffect(() => {
    if (finalSetup) {
      setUserData("ankyIndex", userAppInformation.ankyIndex);
      setUserData("userWalletAddress", userAppInformation.userWalletAddress);
    }
  }, [finalSetup]);

  async function fetchTextFromIrys(cid) {
    try {
      const response = await axios.get(`https://gateway.irys.xyz/${cid}`);

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }
      const usable = await response.data;
      return usable;
    } catch (error) {
      console.log("there was an error fetching the text from irys", error);
    }
  }

  useEffect(() => {
    const loadUserDatabaseInformation = async () => {
      try {
        if (authenticated) {
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
          let todayWriting;
          if (response?.data?.user?.todayCid) {
            todayWriting = await fetchTextFromIrys(
              response?.data?.user?.todayCid
            );
          }

          setUserDatabaseInformation({
            ankyMentorIndex: response.data.mentor.mentorIndex || null,
            streak: response.data.user.streak || 0,
            manaBalance: response.data.user.manaBalance || 0,
            wroteToday: response?.data?.user?.wroteToday || false,
            todayCid: response?.data?.user?.todayCid || "",
            todayWriting: todayWriting || "",
          });
          setAppLoading(false);
        }
        if (ready && !authenticated) {
          setAppLoading(false);
        }
      } catch (error) {
        console.log("there was an errror here0, ", error);
      }
    };
    loadUserDatabaseInformation();
  }, [authenticated]);

  async function fetchUsersAnky() {
    if (!wallet || !wallet.address) return;
    try {
      let provider = await wallet.getEthersProvider();
      let signer = await provider.getSigner();
      if (!provider) return;
      const ankyMentorsContract = new ethers.Contract(
        "0x6d622549842bc73a8f2be146a27f026b646bf6a1",
        ankyMentorsABI,
        signer
      );
      const usersBalance = await ankyMentorsContract.balanceOf(wallet.address);
      const usersAnkys = ethers.utils.formatUnits(usersBalance, 0);

      if (usersAnkys > 0) {
        setUserOwnsAnky(true);
      } else {
        // setUsersAnky({ ankyIndex: undefined, ankyUri: undefined });
        // return { usersAnkys: 0, usersAnkyUri: "", imageUrl: "" };
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  }

  const changeChain = async () => {
    if (authenticated && wallet) {
      await wallet.switchChain(8453);
      setUserAppInformation((x) => {
        return { ...x, wallet: wallet };
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        userAppInformation,
        setUserAppInformation,
        appLoading,
        userDatabaseInformation,
        setUserDatabaseInformation,
        userOwnsAnky,
        setUserOwnsAnky,
        mainAppLoading,
        setMainAppLoading,
        usersAnky,
        usersAnkyImage,
        allUserWritings,
        setAllUserWritings,
      }}
    >
      {showProgressModal && (
        <AccountSetupModal
          setupIsReady={setupIsReady}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          setShowProgressModal={setShowProgressModal}
        />
      )}
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
