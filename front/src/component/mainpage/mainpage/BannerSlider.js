import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "./BannerSlider.css"

const BannerSlider = () => {
  const banners = [
    { image: "./images/banners/banner_1.png", alt: "Banner 1", url: "https:// " },
    { image: "./images/banners/banner_2.png", alt: "Banner 2", url: "https:// " },
    { image: "./images/banners/banner_3.png", alt: "Banner 3", url: "https:// " },
  ]

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <div className="banner-slider-container">
      <div className="banner-slider">
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <div key={index}>
              <a href={banner.url} target="_blank" rel="noopener noreferrer">
                <img src={banner.image || "/placeholder.svg"} alt={banner.alt} className="banner-image" />
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default BannerSlider