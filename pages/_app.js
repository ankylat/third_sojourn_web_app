import "../styles/globals.css";
import { useEffect, useState } from "react";
import { Montserrat_Alternates } from "next/font/google";
import { appWithTranslation } from "next-i18next";
import axios from "axios";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import Button from "../components/Button";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { base } from "@wagmi/chains";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Head from "next/head";
import { SettingsProvider } from "../context/SettingsContext";
import { UserProvider } from "../context/UserContext";

import Navbar from "../components/Navbar";
import ErrorBoundary from "../components/ErrorBoundary";
import WritingGame from "../components/WritingGame";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400"],
});

const configureChainsConfig = configureChains([base], [publicProvider()]);

function MyApp({ Component, pageProps }) {
  const [isArtGenerated, setIsArtGenerated] = useState(false);
  const [wantsToMint, setWantsToMint] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isTextareaClicked, setIsTextareaClicked] = useState(false);
  const [displayWritingGame, setDisplayWritingGame] = useState(false);
  const [blackBackgroundVisible, setBlackBackgroundVisible] = useState(true);
  const [show, setShow] = useState(false);
  const [globalText, setGlobalText] = useState("");

  useEffect(() => {
    // Mock loading time with setTimeout, adjust to your needs or remove if not needed
    setTimeout(() => {
      const text =
        getSessionsText() ||
        "la tierra bajo mis pies. la tierra que me sostiene. la tierra que me da vida. la tierra que me permite ser. la tierra que me contiene. la tierra que me hace sentirme anclado en esta sensación de ser yo. de encontrarme conmigo mismo. de abrazarme a través de lo que tengo adentro. de reconocerme con lo que tengo adentro. de estar con lo que tengo adentro, y de tenerlo como parte de lo que hay. como parte de lo que soy. como parte de eso que me hace avanzar. sostenerme. la tierra que me sostiene, y que da vida. la tierra que abraza, y me da calor. el cúmulo de experiencias que me hacen sentir vivo, y que están acá. el abrazo de la vida que me da consuelo. y que me tiene pudiendo vivir. estoy vivo gracias a esta tierra que me sostiene. nací en santiago. nací en la ciudad donde viví la mayor parte del tiempo. nací en ese lugar. nací en esa ciudad. nací donde viví mi vida. nací en esa ciudad. y qué es lo que me trae la ciudad de santiago? cómo es que me siento aterrizado y anclado en mi y en mi quehacer siendo parte de esa ciudad? de dónde viene la nocion de seguridad? qué es lo que me entrega? qué es lo que me hace sentir? qué es lo que abraza? qué es lo que manifiesta? la tierra me sostiene, y acá estamos, abrazándola.";
      if (text.length > 30) {
        const svgElement = generateArtFromText(text);
        const serializedSVG = new XMLSerializer().serializeToString(svgElement);
        const svgBase64 = btoa(unescape(encodeURIComponent(serializedSVG)));
        setBackgroundImage(`url('data:image/svg+xml;base64,${svgBase64}')`);
      }
      // setIsArtGenerated(true);
      // Hide the black background after the art is generated or if there's no art
      setBlackBackgroundVisible(false);
    }, 8); // Mock loading time, set to 0 or remove if not needed
  }, []);

  function serializeSVG(svgElement) {
    return new XMLSerializer().serializeToString(svgElement);
  }

  function generateArtFromText(text) {
    const svgNS = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.style.width = "100%";
    svg.style.height = "100%";

    // Generate shapes based on the text
    for (let i = 0; i < text.length; i++) {
      let rect = document.createElementNS(svgNS, "rect");
      let x = (i * 10) % 100; // Example positioning
      let y = Math.floor((i * 10) / 100) * 10;
      let height = 5;
      let width = (text.charCodeAt(i) % 50) / 10;
      let color = `hsl(${text.charCodeAt(i) % 360}, 50%, 50%)`;

      rect.setAttribute("x", x.toString());
      rect.setAttribute("y", y.toString());
      rect.setAttribute("width", width.toString());
      rect.setAttribute("height", height.toString());
      rect.setAttribute("fill", color);
      svg.appendChild(rect);
    }

    return svg;
  }

  const handleClose = () => setShow(false);

  const handleLogin = async (user) => {};

  function getSessionsText() {
    try {
      let text = "";
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("writingSession-")) {
          const session = JSON.parse(localStorage.getItem(key));
          text += session.text || "";
        }
      }
      return text;
    } catch (error) {
      console.log("there was an error");
    }
  }

  return (
    <main
      className={`${
        montserratAlternates.className
      } h-screen flex flex-col background-transition ${
        isTextareaClicked ? "withoutBg" : "bodyBg"
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Head>
        <title>anky</title>
        <meta
          name="description"
          content="The antidsote to writers block: just write."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="application-name" content="Anky" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Anky" />
        <meta name="description" content="Tell us who you are" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#21152C" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/images/touch/homescreen48.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/touch/homescreen168.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/touch/homescreen192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/images/touch/homescreen168.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/touch/homescreen48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="images/touch/homescreen48.png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Righteous:300,400,500"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://anky.lat" />
        <meta name="twitter:title" content="Anky" />
        <meta name="twitter:description" content="Tell us who you are" />
        <meta
          name="twitter:image"
          content="https://anky.lat/images/touch/homescreen168.png"
        />
        <meta name="twitter:creator" content="@kithkui" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Anky" />
        <meta property="og:description" content="Tell us who you are" />
        <meta property="og:site_name" content="Anky" />
        <meta property="og:url" content="https://anky.lat" />
        <meta
          property="og:image"
          content="https://anky.lat/images/touch/homescreen144.png"
        />
        <script src="/main.js" defer></script>
      </Head>

      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        onSuccess={handleLogin}
        config={{
          loginMethods: ["wallet"],
          appearance: {
            theme: "dark",
            accentColor: "#364CAC",
            logo: "",
          },
        }}
      >
        <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
          <ErrorBoundary>
            <UserProvider>
              <SettingsProvider>
                {!displayWritingGame ? (
                  // Render the rest of the app
                  <>
                    <Navbar
                      isTextareaClicked={isTextareaClicked}
                      setIsTextareaClicked={setIsTextareaClicked}
                      setShow={setShow}
                    />
                    <Component
                      {...pageProps}
                      isTextareaClicked={isTextareaClicked}
                      setIsTextareaClicked={setIsTextareaClicked}
                      show={show}
                      handleClose={handleClose}
                      displayWritingGame={displayWritingGame}
                      setDisplayWritingGame={setDisplayWritingGame}
                    />
                  </>
                ) : (
                  <WritingGame setDisplayWritingGame={setDisplayWritingGame} />
                )}
              </SettingsProvider>
            </UserProvider>
          </ErrorBoundary>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </main>
  );
}

export default appWithTranslation(MyApp);
