import React from "react";

import Scene from "./components/game/Scene";
import StatusBar from "./components/ui/StatusBar";
import SignupButton from "./components/buttons/Signup";

function App() {

  return (
    <div className="app">
      <StatusBar />
      <Scene />
      <SignupButton />
    </div>
  );
}

export default App;
