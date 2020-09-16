import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Header from "./components/header/header.component"
import MainSection from './components/main-section/main-section.component';

function App() {
  return (
    <div className="App">
        <Header/>
        <MainSection/>
    </div>
  );
}

export default App;
