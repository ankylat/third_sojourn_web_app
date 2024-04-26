import React from "react";
import Button from "../Button";
import TextStreamer from "../TextStreamer";
import Image from "next/image";

const Instructions = ({ ankyverseDay }) => {
  return (
    <>
      <section className="h-screen w-full flex justify-around flex-col md:flex-row ">
        <div className="w-full md:w-1/2 bg-black h-full flex items-center justify-center">
          <div className="relative">
            <Image src="/images/darkoh.png" width={333} height={555} />
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full py-8 px-4 md:px-0 md:py-0 flex flex-col items-center justify-center">
          <div className="w-96">
            <h2 className="text-3xl mb-8">1. Obtén un Anky Mentor</h2>
            <p>
              Para participar en esta experiencia colectiva necesitas una llave.
              Tu mentor es esa llave.
            </p>
            <div className="mt-4 mb-4 w-fit">
              <a
                href={`https://opensea.io/collection/anky-mentors`}
                target="_blank"
              >
                <Button
                  buttonText="explorar mentores"
                  buttonColor="bg-purple-200"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen w-full flex justify-around flex-col-reverse  md:flex-row ">
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center">
          <div className="w-96">
            <h2 className="text-3xl mb-8">2. Ven a escribir todos los días</h2>
            <p>
              Tu misión es escribir 8 minutos. Si quieres puedes explorar el
              tema del día.
            </p>
            <div className="mt-4 w-fit">
              <Button
                buttonText="escribe"
                buttonAction={() => {
                  if (!sessionStarted) {
                    setAlreadyStartedOnce(true);
                    handleClick();

                    if (!alreadyStartedOnce) {
                      setTextareaHidden(true);
                    }
                  }
                }}
                buttonColor="bg-purple-200"
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-black flex-col  py-8  md:py-0 h-full flex items-center justify-center">
          <p className="text-purple-400 mb-4">tema de hoy:</p>
          <div className="relative w-full px-4 md:w-2/3">
            <TextStreamer text={ankyverseDay.prompt["en"]} />
          </div>
        </div>
      </section>{" "}
      <section className="h-screen w-full flex justify-around flex-col md:flex-row ">
        <div className="w-full md:w-1/2 bg-black h-full flex items-center justify-center">
          <div className="relative rounded-xl border-white border-2 overflow-hidden">
            <Image src="/images/librarian.png" width={666} height={333} />
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center">
          <div className="w-96">
            <h2 className="text-3xl mb-8">
              3. lee el capítulo del día anterior
            </h2>
            <p>
              Nuesto modelo de IA procesa todo lo que se escribe en un
              determinado día y con eso escribe el capítulo de ese día.
            </p>
            <p>Estamos haciendo historia juntos.</p>
            <div className="mt-4 w-fit">
              <a
                href={`https://paragraph.xyz/@ankytheape/chapter-${
                  ankyverseDay.wink - 2
                }`}
                target="_blank"
              >
                <Button buttonText="read book" buttonColor="bg-purple-200" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Instructions;
