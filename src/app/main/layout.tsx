import React, { PropsWithChildren } from "react";
import Header from "../components/header";


const HomeLayout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <main className="flex min-w-screen h-screen flex-col">
      <Header />
      <div className="inline h-screen overflow-y-auto">
        {children}
      </div>
    </main>
  );
};

export default HomeLayout;