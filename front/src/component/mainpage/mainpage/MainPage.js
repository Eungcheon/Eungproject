import React from 'react';
import BannerSlider from './BannerSlider';
import IconMenu from './IconMenu';
import InfoBoxes from './InfoBoxes';
import CommunitySection from './CommunitySection';
import ExternalLinks from './ExternalLinks';
import './MainPage.css'; // 새로운 스타일 파일 추가

const MainPage = () => {
  return (
    <div className="main-page-container">
      <BannerSlider />
      <IconMenu />
      <InfoBoxes />
      <CommunitySection />
      <ExternalLinks />
    </div>
  );
};

export default MainPage;
