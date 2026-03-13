import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./page/LandingPage";
import Sendit from "./page/Sendit";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sendit" element={<Sendit />} />
      </Routes>
    </>
  );
};

export default App;
