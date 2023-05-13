import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <div>
      <div className="mx-auto max-w-screen-2xl border-2  ">
        <div className="sm:px-6 md:px-8 lg:px-12">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
