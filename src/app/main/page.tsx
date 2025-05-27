import React from "react";
import CifrasPage from "./reportes/cifras/page";


const Home: React.FC = () => {
  return (
    <main className="flex h-screen flex-col">
      <CifrasPage />
    </main>
  );
};

export default Home;
