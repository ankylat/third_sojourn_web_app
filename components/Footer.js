import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <section className="px-2 md:px-16 h-fit md:h-72 bg-purple-400 w-full flex justify-around py-8 justify-between flex-col md:flex-row ">
      <div className="flex flex-col w-fit">
        <Link href="/" className="w-32 h-16 relative cursor-pointer" passHref>
          <Image src="/images/anky-logo.png" fill />
        </Link>
        <div className="text-xl mt-4">© 2024</div>
        <div className="text-xl mt-4">
          <Link href="/terms-and-conditions">Privacy - Terms</Link>
        </div>
      </div>
      <div className="flex flex-col w-fit">
        <div className="text-xl mt-4">
          <Link href="/product">Product</Link>
        </div>
      </div>
      <div className="flex flex-col w-fit">
        <div className="text-xl mt-4">
          <Link href="/features">Features</Link>
        </div>
      </div>
      <div className="flex flex-col w-fit">
        <div className="text-xl mt-4">
          <Link href="/newen">$newen</Link>
        </div>
      </div>
      <div className="flex flex-col w-fit">
        <div className="text-xl mt-4">
          <a href="https://t.me/ankytheape" target="_blank">
            telegram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Footer;
