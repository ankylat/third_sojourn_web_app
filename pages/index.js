import { usePrivy } from "@privy-io/react-auth";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import DesktopWritingGame from "../components/DesktopWritingGame";
import { getAnkyverseDay, getAnkyverseQuestion } from "../lib/ankyverse";

const LandingPage = ({
  displayWritingGameLanding,
  setDisplayWritingGameLanding,
  setLifeBarLength,
  lifeBarLength,
  setNewenBarLength,
  newenBarLength,
}) => {
  const [text, setText] = useState("");
  const ankyverseToday = getAnkyverseDay(new Date());
  const ankyverseQuestion = getAnkyverseQuestion(ankyverseToday.wink);

  const { authenticated, login } = usePrivy();
  const { userOwnsAnky, setUserAppInformation, userAppInformation } = useUser();

  if (displayWritingGameLanding) {
    return (
      <div
        className="h-full"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/primordia.png')",
          backgroundColor: "black",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <DesktopWritingGame
          ankyverseDate={`sojourn ${ankyverseToday.currentSojourn} - wink ${
            ankyverseToday.wink
          } - ${ankyverseToday.currentKingdom.toLowerCase()}`}
          userPrompt={ankyverseQuestion}
          setUserAppInformation={setUserAppInformation}
          userAppInformation={userAppInformation}
          setLifeBarLength={setLifeBarLength}
          text={text}
          setText={setText}
          lifeBarLength={lifeBarLength}
          displayWritingGameLanding={displayWritingGameLanding}
          setDisplayWritingGameLanding={setDisplayWritingGameLanding}
          countdownTarget={480}
          newenBarLength={newenBarLength}
          setNewenBarLength={setNewenBarLength}
        />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen  flex p-2">
      {authenticated ? (
        <div className="flex flex-col items-start">
          <p>you are logged in</p>
          {userOwnsAnky ? (
            <div>
              <p>you own an anky</p>
              <button onClick={() => setDisplayWritingGameLanding(true)}>
                write
              </button>
            </div>
          ) : (
            <div>
              <p>
                you dont own an anky, and need to get one on secondary to
                participate
              </p>
              <a
                href="https://opensea.io/collection/anky-mentors"
                target="_blank"
              >
                opensea
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start">
          <p>welcome to anky</p>
          <button onClick={login}>login</button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
