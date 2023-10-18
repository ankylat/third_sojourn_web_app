import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Link from 'next/link';
import Button from '../components/Button';
import AnkyDementorsAbi from '../lib/ankyDementorsAbi.json'; // Assuming you have the ABI
import { useUser } from '../context/UserContext';
import { processFetchedDementor } from '../lib/notebooks.js';
import Spinner from './Spinner';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import DementorGame from './DementorGame';

const dummyDementorData = {
  title: 'The Eternal Exploration',
  description:
    'This chapter explores the continuous journey of self-exploration, embracing the beauty of each moment and the willingness to transform.',
  prompts:
    'What does it mean to live in the present moment?%%What is the gift of this moment?%%How does self-inquiry lead to transformation?%%What is the beauty of becoming the present moment?%%How does the willingness to explore shape our experiences?%%What is the importance of the practice and repetition in self-exploration?%%How does the perception of words and experiences evolve over time?%%Why is the quest for self-knowledge essential for authentic connection?',
};

function DementorPage({
  userAnky,
  router,
  alchemy,
  setLifeBarLength,
  lifeBarLength,
}) {
  const { authenticated, login, getAccessToken } = usePrivy();
  const [dementorData, setDementorData] = useState(null);
  const [text, setText] = useState('');
  const [time, setTime] = useState(0);
  const [loadingSavingNewPage, setLoadingSavingNewPage] = useState(false);
  const [loadingDementor, setLoadingDementor] = useState(true);
  const [dementorsContract, setDementorsContract] = useState(null);
  const [isUserSureThatUserIsReady, setIsUserSureThatUserIsReady] =
    useState(false);
  const [writingGameProps, setWritingGameProps] = useState(null);
  const [dementorWasUpdated, setDementorWasUpdated] = useState(false);
  const [mintingNotebook, setMintingNotebook] = useState(false);
  const [userIsReadyToWrite, setUserIsReadyToWrite] = useState(false);
  const wallets = useWallets();
  console.log('the wallets are: ', wallets);
  const wallet = wallets.wallets[0];

  const { id } = router.query;
  useEffect(() => {
    console.log('inside here', id, wallet);

    if (id && wallet) fetchDementorData(id);
  }, [id, wallet]);

  async function fetchDementorData(dementorId) {
    console.log('inside the fetch dementor data', userAnky);
    if (!wallet.address) return;
    let provider = await wallet?.getEthersProvider();
    let signer;

    if (provider) {
      signer = await provider.getSigner();
    } else {
      return;
    }
    console.log('before calling the anky dementors contract', provider);
    const ankyDementorsContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ANKY_DEMENTORS_CONTRACT,
      AnkyDementorsAbi,
      signer
    );
    setDementorsContract(ankyDementorsContract);
    console.log('the dementor id', dementorId);
    const data = await ankyDementorsContract.getCurrentPage(dementorId);
    console.log(
      'in here, the data of the page that comes in the dementor is, ',
      data
    );
    const processedData = await processFetchedDementor(data);
    console.log('the data is:', processedData);
    setDementorData(processedData);
    setLoadingDementor(false);
  }

  async function userIsReadyToWriteTrigger() {
    const writingGameParameters = {
      notebookType: 'dementor',
      backgroundImage: null, // You can modify this if you have an image.
      uploadDementorPageToSmartContract: uploadDementorPageToSmartContract,
    };
    setWritingGameProps(writingGameParameters);
    setUserIsReadyToWrite(true);
  }

  async function uploadDementorPageToSmartContract(finishText, prompts) {
    console.log(
      'sending text to chatgtp, and then updating the smart contract with these new cids.'
    );
    setLoadingSavingNewPage(true);
    try {
      const authToken = await getAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/ai/get-subsequent-page`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ finishText, prompts }),
        }
      );
      const responseData = await response.json();
      const { thisWritingCid, newPageCid } = responseData;

      if (!thisWritingCid || !newPageCid)
        throw new Error('There was an error getting the cids for this.');

      console.log('this writing cid is: ', thisWritingCid);
      console.log('this new page cid is: ', newPageCid);

      console.log('the dementors contract is: ', dementorsContract);
      console.log('this dementors id is: ', id);
      if (dementorsContract) {
        const tx = await dementorsContract.writeDementorPage(
          id,
          thisWritingCid,
          newPageCid
        );
        await tx.wait();

        setLoadingSavingNewPage(false);
        setUserIsReadyToWrite(false);
        setDementorWasUpdated(true);
        // ************************** //
      }
    } catch (error) {
      console.error('Failed to submit writing:', error);
      setLoadingSavingNewPage(false);
    }
  }

  if (!authenticated) {
    return (
      <div className='text-white mt-3'>
        <p>you need to login first</p>
      </div>
    );
  }

  if (loadingDementor)
    return (
      <div>
        <Spinner />
        <p className='text-white'>loading</p>
      </div>
    );

  if (dementorWasUpdated) {
    return (
      <div className='text-white my-2'>
        {/* <p>
          The dementor was updated. The new page of lunamaria&apos;s story is:
        </p> */}
        <p>
          come back tomorrow and keep the inquiry going. this is more powerful
          than what you can imagine.
        </p>
        <div className='my-2 w-36 mx-auto'>
          <Link passHref href='/library'>
            <Button buttonText='library' buttonColor='bg-purple-600' />
          </Link>
        </div>
      </div>
    );
  }

  if (userIsReadyToWrite) {
    return (
      <DementorGame
        {...writingGameProps}
        prompts={dementorData.prompts.split('%%')}
        secondsPerPrompt={180}
        text={text}
        setLifeBarLength={setLifeBarLength}
        lifeBarLength={lifeBarLength}
        setText={setText}
        time={time}
        setTime={setTime}
        cancel={() => setUserIsReadyToWrite(false)}
      />
    );
  }

  return (
    <div className='md:w-1/2 p-2 mx-auto w-screen text-black md:text-white pt-5'>
      <h2 className='text-3xl'>{dementorData.title}</h2>
      <p className='italic'>{dementorData.description}</p>
      <div className='my-2 w-96 flex'>
        {!isUserSureThatUserIsReady ? (
          <Button
            buttonText='im ready to write'
            buttonAction={() => setIsUserSureThatUserIsReady(true)}
            buttonColor='bg-green-700'
          />
        ) : (
          <Button
            buttonText='lets do this'
            buttonAction={userIsReadyToWriteTrigger}
            buttonColor='bg-green-600'
          />
        )}

        <Link passHref href='/library'>
          <Button buttonText='library' buttonColor='bg-purple-600' />
        </Link>
      </div>
      {isUserSureThatUserIsReady && (
        <div className=''>
          <p className='mt-2'>each page in a dementor has 8 prompts.</p>
          <p className='mt-2'>each writing session lasts 24 minutes.</p>
          <p className='mt-2'>3 minutes per prompt.</p>
          <p className='mt-2'>each one a journey into yourself.</p>
          <p className='mt-2'>bringing out everything that you have inside.</p>
          <h2 className='text-xl my-2'>instructions</h2>
          <p className='mt-2'>
            just write, doing the best you can to answer the prompt at hand.
          </p>
          <p className='mt-2'>
            when you reach the 180 second mark, the time will stop, the
            container will block, and youll have time to read the next one.
          </p>
          <p className='mt-2'>
            when you are ready, just press the space bar and continue writing.
          </p>
          <p className='mt-2'>you&apos;ll understand the mechanics fast.</p>
        </div>
      )}
    </div>
  );
}

export default DementorPage;
