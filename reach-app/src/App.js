import React from 'react';
import Header from './components/Header';
import HexagonalGrid from './components/HexagonalGrid';
import CollapsiblePanel from './components/CollapsiblePanel';
function App() {
  return (
    <div className="App">
      <Header />
      <HexagonalGrid />
      <CollapsiblePanel />
    </div>
  );
}
export default App;