import React from 'react';
import Header from './Header';
import HexagonalGrid from './HexagonalGrid';
import CollapsiblePanel from './CollapsiblePanel';
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