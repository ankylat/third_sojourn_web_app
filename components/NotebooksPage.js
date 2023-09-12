import { usePrivy, useWallets } from '@privy-io/react-auth';
import React, { useState, useEffect, useCallback } from 'react';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useContractRead } from 'wagmi';
import Link from 'next/link';
import Button from './Button';
import { TokenboundClient } from '@tokenbound/sdk';
import { usePWA } from '../context/pwaContext';
import CreateNotebookTemplate from './CreateNotebookTemplate';
import TemplatesList from './TemplatesList';

const NotebooksPage = () => {
  const { login, ready, authenticated } = usePrivy();
  const { userAppInformation } = usePWA();

  const [displayCreateNotebook, setDisplayCreateNotebook] = useState(false);

  if (!userAppInformation)
    return (
      <div className='text-white'>
        <p>If you want to understand how this will work...</p>
        <p>Help me code it!</p>
        <a
          href='https://www.githubg.com/ankylat/smart_contracts'
          target='_blank'
        >
          https://www.githubg.com/ankylat/smart_contracts
        </a>
      </div>
    );

  return (
    <div>
      {/* <h2 className='text-white'>Templates</h2>
      <div>
        <TemplatesList />
      </div>
      <h2 className='text-white'>Notebooks</h2> */}

      {/* {userAppInformation?.wallet?.address && (
          <p>
            Your embedded wallet address is:{' '}
            {userAppInformation?.wallet?.address}
          </p>
        )}

        {userAppInformation?.ankyIndex && (
          <p>The index of your anky is: {userAppInformation?.ankyIndex}</p>
        )} */}
      {/* {userAppInformation?.tbaAddress && (
          <>
            <p>
              The address of the Token Bound Account associated with your anky
              is: {userAppInformation?.tbaAddress}
            </p>
            <div className='w-48 mt-4 mx-auto'>
              <Button
                buttonAction={() => {
                  setDisplayCreateNotebook(x => !x);
                }}
                buttonColor={
                  displayCreateNotebook ? 'bg-red-300' : 'bg-green-300'
                }
                buttonText={
                  displayCreateNotebook ? 'cancel' : 'create notebook template'
                }
              />
            </div>
          </>
        )} */}

      {displayCreateNotebook && (
        <CreateNotebookTemplate userAnky={userAppInformation} />
      )}
    </div>
  );
};

export default NotebooksPage;
