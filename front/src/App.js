import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CommunityRouter from './component/board/routes/CommunityRouter';
import SubHeader from './component/board/Layouts/Header';
import Header from './component/mainpage/components/Header';
import Footer from './component/mainpage/components/Footer';
import MainPage from './component/mainpage/mainpage/MainPage';
import CounselingRouter from './component/board/routes/CounselingRouter';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <div style={{ height: '135px' }}></div>
        
        <Header/>
        <Routes>
          {CommunityRouter}
          {CounselingRouter}
          <Route path='/' element={<MainPage />} />
        </Routes>
        <SubHeader />
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
