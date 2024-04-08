// components/Layout.js

import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <main className="main-content-layout pb-8">{children}</main>
    </>
  );
};

export default Layout;
