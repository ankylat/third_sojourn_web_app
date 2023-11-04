import { WebIrys } from '@irys/sdk';
import Query from '@irys/query';

async function uploadToIrys(thisWallet, text) {
  const getWebIrys = async () => {
    // Ethers5 provider
    // await window.ethereum.enable();
    if (!thisWallet) return;
    // const provider = new providers.Web3Provider(window.ethereum);
    const provider = await thisWallet.getEthersProvider();

    const url = 'https://node2.irys.xyz';
    const token = 'ethereum';
    const rpcURL = 'https://rpc-mumbai.maticvigil.com'; // Optional parameter

    // Create a wallet object
    const wallet = { rpcUrl: rpcURL, name: 'ethersv5', provider: provider };
    // Use the wallet object
    const webIrys = new WebIrys({ url, token, wallet });
    await webIrys.ready();
    return webIrys;
  };
  const webIrys = await getWebIrys();

  const tags = [{ name: 'Content-Type', value: 'text/plain' }];
  try {
    const receipt = await webIrys.upload(text, { tags });
    console.log('the receipt is: ', receipt);
    console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
    return receipt.id;
  } catch (e) {
    console.log('Error uploading data ', e);
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

async function getContainerInfoFromIrys(
  containerType,
  containerId,
  authorAddress
) {
  const myQuery = new Query({ url: 'https://node2.irys.xyz/graphql' });
  const results = await myQuery
    .search('irys:transactions')
    .from([authorAddress])
    .tags([
      { name: 'Content-Type', values: ['text/plain'] },
      { name: 'application-id', values: ['Anky Dementors'] },
      { name: 'container-type', values: [containerType] },
      { name: 'container-id', values: [containerId.toString()] },
    ])
    .sort('ASC')
    .limit(100);
  console.log('the results are: ', results);
  let prevCid;
  const containerPages = await Promise.all(
    results.map(async (result, index) => {
      const content = await fetch(`https://node2.irys.xyz/${result.id}`);
      console.log('the content is: ', content);
      const thisText = await content.text();
      if (index == 0) {
        prevCid = 0;
      } else {
        prevCid = results[index - 1].id;
      }
      return {
        cid: result.id,
        timestamp: result.timestamp,
        text: thisText,
        previousPageCid: prevCid,
      };
    })
  );
  console.log('the processed pages are: ', containerPages);

  return containerPages;
}

module.exports = {
  uploadToIrys,
  fetchContentFromIrys,
  getContainerInfoFromIrys,
};