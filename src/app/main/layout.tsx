import React, { PropsWithChildren } from "react";
import Header from "../components/header";


const HomeLayout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <main className="flex min-w-screen flex-col">
      <Header />
      <div className="inline">
        {children}
      </div>
    </main>
  );
};

export default HomeLayout;