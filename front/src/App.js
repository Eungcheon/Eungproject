import React from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';

// [ login ]
import User from './component/login/security/pages/User';
import Login from './component/login/security/pages/Login';
import Join from './component/login/security/pages/Join';
import Find from './component/login/security/pages/Find';

// [ mypage ]
import Counsel from './component/mypage/counsel/Counsel';
import Edit from './component/mypage/edit/Edit';
import Program from './component/mypage/program/Program';
import Secession from './component/mypage/secession/Secession';
import Employment from './component/mypage/employment/Employment';

// [ main ]
import Header from './component/mainpage/components/Header'
import Footer from './component/mainpage/components/Footer';
import MainPage from './component/mainpage/mainpage/MainPage';
import JobList from './component/mainpage/pages/JobList';
import Programs from './component/mainpage/pages/Programs';
import About from './component/mainpage/pages/About';
import Contact from './component/mainpage/pages/Contact';

// [ board ]
import CommunityRouter from './component/board/routes/CommunityRouter';
import CounselingRouter from './component/board/routes/CounselingRouter';

// [ recruitment ]
import MainRecruitment from './component/recruitment/MainPage/MainRecruitment';
import SuggestBoard from './component/recruitment/RecruitmentBoard/SuggestBoard';
import BbsDetail from './component/recruitment/RecruitmentBoard/BbsDetail';
import SuggestWrite from './component/recruitment/write/SuggestWrite';
import CampusBoard from './component/recruitment/RecruitmentBoard/CampusBoard';
import WorkBoard from './component/recruitment/RecruitmentBoard/WorkBoard';
import NoticeBoard from './component/recruitment/RecruitmentBoard/NoticeBoard';
import SystemBoard from './component/recruitment/RecruitmentBoard/SystemBoard';
import JobPostingBoard from './component/recruitment/RecruitmentBoard/JobPostingBoard';

// [ job ]
import AdminPage from "./component/job/AdminPage";
import JobProgram from "./component/job/JobProgram";
import JobDetail from "./component/job/JobDetail";

import Board from "./component/login/Board";
import BoardWrite from "./component/login/BoardWrite";
import BoardDetail from "./component/login/BoardDetail"

function App() {



  return (
      <div className="app-container">
        {/* 헤더의 높이만큼 여백을 확보 */}
        <div style={{ height: '135px' }}></div>
        <Header />
        <main>
          <Routes>
            <Route path="/board" element={<Board />} />
            <Route path="/board/write" element={<BoardWrite />} />
            <Route path="/board/detail/:boardId" element={<BoardDetail />} />
            {/* login */}
            <Route path="/login" element={<Login />} />
            <Route path="/find/:id" element={<Find />} />
            <Route path="/join" element={<Join />} />
            <Route path="/user" element={<User />} />

            {/* mypage */}
            <Route path='/myCounsel' element={<Counsel />} />
            <Route path='/myEdit' element={<Edit />} />
            <Route path='/myProgram' element={<Program />} />
            <Route path='/mySecession' element={<Secession />} />
            <Route path='/myEmployment' element={<Employment />} />

            {/* job */}
            <Route path="/programs" element={<JobProgram />} /> {/* JobProgram 내에 ProgramView 포함 */}
            <Route path="/admin" element={<AdminPage />} /> {/* 관리자 페이지 */}
            <Route path="/programs/:programId" element={<JobDetail />} /> {/* JobDetail 컴포넌트 경로 */}



            {/* recruitment */}
            <Route path='/mainRecruitment' element={<MainRecruitment />} />
            <Route path='/suggestBoard' element={<SuggestBoard />} />
            <Route path='/suggestWrite' element={<SuggestWrite />} />
            <Route path='/campusBoard' element={<CampusBoard />} />
            <Route path='/workBoard' element={<WorkBoard />} />
            <Route path='/noticeBoard' element={<NoticeBoard />} />
            <Route path='/systemBoard' element={<SystemBoard />} />
            <Route path='/jobPostingBoard' element={<JobPostingBoard />} />
            <Route path='/bbsDetail' element={<BbsDetail />} />


            {/* main */}
            <Route path='/' element={<MainPage />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />


            {/* board */}
            {CommunityRouter}
            {CounselingRouter}

          </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;

