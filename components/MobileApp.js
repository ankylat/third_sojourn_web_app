import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Image from 'next/image';
import { Righteous, Dancing_Script } from 'next/font/google';
import { getAnkyverseDay, getAnkyverseQuestion } from '../lib/ankyverse';
import { createTBA, airdropAnky } from '../lib/backend';
import IndividualEulogiaDisplayPageMobile from './eulogias/IndividualEulogiaDisplayPageMobile.js';
import NewEulogiaPageMobile from './eulogias/NewEulogiaPageMobile.js';
import IndividualNotebookPageMobile from './notebook/IndividualNotebookPageMobile.js';

const sections = [
  {
    question: 'why?',
    image: 'why.png',
    oneLiner:
      'because humanity is awakening and it is a hard process to go through.',
  },
  {
    question: 'what?',
    image: 'what.png',
    oneLiner:
      'an interface to develop open source practical tools for you to realize who you really are. ',
  },
  {
    question: 'when?',
    image: 'when.png',
    oneLiner: 'forever on the blockchain. here. now.',
  },
  {
    question: 'where?',
    image: 'where.png',
    oneLiner: 'through the internet.',
  },
  {
    question: 'who?',
    image: 'who.png',
    oneLiner: 'those that are serious about the quest for truth.',
  },
  {
    question: 'how?',
    image: 'how.png',
    oneLiner:
      'by inspiring you with the raw truth that each of us has to offer.',
  },
];

const MobileApp = () => {
  const { login, authenticated, user, logout } = usePrivy();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [lifeBarLength, setLifeBarLength] = useState(0);
  const { userAppInformation, appLoading } = useUser();

  function getComponentForRoute(route) {
    console.log('in here', userAppInformation);
    switch (route) {
      case '/eulogias/new':
        return <NewEulogiaPageMobile userAnky={userAppInformation} />;
      case `/eulogias/${route.split('/').pop()}`:
        return (
          <IndividualEulogiaDisplayPageMobile
            setLifeBarLength={setLifeBarLength}
            lifeBarLength={lifeBarLength}
          />
        );
      case `/notebook/${route.split('/').pop()}`:
        return (
          <IndividualNotebookPageMobile
            setLifeBarLength={setLifeBarLength}
            lifeBarLength={lifeBarLength}
          />
        );

      default:
        return (
          <div className='p-4 w-full text-black h-screen'>
            <div className='flex rounded-full bg-purple-200 w-3/5 mx-auto h-18'>
              <div className='w-1/4 flex justify-center items-center'>
                <div className='w-12 h-12 aspect-square rounded-full pl-10 relative overflow-hidden'>
                  <Image src='/ankys/2.png' fill alt='anky' />
                </div>
              </div>

              <div className='w-3/4 py-4 px-2 flex justify-center items-center'>
                <p className='text-2xl'>lunamaria</p>
              </div>
            </div>
            <Link href='/m/user/journals' passHref>
              <div className='bg-yellow-400 w-5/6 mx-auto h-16 rounded-2xl mt-4 flex items-center'>
                <p className='text-white text-3xl text-center w-9/12 mx-auto'>
                  journals ({userAppInformation.userJournals.length})
                </p>
              </div>
            </Link>
            <Link href='/m/user/eulogias' passHref>
              <div className='bg-orange-400 w-5/6 mx-auto h-16 rounded-2xl mt-4 flex items-center'>
                <p className='text-white text-3xl text-center w-9/12 mx-auto'>
                  eulogias ({userAppInformation.userEulogias.length})
                </p>
              </div>
            </Link>

            <Link href='/m/user/notebooks' passHref>
              <div className='bg-blue-400 w-5/6 mx-auto h-16 rounded-2xl mt-4 flex items-center'>
                <p className='text-white text-3xl text-center w-9/12 mx-auto'>
                  notebooks ({userAppInformation.userNotebooks.length})
                </p>
              </div>
            </Link>
            <div className='w-5/6 mx-auto'>
              <p>all what you see here is happening in real time.</p>
              <p className='mt-2'>
                every day a new piece of the story is wrote.
              </p>
            </div>
          </div>
        );
    }
  }

  if (appLoading) {
    return (
      <div className='h-screen bg-black w-screen flex justify-center items-center'>
        <h2 className='text-white text-6xl'>anky</h2>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className='h-screen'>
        {sections.map((x, i) => (
          <Element section={x} key={i} />
        ))}
        <div className='h-1/7 p-4 w-full flex justify-center items-center bg-black'>
          <p onClick={login} className='text-white text-2xl'>
            login
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed h-screen w-screen'>
      <div
        className={`bg-white relative overflow-y-scroll flex flex-col items-center h-full w-full bg-cover bg-center`}
      >
        {getComponentForRoute(router.pathname)}
      </div>
    </div>
  );
};

export default MobileApp;

const Element = ({ section }) => {
  const [opened, setOpened] = useState(false);
  console.log('the section is: ', section);
  return (
    <div
      onClick={() => setOpened(x => !x)}
      className='h-24 p-4 w-full relative bg-cover'
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/ankys/${section.image}')`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <p className='text-white text-2xl'>{section.question}</p>
      {opened && (
        <p
          className='text-white text-sm'
          dangerouslySetInnerHTML={{ __html: section.oneLiner }}
        ></p>
      )}
    </div>
  );
};
