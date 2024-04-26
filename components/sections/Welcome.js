import React from "react";
import Image from "next/image";

const Welcome = () => {
  return (
    <section
      className="h-screen py-8 md:py-0 bg-gray-200 md:h-screen w-full flex flex-col justify-around items-center  md:flex-row px-8 md:px-12"
      id="welcome"
    >
      <div className="w-full md:w-1/2 md:h-1/3 mb-4 md:mb-0 h-48 relative">
        <Image src="/images/logo.svg" fill />
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-3xl">Bienvenid@</h2>
        <p className="mt-4">
          Anky es un marco de referencia para transformar en un juego lo que es
          fundamentalmente difícil de hacer: conocerte a ti mism@.
        </p>
        <p className="mt-4">
          Ocupamos distintas herramientas para desarrollar una práctica
          concreta: escribir, todos los días, 8 minutos.
        </p>
      </div>
    </section>
  );
};

export default Welcome;
