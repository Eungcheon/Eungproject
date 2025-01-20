import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import CommunityRouter from './routes/CommunityRouter';
import Header from './Layouts/Header';
import CounselingRouter from './routes/CounselingRouter';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <Routes>
          {CommunityRouter}
          {CounselingRouter}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
