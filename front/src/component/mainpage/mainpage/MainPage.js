import React from "react"
import BannerSlider from "./BannerSlider"
import IconMenu from "./IconMenu"
import InfoBoxes from "./InfoBoxes"
import CommunitySection from "./CommunitySection"
import ExternalLinks from "./ExternalLinks"
import "./MainPage.css"

const MainPage = () => {
  return (
    <div className="main-page">
      <main className="main-content">
        <BannerSlider />
        <IconMenu />
        <InfoBoxes />
        <CommunitySection />
        <ExternalLinks />
      </main>
    </div>
  )
}

export default MainPage