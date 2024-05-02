import React from "react";
import Layout from "../components/Layout";

const Newen = () => {
  return (
    <Layout>
      <div className="h-full p-2 ">
        <h1>Newen</h1>
        <p>
          For writing through Anky, our users will earn a cryptocurrency:
          $newen.
        </p>
        <p>
          This token exists on base blockchain, and it serves as the
          crystallization of life force.
        </p>
        <p>
          Writing through Anky requires a lot of focus, for a long period of
          time (8 minutes). This focus and energy is then transformed into this
          token, as a reward mechanism.
        </p>
        <p>
          if you want to learn more about $newen, the contract address is{" "}
          <a
            className="text-blue-600 hover:text-yellow-400"
            href="https://basescan.org/address/0xffe3cdc92f24988be4f6f8c926758dce490fe77e"
            target="_blank"
          >
            0xffe3CDC92F24988Be4f6F8c926758dcE490fe77E
          </a>
        </p>
        <p>
          and the tokenomics are{" "}
          <a
            className="text-blue-600 hover:text-yellow-400"
            href="https://docs.google.com/spreadsheets/d/1mebQUKLtL0syqWsV5LxKLUdJA6Boy2mhE3Qacsc4Dgg/edit#gid=0"
            target="_blank"
          >
            on this google doc
          </a>
        </p>
      </div>
    </Layout>
  );
};

export default Newen;
