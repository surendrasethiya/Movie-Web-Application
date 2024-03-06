// App.js

import React from 'react';
import './App.css';
import Movie from './components/Movie';

function App() {
  return (
    <div className="App light-mode"> {/* Default to light mode */}
      <Movie />
    </div>
  );
}

export default App;
