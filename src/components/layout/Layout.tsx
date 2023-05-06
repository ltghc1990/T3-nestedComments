import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <div>
      <div className=" mx-auto max-w-screen-2xl border-2 border-red-300  sm:px-4 md:px-8 lg:px-16">
        {children}
      </div>
    </div>
  );
};

export default Layout;
