import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ExternalLinks.css'; // 분리된 스타일 파일

const ExternalLinks = () => {
  const links = [
    { name: '대학 홈페이지', url: 'https://www.university.ac.kr' },
    { name: '학사정보시스템', url: 'https://student.university.ac.kr' },
    { name: '이러닝', url: 'https://elearning.university.ac.kr' },
    { name: '산학협력단', url: 'https://industry.university.ac.kr' },
    { name: '대학일자리센터', url: 'https://career.university.ac.kr' },
    { name: '국제교류원', url: 'https://international.university.ac.kr' },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 5 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 320,
        settings: { slidesToShow: 2 }
      }
    ]
  };

  return (
    <div className="external-links-container">
      <h2 className="external-links-title">관련 링크</h2>
      <Slider {...settings}>
        {links.map((link, index) => (
          <div key={index} className="external-links-slide">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              {link.name}
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ExternalLinks;
