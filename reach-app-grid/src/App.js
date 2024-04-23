import React from "react";

import Scene from "./components/game/Scene";

import StatusBar from "./components/ui/StatusBar";

function App() {
  return (
    <div className="app">
      <StatusBar />
      <Scene />
    </div>
  );
}

export default App;
