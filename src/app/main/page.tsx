import React from "react";
import People from "./people/page";


const Home: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col">
      <People />
    </main>
  );
};

export default Home;
