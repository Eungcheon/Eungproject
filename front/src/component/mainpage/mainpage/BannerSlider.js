import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './BannerSlider.css'; // 분리된 CSS 파일 import

const BannerSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="custom-banner-slider-container">
      <Slider {...settings}>
        <div className="custom-banner-slide">
          <img src="/images/banners/banner_1.png" alt="Banner 1" className="custom-banner-image" />
        </div>
        <div className="custom-banner-slide">
          <img src="/images/banners/banner_2.png" alt="Banner 2" className="custom-banner-image" />
        </div>
        <div className="custom-banner-slide">
          <img src="/images/banners/banner_3.png" alt="Banner 3" className="custom-banner-image" />
        </div>
      </Slider>
    </div>
  );
};

export default BannerSlider;
