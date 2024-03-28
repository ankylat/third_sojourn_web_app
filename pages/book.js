import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Button from "../components/Button";
import Link from "next/link";

const TermsAndConditions = () => {
  const [hasUserSigned, setHasUserSigned] = useState(false);
  const { authenticated, login } = usePrivy();
  return (
    <section className="w-full md:w-1/2 mx-auto py-8 px-4 grow overflow-y-scroll">
      <h2 class="text-xl font-bold mb-4">anky first chapter</h2>
    </section>
  );
};

export default TermsAndConditions;
