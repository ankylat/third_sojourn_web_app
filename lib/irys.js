import { WebIrys } from "@irys/sdk";
import Query from "@irys/query";
import axios from "axios";

async function uploadToIrys(thisWallet, text) {
  const getWebIrys = async () => {
    // Ethers5 provider
    // await window.ethereum.enable();
    if (!thisWallet) return;
    // const provider = new providers.Web3Provider(window.ethereum);
    const provider = await thisWallet.getEthersProvider();

    const url = "https://node2.irys.xyz";
    const token = "ethereum";
    const rpcURL = "https://rpc-mumbai.maticvigil.com"; // Optional parameter

    // Create a wallet object
    const wallet = { rpcUrl: rpcURL, name: "ethersv5", provider: provider };
    // Use the wallet object
    const webIrys = new WebIrys({ url, token, wallet });
    await webIrys.ready();
    return webIrys;
  };
  const webIrys = await getWebIrys();

  const tags = [{ name: "Content-Type", value: "text/plain" }];
  try {
    const receipt = await webIrys.upload(text, { tags });
    console.log("the receipt is: ", receipt);
    console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
    return receipt.id;
  } catch (e) {
    console.log("Error uploading data ", e);
  }
}

async function fetchContentFromIrys(cid) {
  const response = await fetch(`https://gateway.irys.xyz/${cid}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const usable = await response.json();
  return usable;
}

async function getCommunityWritings() {
  const myQuery = new Query({ url: "https://node2.irys.xyz/graphql" });
  const results = await myQuery
    .search("irys:transactions")
    .tags([
      { name: "Content-Type", values: ["text/plain"] },
      { name: "application-id", values: ["Anky Dementors"] },
      { name: "container-type", values: ["community-notebook"] },
    ])
    .sort("DESC")
    .limit(100);
  const allUserWritings = await Promise.all(
    results.map(async (result, index) => {
      const content = await fetch(`https://node2.irys.xyz/${result.id}`);
      const thisText = await content.text();
      return {
        cid: result.id,
        timestamp: result.timestamp,
        text: thisText,
        writingContainerType: result?.tags[2]?.value || undefined,
      };
    })
  );
  return allUserWritings;
}

async function getOneWriting(cid) {
  try {
    if (cid.length > 12) {
      const content = await fetch(`https://node2.irys.xyz/${cid}`);
      if (content) {
        const thisText = await content.text();
        return {
          text: thisText,
          content,
        };
      } else {
        return {
          text: "no text",
          content: {},
        };
      }
    }
    return {
      text: "no text",
      content: {},
    };
  } catch (error) {
    return {
      text: "no text",
      content: {},
    };
  }
}

async function getAllUsersWritings(authorAddress) {
  const myQuery = new Query({ url: "https://node2.irys.xyz/graphql" });
  const results = await myQuery
    .search("irys:transactions")
    .tags([
      { name: "Content-Type", values: ["text/plain"] },
      { name: "application-id", values: ["Anky Dementors"] },
    ])
    .sort("DESC")
    .limit(100);
  const allUserWritings = await Promise.all(
    results.map(async (result, index) => {
      const content = await fetch(`https://node2.irys.xyz/${result.id}`);
      const thisText = await content.text();
      return {
        cid: result.id,
        timestamp: result.timestamp,
        text: thisText,
        writingContainerType: result?.tags[2]?.value || undefined,
        containerId: result?.tags[3]?.value || undefined,
      };
    })
  );
  return allUserWritings;
}

async function getThisUserWritings(authorAddress) {
  const myQuery = new Query({ url: "https://node2.irys.xyz/graphql" });
  const results = await myQuery
    .search("irys:transactions")
    .from([authorAddress])
    .tags([
      { name: "Content-Type", values: ["text/plain"] },
      { name: "application-id", values: ["Anky Third Sojourn - v0"] },
    ])
    .sort("DESC")
    .limit(100);
  const startTimestamp = 1711861200;
  const calculateDay = (timestamp) => {
    // Convert timestamp from milliseconds to seconds
    const timestampInSeconds = timestamp / 1000;
    // Calculate the difference in days and add 1 to start counting from Day 1
    return Math.floor((timestampInSeconds - startTimestamp) / (24 * 3600)) + 1;
  };
  let allUserWritings = await Promise.all(
    results.map(async (result, index) => {
      const content = await fetch(`https://node2.irys.xyz/${result.id}`);
      const thisText = await content.text();
      return {
        cid: result.id,
        timestamp: result.timestamp,
        text: thisText,
        writingContainerType: result?.tags[2]?.value || undefined,
        containerId: result?.tags[3]?.value || undefined,
        ankyverseDay: calculateDay(result.timestamp),
      };
    })
  );
  allUserWritings = allUserWritings.filter((x) => x.ankyverseDay > 0);
  return allUserWritings;
}

module.exports = {
  uploadToIrys,
  fetchContentFromIrys,
  getCommunityWritings,
  getThisUserWritings,
  getAllUsersWritings,
  getOneWriting,
};
